import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainTabs } from "./MainTabs";
import { OnboardingScreen } from "../screens/OnboardingScreen";

const Stack = createNativeStackNavigator();

export function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}
