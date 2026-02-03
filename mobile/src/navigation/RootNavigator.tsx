import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStack } from "./AuthStack";
import { MainStack } from "./MainStack";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { SplashScreen } from "../screens/SplashScreen";
import { useAuth } from "../state/auth";
import { useCurrentUser } from "../services/user";

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { accessToken, signOut } = useAuth();
  const { data: user, isLoading, error: userError } = useCurrentUser(Boolean(accessToken));

  console.log("DEBUG: RootNavigator", {
    hasToken: Boolean(accessToken),
    isLoading,
    hasUser: Boolean(user),
    userError: userError?.message,
  });

  useEffect(() => {
    if (accessToken && !isLoading && user === null) {
      signOut();
    }
  }, [accessToken, isLoading, user, signOut]);

  if (accessToken && isLoading) {
    return <SplashScreen />;
  }

  if (accessToken && !isLoading && user === null) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!accessToken ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : !user?.isOnboarded ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <Stack.Screen name="Main" component={MainStack} />
      )}
    </Stack.Navigator>
  );
}
