import React from "react";
import { View } from "react-native";
import { cn } from "../utils/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "solid" | "default" | "soft";
};

export function Card({ children, className, variant = "default" }: CardProps) {
  const solidStyle = variant === "solid" ? { backgroundColor: "#FFFFFF" } : undefined;
  return (
    <View
      className={cn(
        "rounded-3xl border border-foreground/10 p-5",
        variant === "solid"
          ? "bg-white"
          : variant === "default"
            ? "bg-white/92"
            : "bg-white/82",
        className,
      )}
      style={{
        ...(solidStyle || {}),
        shadowColor: "#998FC7",
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 3,
      }}
    >
      {children}
    </View>
  );
}
