import { API_BASE_URL } from "../config";
import { tokenStore } from "../state/token-store";
import { clearTokens, saveTokens } from "./secure-store";
import { refreshAccessToken } from "./auth";

type ApiFetchOptions = RequestInit & {
  auth?: boolean;
  retryOnUnauthorized?: boolean;
};

async function handleUnauthorized(refreshToken: string | null) {
  if (!refreshToken) {
    tokenStore.set({ accessToken: null, refreshToken: null });
    await clearTokens();
    return null;
  }
  try {
    const refreshed = await refreshAccessToken(refreshToken);
    const nextTokens = {
      accessToken: refreshed.accessToken ?? null,
      refreshToken: refreshed.refreshToken ?? refreshToken,
    };
    tokenStore.set(nextTokens);
    await saveTokens(nextTokens);
    return nextTokens.accessToken;
  } catch {
    tokenStore.set({ accessToken: null, refreshToken: null });
    await clearTokens();
    return null;
  }
}

export async function apiFetch(path: string, options: ApiFetchOptions = {}) {
  const { auth = true, retryOnUnauthorized = true, headers, ...rest } = options;
  const tokens = tokenStore.get();
  const requestId = Math.random().toString(36).substring(7);
  const startTime = Date.now();

  console.log(`\n[API ${requestId}] 🚀 ${rest.method || 'GET'} ${path}`);
  console.log(`[API ${requestId}] 📋 Full URL: ${API_BASE_URL}${path}`);
  
  const requestHeaders: Record<string, string> = {
    ...((headers as Record<string, string> | undefined) || {}),
  };
  if (auth && tokens.accessToken) {
    const tokenPreview = tokens.accessToken.substring(0, 20) + '...';
    console.log(`[API ${requestId}] 🔐 Adding Bearer token: ${tokenPreview}`);
    requestHeaders.Authorization = `Bearer ${tokens.accessToken}`;
  } else if (auth && !tokens.accessToken) {
    console.warn(`[API ${requestId}] ⚠️  Auth required but no token found!`);
  }
  
  console.log(`[API ${requestId}] 📦 Headers:`, Object.keys(requestHeaders));
  if (rest.body && typeof rest.body === 'string') {
    console.log(`[API ${requestId}] 📝 Body: ${rest.body.substring(0, 100)}${rest.body.length > 100 ? '...' : ''}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
  });
  
  const duration = Date.now() - startTime;
  console.log(`[API ${requestId}] ✅ ${response.status} ${response.statusText} (${duration}ms)`);
  console.log(`[API ${requestId}] 📊 Content-Type: ${response.headers.get('content-type')}`);

  if (response.status === 401 && auth && retryOnUnauthorized) {
    console.warn(`[API ${requestId}] 🔄 Got 401, attempting token refresh...`);
    const nextAccessToken = await handleUnauthorized(tokens.refreshToken);
    if (!nextAccessToken) {
      console.error(`[API ${requestId}] ❌ Token refresh failed, returning 401`);
      return response;
    }
    console.log(`[API ${requestId}] ✨ Retrying with new token...`);
    const retryHeaders: Record<string, string> = {
      ...((headers as Record<string, string> | undefined) || {}),
      Authorization: `Bearer ${nextAccessToken}`,
    };
    const retryResponse = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: retryHeaders,
    });
    const retryDuration = Date.now() - startTime;
    console.log(`[API ${requestId}] ✅ Retry ${retryResponse.status} ${retryResponse.statusText} (${retryDuration}ms total)`);
    return retryResponse;
  }

  return response;
}
