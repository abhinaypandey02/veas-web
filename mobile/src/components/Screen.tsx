import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

type ScreenProps = {
  children: React.ReactNode;
  className?: string;
};

export function Screen({ children, className }: ScreenProps) {
  return (
    <LinearGradient
      colors={["#F9F5FF", "#F1EDFF", "#FFFFFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View pointerEvents="none" className="absolute inset-0">
        <View className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cosmic-lavender/40" />
        <View className="absolute top-32 -left-28 h-72 w-72 rounded-full bg-accent/20" />
      </View>
      <SafeAreaView className="flex-1" style={{ flex: 1 }}>
        <View className={`flex-1 ${className || ""}`} style={{ flex: 1 }}>
          {children}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
