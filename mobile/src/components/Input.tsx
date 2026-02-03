import React from "react";
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
  return (
    <View className="space-y-1">
      {label ? <Text className="text-xs text-muted uppercase tracking-widest">{label}</Text> : null}
      <TextInput
        className={cn(
          "bg-surface border border-foreground/10 rounded-2xl px-4 py-3 text-foreground",
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
      />
      {helperText ? <Text className="text-xs text-muted">{helperText}</Text> : null}
    </View>
  );
}
