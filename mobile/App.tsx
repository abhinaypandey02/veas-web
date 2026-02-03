import "react-native-gesture-handler";
import "./global.css";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "./src/state/auth";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { SplashScreen } from "./src/screens/SplashScreen";

const queryClient = new QueryClient();

function AppShell() {
  const { isHydrated } = useAuth();
  const [fontsLoaded] = useFonts({
    VeasSerif: require("./assets/fonts/serif.woff2"),
    VeasSerifItalic: require("./assets/fonts/serif-italic.woff2"),
    VeasSans: require("./assets/fonts/sans.woff2"),
  });

  if (!isHydrated || !fontsLoaded) {
    return <SplashScreen />;
  }

  return <RootNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <StatusBar style="dark" />
          <AppShell />
        </NavigationContainer>
      </QueryClientProvider>
    </AuthProvider>
  );
}
