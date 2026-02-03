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

  const requestHeaders: HeadersInit = {
    ...(headers || {}),
  };
  if (auth && tokens.accessToken) {
    requestHeaders.Authorization = `Bearer ${tokens.accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
  });

  if (response.status === 401 && auth && retryOnUnauthorized) {
    const nextAccessToken = await handleUnauthorized(tokens.refreshToken);
    if (!nextAccessToken) return response;
    const retryHeaders: HeadersInit = {
      ...(headers || {}),
      Authorization: `Bearer ${nextAccessToken}`,
    };
    return fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: retryHeaders,
    });
  }

  return response;
}
