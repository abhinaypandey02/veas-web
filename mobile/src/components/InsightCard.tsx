import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Button } from "./Button";

export function InsightCard({
  title,
  description,
  content,
  loading,
  onGenerate,
}: {
  title: string;
  description: string;
  content?: string;
  loading?: boolean;
  onGenerate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const preview =
    content && content.length > 180 && !expanded
      ? `${content.slice(0, 180).trim()}…`
      : content;

  return (
    <View className="bg-surface rounded-3xl border border-foreground/10 p-5 space-y-3">
      <View className="space-y-1">
        <Text className="text-xs uppercase tracking-[0.24em] text-muted">{title}</Text>
        <Text className="text-sm text-muted">{description}</Text>
      </View>
      {content ? (
        <Pressable
          className="bg-surface-highlight rounded-2xl p-4"
          onPress={() => setExpanded((prev) => !prev)}
        >
          <Text className="text-sm text-foreground leading-relaxed">{preview}</Text>
          {content.length > 180 ? (
            <Text className="text-xs text-muted mt-2">
              {expanded ? "Tap to collapse" : "Tap to expand"}
            </Text>
          ) : null}
        </Pressable>
      ) : (
        <Text className="text-sm text-muted">Tap generate when you’re ready.</Text>
      )}
      <Button
        title={loading ? "Generating..." : "Generate"}
        onPress={onGenerate}
        loading={loading}
      />
    </View>
  );
}
