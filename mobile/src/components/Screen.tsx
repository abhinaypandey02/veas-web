import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = {
  children: React.ReactNode;
  className?: string;
};

export function Screen({ children, className }: ScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-background" style={{ flex: 1, backgroundColor: "#F9F5FF" }}>
      <View className={`flex-1 ${className || ""}`} style={{ flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
}
