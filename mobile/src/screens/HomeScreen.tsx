import React, { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { InsightCard } from "../components/InsightCard";
import { calculateChart } from "../services/chart";
import { streamChatMessage } from "../services/chat";
import { useCurrentUser } from "../services/user";
import { formatDateInput, formatTimeInput } from "../utils/date";

const insightPrompts = {
  daily:
    "Give me a short daily reflection for today. Keep it warm, grounded, and no jargon. Focus on emotions, relationships, and work energy.",
  weekly:
    "Give me a short weekly reflection for this week. Keep it warm, grounded, and no jargon. Focus on emotions, relationships, and work energy.",
  yearly:
    "Give me a short yearly reflection for this year. Keep it warm, grounded, and no jargon. Focus on emotions, relationships, and work energy.",
} as const;

type InsightKey = keyof typeof insightPrompts;

export function HomeScreen() {
  const { data: user } = useCurrentUser(true);
  const [insights, setInsights] = useState<Record<InsightKey, string>>({
    daily: "",
    weekly: "",
    yearly: "",
  });
  const [loadingKey, setLoadingKey] = useState<InsightKey | null>(null);
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const chartParams = useMemo(() => {
    if (!user?.dateOfBirth || !user?.placeOfBirth || !user?.timezoneOffset) return null;
    const dob = new Date(user.dateOfBirth);
    return {
      date: formatDateInput(dob),
      time: formatTimeInput(dob),
      location: user.placeOfBirth,
      timezoneOffset: user.timezoneOffset,
    };
  }, [user]);

  const { data: chart } = useQuery({
    queryKey: ["chart", chartParams?.date],
    enabled: Boolean(chartParams),
    queryFn: () => calculateChart(chartParams!),
  });

  const handleGenerate = async (key: InsightKey) => {
    if (loadingKey) return;
    setLoadingKey(key);
    try {
      await streamChatMessage(insightPrompts[key], (text) => {
        setInsights((prev) => ({ ...prev, [key]: text }));
      });
    } catch (error) {
      setInsights((prev) => ({
        ...prev,
        [key]: "We couldn’t generate this reflection right now. Please try again.",
      }));
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerClassName="px-6 pt-8 pb-20 space-y-8">
        <View className="space-y-2">
          <Text className="text-xs uppercase tracking-[0.4em] text-muted">
            {greeting}
          </Text>
          <Text className="text-3xl font-serif text-foreground">
            {user?.name ? user.name : "Welcome"}
          </Text>
          <Text className="text-sm text-muted">
            We align your chart with the real sky for clearer, calmer guidance.
          </Text>
        </View>

        {chart ? (
          <Card className="space-y-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs uppercase tracking-[0.24em] text-muted">
                Your Sun Sign
              </Text>
              <Text className="text-xs text-muted">Sidereal alignment</Text>
            </View>
            <View className="space-y-3">
              <View className="space-y-1">
                <Text className="text-[11px] uppercase tracking-[0.24em] text-muted">
                  The sign you think you are
                </Text>
                <Text className="text-2xl font-serif text-foreground">
                  {chart.sunSign.tropical}
                </Text>
              </View>
              <View className="h-px bg-foreground/10" />
              <View className="space-y-1">
                <Text className="text-[11px] uppercase tracking-[0.24em] text-muted">
                  Your actual sun sign
                </Text>
                <Text className="text-2xl font-serif text-foreground">
                  {chart.sunSign.sidereal}
                </Text>
              </View>
            </View>
            <Text className="text-xs text-muted">
              This shift often explains why your tropical sign never fully resonated.
            </Text>
          </Card>
        ) : (
          <Card variant="soft">
            <Text className="text-sm text-muted">
              Your chart is syncing with the real sky. We’ll personalize this soon.
            </Text>
          </Card>
        )}

        <View className="space-y-8">
          <InsightCard
            title="Daily prediction"
            description="A short check-in for the emotional weather of today."
            content={insights.daily}
            loading={loadingKey === "daily"}
            onGenerate={() => handleGenerate("daily")}
          />
          <InsightCard
            title="Weekly prediction"
            description="Themes you can lean into this week."
            content={insights.weekly}
            loading={loadingKey === "weekly"}
            onGenerate={() => handleGenerate("weekly")}
          />
          <InsightCard
            title="Yearly prediction"
            description="Your long-range mood and growth arc."
            content={insights.yearly}
            loading={loadingKey === "yearly"}
            onGenerate={() => handleGenerate("yearly")}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
