import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
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
        "h-12 rounded-full items-center justify-center",
        variant === "primary" && "bg-foreground",
        variant === "secondary" && "border border-foreground/20",
        variant === "ghost" && "bg-transparent",
        (disabled || loading) && "opacity-60",
      )}
      onPress={onPress}
      disabled={disabled || loading}
    >
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
