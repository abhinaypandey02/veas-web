export type AuthTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

let currentTokens: AuthTokens = {
  accessToken: null,
  refreshToken: null,
};

const listeners = new Set<(tokens: AuthTokens) => void>();

export const tokenStore = {
  get() {
    return currentTokens;
  },
  set(tokens: AuthTokens) {
    currentTokens = tokens;
    listeners.forEach((listener) => listener(currentTokens));
  },
  subscribe(listener: (tokens: AuthTokens) => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
