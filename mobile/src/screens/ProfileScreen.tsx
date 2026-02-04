import React from "react";
import { Alert, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { useAuth } from "../state/auth";
import { useCurrentUser } from "../services/user";
import { loadPreferences, savePreferences } from "../services/preferences";
import { formatReadableDate, formatReadableTime } from "../utils/date";

export function ProfileScreen({ navigation }: { navigation: any }) {
  const { signOut } = useAuth();
  const { data: user } = useCurrentUser(true);
  const { data: prefs } = useQuery({
    queryKey: ["preferences"],
    queryFn: loadPreferences,
  });
  const savePreferencesMutation = useMutation({ mutationFn: savePreferences });

  const dateOfBirth = user?.dateOfBirth ? new Date(user.dateOfBirth) : null;

  const handleEdit = () => {
    const parentNav = navigation.getParent?.();
    if (parentNav) {
      parentNav.navigate("Onboarding", { mode: "edit" });
    } else {
      navigation.navigate("Onboarding", { mode: "edit" });
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerClassName="px-6 pt-8 pb-20 space-y-8">
        <View className="space-y-2">
          <Text className="text-xs uppercase tracking-[0.4em] text-muted">
            Your space
          </Text>
          <Text className="text-3xl font-serif text-foreground">Profile</Text>
          <Text className="text-sm text-muted">
            Manage your details and how you want Veas to show up.
          </Text>
        </View>

        <Card className="space-y-3">
          <Text className="text-xs uppercase tracking-[0.2em] text-muted">Birth details</Text>
          <Text className="text-sm text-foreground">{user?.name || ""}</Text>
          {dateOfBirth ? (
            <Text className="text-xs text-muted">
              {formatReadableDate(dateOfBirth)} · {formatReadableTime(dateOfBirth)}
            </Text>
          ) : null}
          {user?.placeOfBirth ? (
            <Text className="text-xs text-muted">{user.placeOfBirth}</Text>
          ) : null}
          <Pressable
            className="mt-2 px-4 py-2 rounded-full border border-foreground/20 bg-surface-highlight"
            onPress={handleEdit}
          >
            <Text className="text-xs uppercase tracking-[0.2em] text-foreground">
              Edit details
            </Text>
          </Pressable>
        </Card>

        <Card className="space-y-4">
          <Text className="text-xs uppercase tracking-[0.2em] text-muted">Notifications</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-foreground">Daily reflections</Text>
            <Switch
              value={prefs?.dailyNotifications ?? false}
              onValueChange={(value) =>
                savePreferencesMutation.mutate({
                  dailyNotifications: value,
                  eventNotifications: prefs?.eventNotifications ?? false,
                })
              }
            />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-foreground">Event reminders</Text>
            <Switch
              value={prefs?.eventNotifications ?? false}
              onValueChange={(value) =>
                savePreferencesMutation.mutate({
                  dailyNotifications: prefs?.dailyNotifications ?? false,
                  eventNotifications: value,
                })
              }
            />
          </View>
          <Text className="text-xs text-muted">
            Notifications are stored locally until server support lands.
          </Text>
        </Card>

        <Card className="space-y-2">
          <Text className="text-xs uppercase tracking-[0.2em] text-muted">Data & privacy</Text>
          <Text className="text-sm text-foreground">
            Your chart data stays linked to your account. Export and deletion controls will
            be added when backend support is ready.
          </Text>
        </Card>

        <Pressable
          className="h-12 rounded-full border border-foreground/20 items-center justify-center bg-white/80"
          onPress={() => signOut()}
        >
          <Text className="text-sm text-foreground">Log out</Text>
        </Pressable>

        <Pressable
          className="h-12 rounded-full border border-red-500/40 items-center justify-center"
          onPress={() =>
            Alert.alert(
              "Delete account",
              "Account deletion is not available in the mobile app yet. Reach out to support to proceed.",
            )
          }
        >
          <Text className="text-sm text-red-500">Delete account</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}
