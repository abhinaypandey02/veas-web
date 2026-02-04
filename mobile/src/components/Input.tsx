import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { cn } from "../utils/cn";

type InputProps = {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  multiline?: boolean;
  editable?: boolean;
  helperText?: string;
};

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  multiline,
  editable = true,
  helperText,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View className="space-y-1">
      {label ? (
        <Text className="text-xs text-muted uppercase tracking-[0.24em]">
          {label}
        </Text>
      ) : null}
      <TextInput
        className={cn(
          "bg-white/90 border rounded-3xl px-4 py-3 text-foreground",
          isFocused ? "border-accent" : "border-foreground/10",
          multiline && "min-h-[96px]",
          !editable && "opacity-60",
        )}
        placeholder={placeholder}
        placeholderTextColor="#9B98A1"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        editable={editable}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {helperText ? <Text className="text-xs text-muted">{helperText}</Text> : null}
    </View>
  );
}
