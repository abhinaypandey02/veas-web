import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Screen } from "../components/Screen";
import { searchLocation, type SearchPlaceResponse } from "../services/location";
import { useCurrentUser, useOnboardUser } from "../services/user";
import { formatReadableDate, formatReadableTime } from "../utils/date";

export function OnboardingScreen({ navigation, route }: { navigation: any; route: any }) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [birthTime, setBirthTime] = useState(new Date());
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [placeQuery, setPlaceQuery] = useState("");
  const [placeOptions, setPlaceOptions] = useState<SearchPlaceResponse[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<SearchPlaceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const { data: currentUser } = useCurrentUser(true);
  const { mutateAsync, isPending } = useOnboardUser();
  const mode = route?.params?.mode as "edit" | undefined;

  useEffect(() => {
    if (!currentUser || !currentUser.name) return;
    setName((prev) => prev || currentUser.name || "");
    if (currentUser.dateOfBirth) {
      const storedDate = new Date(currentUser.dateOfBirth);
      setBirthDate(storedDate);
      setBirthTime(storedDate);
    }
    if (currentUser.placeOfBirth) {
      setPlaceQuery(currentUser.placeOfBirth);
      if (
        typeof currentUser.placeOfBirthLat === "number" &&
        typeof currentUser.placeOfBirthLong === "number"
      ) {
        setSelectedPlace({
          place_id: 0,
          lat: String(currentUser.placeOfBirthLat),
          lon: String(currentUser.placeOfBirthLong),
          display_name: currentUser.placeOfBirth,
        });
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (!placeQuery || placeQuery.length < 3) {
      setPlaceOptions([]);
      return;
    }

    const timeout = setTimeout(() => {
      searchLocation(placeQuery)
        .then(setPlaceOptions)
        .catch(() => setPlaceOptions([]));
    }, 400);

    return () => clearTimeout(timeout);
  }, [placeQuery]);

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!selectedPlace) {
      setError("Please select a place of birth.");
      return;
    }

    const combined = new Date(birthDate);
    if (timeUnknown) {
      combined.setHours(12, 0, 0, 0);
    } else {
      combined.setHours(birthTime.getHours(), birthTime.getMinutes(), 0, 0);
    }

    try {
      await mutateAsync({
        name: name.trim(),
        dateOfBirth: combined.toISOString(),
        placeOfBirth: selectedPlace.display_name,
        placeOfBirthLat: parseFloat(selectedPlace.lat),
        placeOfBirthLong: parseFloat(selectedPlace.lon),
        timezoneOffset: -new Date().getTimezoneOffset() / 60,
      });
      if (mode === "edit") {
        navigation.goBack();
      }
    } catch (err) {
      setError((err as Error).message || "Onboarding failed");
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerClassName="px-6 pt-10 pb-16 space-y-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="space-y-2">
            <Text className="text-4xl font-serif text-foreground">About you</Text>
            <Text className="text-sm text-muted">
              Your birth details let us align your chart with the real sky and tailor
              guidance to your timing.
            </Text>
          </View>

          <Input
            label="Full name"
            value={name}
            onChangeText={setName}
            placeholder="What should we call you?"
          />

          <View className="space-y-3">
            <Text className="text-xs uppercase tracking-widest text-muted">Date of birth</Text>
            <Pressable
              className="bg-surface border border-foreground/10 rounded-2xl px-4 py-3"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="text-foreground">{formatReadableDate(birthDate)}</Text>
            </Pressable>
            {showDatePicker ? (
              <DateTimePicker
                value={birthDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_, selected) => {
                  setShowDatePicker(false);
                  if (selected) setBirthDate(selected);
                }}
              />
            ) : null}
          </View>

          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs uppercase tracking-widest text-muted">Time of birth</Text>
              <Pressable
                onPress={() => setTimeUnknown((prev) => !prev)}
                className="px-3 py-1 rounded-full border border-foreground/20"
              >
                <Text className="text-xs text-foreground">
                  {timeUnknown ? "Not sure" : "Set time"}
                </Text>
              </Pressable>
            </View>
            <Pressable
              className="bg-surface border border-foreground/10 rounded-2xl px-4 py-3"
              onPress={() => {
                if (!timeUnknown) setShowTimePicker(true);
              }}
            >
              <Text className="text-foreground">
                {timeUnknown ? "Defaulting to 12:00 PM" : formatReadableTime(birthTime)}
              </Text>
            </Pressable>
            {showTimePicker ? (
              <DateTimePicker
                value={birthTime}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_, selected) => {
                  setShowTimePicker(false);
                  if (selected) setBirthTime(selected);
                }}
              />
            ) : null}
          </View>

          <View className="space-y-3">
            <Input
              label="Place of birth"
              value={placeQuery}
              onChangeText={(value) => {
                setPlaceQuery(value);
                setSelectedPlace(null);
              }}
              placeholder="City, region or country"
            />
            {placeOptions.length > 0 ? (
              <View className="bg-surface border border-foreground/10 rounded-2xl overflow-hidden">
                {placeOptions.map((place) => (
                  <Pressable
                    key={place.place_id}
                    className="px-4 py-3 border-b border-foreground/5"
                    onPress={() => {
                      setSelectedPlace(place);
                      setPlaceQuery(place.display_name);
                      setPlaceOptions([]);
                    }}
                  >
                    <Text className="text-sm text-foreground">{place.display_name}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>

          {error ? <Text className="text-xs text-red-500">{error}</Text> : null}

          <Button
            title={isPending ? "Saving..." : "Complete onboarding"}
            onPress={handleSubmit}
            loading={isPending}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
