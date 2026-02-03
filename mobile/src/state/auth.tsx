import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { tokenStore, type AuthTokens } from "./token-store";
import { clearTokens, loadTokens, saveTokens } from "../services/secure-store";
import * as authService from "../services/auth";

type AuthContextValue = {
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setTokens: (tokens: AuthTokens) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokensState] = useState<AuthTokens>({
    accessToken: null,
    refreshToken: null,
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadTokens()
      .then((loadedTokens) => {
        if (!mounted) return;
        tokenStore.set(loadedTokens);
        setTokensState(loadedTokens);
      })
      .finally(() => {
        if (mounted) {
          console.log("DEBUG: Auth hydrated");
          setIsHydrated(true);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = tokenStore.subscribe((nextTokens) => {
      setTokensState(nextTokens);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const setTokens = async (nextTokens: AuthTokens) => {
    tokenStore.set(nextTokens);
    await saveTokens(nextTokens);
  };

  const signIn = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    await setTokens({
      accessToken: response.accessToken ?? null,
      refreshToken: response.refreshToken ?? null,
    });
  };

  const signUp = async (email: string, password: string) => {
    const response = await authService.signUp(email, password);
    await setTokens({
      accessToken: response.accessToken ?? null,
      refreshToken: response.refreshToken ?? null,
    });
  };

  const signOut = async () => {
    tokenStore.set({ accessToken: null, refreshToken: null });
    setTokensState({ accessToken: null, refreshToken: null });
    await clearTokens();
    await authService.logout().catch(() => null);
  };

  const value = useMemo(
    () => ({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      isHydrated,
      signIn,
      signUp,
      signOut,
      setTokens,
    }),
    [tokens.accessToken, tokens.refreshToken, isHydrated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
