import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useSignUp } from "naystack/auth/email/client";
import { useAuthMutation } from "naystack/graphql/client";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ONBOARD_USER } from "@veas/gql";
import {
  searchLocation,
  searchTimezone,
  getUTCDate,
  type SearchPlaceResponse,
} from "@veas/utils/location";

const GENDER_OPTIONS = ["Male", "Female", "NonBinary"] as const;

interface OnboardData {
  chartId: number;
  timezoneOffset: number;
  placeOfBirth: string;
  gender: string;
}

// ─── Onboard Form ───────────────────────────────────────────────────────────

function OnboardForm({
  onSuccess,
}: {
  onSuccess: (data: OnboardData) => void;
}) {
  const [onboardUser, { loading: mutationLoading }] =
    useAuthMutation(ONBOARD_USER);

  const [placeQuery, setPlaceQuery] = useState("");
  const [places, setPlaces] = useState<SearchPlaceResponse[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<SearchPlaceResponse | null>(null);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [loadingTimezone, setLoadingTimezone] = useState(false);
  const [timezone, setTimezone] = useState<number | undefined>();

  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showPlaceResults, setShowPlaceResults] = useState(false);

  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  // Debounced place search
  useEffect(() => {
    if (!placeQuery || placeQuery.length <= 3 || selectedPlace) return;

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setLoadingPlaces(true);
      searchLocation(placeQuery)
        .then((results) => {
          setPlaces(results);
          setShowPlaceResults(true);
          setTimezone(undefined);
        })
        .finally(() => setLoadingPlaces(false));
    }, 500);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [placeQuery, selectedPlace]);

  // Fetch timezone when place is selected
  useEffect(() => {
    if (!selectedPlace) return;
    setLoadingTimezone(true);
    searchTimezone(parseFloat(selectedPlace.lat), parseFloat(selectedPlace.lon))
      .then((tz) => setTimezone(tz))
      .finally(() => setLoadingTimezone(false));
  }, [selectedPlace]);

  const handleSelectPlace = useCallback((place: SearchPlaceResponse) => {
    setSelectedPlace(place);
    setPlaceQuery(place.display_name);
    setShowPlaceResults(false);
  }, []);

  const handlePlaceQueryChange = useCallback(
    (text: string) => {
      setPlaceQuery(text);
      if (selectedPlace) {
        setSelectedPlace(null);
        setTimezone(undefined);
      }
    },
    [selectedPlace],
  );

  const handleSubmit = async () => {
    setError(null);

    if (!selectedPlace || timezone === undefined) {
      setError("Please select a valid place from the suggestions.");
      return;
    }
    if (!dob.trim()) {
      setError("Please enter your date of birth.");
      return;
    }
    if (!gender) {
      setError("Please select your gender.");
      return;
    }

    const parsedDate = new Date(dob);
    if (isNaN(parsedDate.getTime())) {
      setError("Please enter a valid date (YYYY-MM-DD HH:mm).");
      return;
    }

    try {
      const result = await onboardUser({
        dateOfBirth: getUTCDate(parsedDate, timezone),
        placeOfBirthLat: parseFloat(selectedPlace.lat),
        placeOfBirthLong: parseFloat(selectedPlace.lon),
        timezone,
      });

      if (result.data?.onboardUser) {
        onSuccess({
          chartId: result.data.onboardUser,
          placeOfBirth: selectedPlace.display_name,
          timezoneOffset: timezone,
          gender,
        });
      }
    } catch (err) {
      setError(
        (err as Error).message || "Something went wrong. Please try again.",
      );
    }
  };

  const isLoading = mutationLoading || loadingTimezone;

  return (
    <View style={styles.form}>
      {/* Place of Birth */}
      <View style={styles.field}>
        <Text style={styles.label}>City of Birth</Text>
        <TextInput
          style={styles.input}
          placeholder="Where were you born?"
          placeholderTextColor="#9CA3AF"
          value={placeQuery}
          onChangeText={handlePlaceQueryChange}
          editable={!isLoading}
        />
        {loadingPlaces && (
          <ActivityIndicator
            size="small"
            color="#6B7280"
            style={styles.fieldLoader}
          />
        )}
        {showPlaceResults && places.length > 0 && (
          <View style={styles.dropdown}>
            <FlatList
              data={places}
              keyExtractor={(item) => String(item.place_id)}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelectPlace(item)}
                >
                  <Text style={styles.dropdownText} numberOfLines={2}>
                    {item.display_name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* Date of Birth */}
      <View style={styles.field}>
        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD HH:mm"
          placeholderTextColor="#9CA3AF"
          value={dob}
          onChangeText={setDob}
          editable={!isLoading}
        />
      </View>

      {/* Gender */}
      <View style={styles.field}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderRow}>
          {GENDER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.genderOption,
                gender === option && styles.genderOptionSelected,
              ]}
              onPress={() => setGender(option)}
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === option && styles.genderTextSelected,
                ]}
              >
                {option === "NonBinary" ? "Non-Binary" : option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Next →</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ─── SignUp Details Form ────────────────────────────────────────────────────

function SignUpDetailsForm({
  onboardingData,
}: {
  onboardingData: OnboardData;
}) {
  const signUp = useSignUp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const message = await signUp({
        name,
        email,
        password,
        ...onboardingData,
      });
      if (message) {
        setError(message);
        setIsSubmitting(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.field}>
        <Text style={styles.label}>Full name</Text>
        <TextInput
          style={styles.input}
          placeholder="What should we call you?"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          editable={!isSubmitting}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isSubmitting}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isSubmitting}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          placeholderTextColor="#9CA3AF"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!isSubmitting}
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
        activeOpacity={0.8}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Complete Onboarding</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ─── Main SignUp Screen ─────────────────────────────────────────────────────

export default function SignUpScreen() {
  const router = useRouter();
  const [onboardingData, setOnboardingData] = useState<OnboardData | null>(
    null,
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Join Veas</Text>
            <Text style={styles.subtitle}>
              {onboardingData === null
                ? "Enter your basic details so we can know you better."
                : "Sign up for free with your email."}
            </Text>
          </View>

          {onboardingData === null ? (
            <OnboardForm onSuccess={setOnboardingData} />
          ) : (
            <SignUpDetailsForm onboardingData={onboardingData} />
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
              <Text style={styles.footerLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "#111827",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#fff",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#fff",
    maxHeight: 180,
    marginTop: 4,
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  dropdownText: {
    fontSize: 14,
    color: "#374151",
  },
  fieldLoader: {
    position: "absolute",
    right: 12,
    top: 38,
  },
  genderRow: {
    flexDirection: "row",
    gap: 10,
  },
  genderOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  genderOptionSelected: {
    borderColor: "#111827",
    backgroundColor: "#111827",
  },
  genderText: {
    fontSize: 14,
    color: "#374151",
  },
  genderTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  error: {
    color: "#DC2626",
    fontSize: 13,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
  },
  footerLink: {
    fontSize: 14,
    color: "#111827",
    textDecorationLine: "underline",
  },
});
