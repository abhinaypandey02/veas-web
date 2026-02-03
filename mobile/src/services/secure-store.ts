import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "veas.accessToken";
const REFRESH_TOKEN_KEY = "veas.refreshToken";

export async function loadTokens() {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  ]);
  return {
    accessToken: accessToken || null,
    refreshToken: refreshToken || null,
  };
}

export async function saveTokens(tokens: {
  accessToken: string | null;
  refreshToken: string | null;
}) {
  if (tokens.accessToken) {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
  } else {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  }

  if (tokens.refreshToken) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
  } else {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }
}

export async function clearTokens() {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  ]);
}
