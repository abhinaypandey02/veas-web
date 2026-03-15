import "react-native-url-polyfill/auto";
import { addEnv } from "naystack/env";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  AuthWrapper,
  useAuthFetch,
  useToken,
} from "naystack/auth/email/client";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ApolloWrapper } from "naystack/graphql/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GlobalStateProvider } from "@/contexts/global-context";

addEnv("GRAPHQL_ENDPOINT", process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT!);
addEnv("EMAIL_AUTH_ENDPOINT", process.env.EXPO_PUBLIC_EMAIL_AUTH_ENDPOINT!);
addEnv("BASE_URL", process.env.EXPO_PUBLIC_BASE_URL!);

export default function LayoutWrapper() {
  return (
    <AuthWrapper
      onTokenUpdate={
        !!process.env.EXPO_PUBLIC_IS_BROWSER
          ? undefined
          : (token) => {
              if (token) {
                AsyncStorage.setItem("refresh", token);
              } else {
                AsyncStorage.removeItem("refresh");
              }
            }
      }
    >
      <ApolloWrapper>
        <GlobalStateProvider>
          <RootLayout />
        </GlobalStateProvider>
      </ApolloWrapper>
    </AuthWrapper>
  );
}

function RootLayout() {
  const colorScheme = useColorScheme();
  const token = useToken();
  const segments = useSegments();
  const router = useRouter();

  useAuthFetch(
    !process.env.EXPO_PUBLIC_IS_BROWSER
      ? () => AsyncStorage.getItem("refresh")
      : undefined,
  );

  useEffect(() => {
    // token === undefined means still loading
    if (token === undefined) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (token === null && !inAuthGroup) {
      // Not logged in, redirect to signup
      router.replace("/(auth)/signup");
    } else if (token && inAuthGroup) {
      // Logged in, redirect to home
      router.replace("/(tabs)");
    }
  }, [token, segments, router]);

  // Show loading screen while token is being determined
  if (token === undefined) {
    return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#0a7ea4" />
        </View>
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
