import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "../utils/cn";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  loading?: boolean;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled,
  loading,
}: ButtonProps) {
  return (
    <Pressable
      className={cn(
        "h-12 rounded-full items-center justify-center overflow-hidden",
        variant === "primary" && "bg-foreground",
        variant === "secondary" && "border border-foreground/20 bg-white/70",
        variant === "ghost" && "bg-transparent",
        (disabled || loading) && "opacity-60",
      )}
      style={
        variant === "primary"
          ? {
              shadowColor: "#998FC7",
              shadowOpacity: 0.28,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
              elevation: 6,
            }
          : undefined
      }
      onPress={onPress}
      disabled={disabled || loading}
    >
      {variant === "primary" ? (
        <LinearGradient
          colors={["#1A1A1A", "#2A2244", "#14248A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0"
        />
      ) : null}
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#FFFFFF" : "#1A1A1A"} />
      ) : (
        <Text
          className={cn(
            "text-sm tracking-wide",
            variant === "primary" && "text-white",
            variant !== "primary" && "text-foreground",
          )}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
