import React from "react";
import { Text, View } from "react-native";

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View className="space-y-1">
      <Text className="text-xs uppercase tracking-[0.24em] text-muted">{title}</Text>
      {subtitle ? <Text className="text-lg text-foreground font-serif">{subtitle}</Text> : null}
    </View>
  );
}
