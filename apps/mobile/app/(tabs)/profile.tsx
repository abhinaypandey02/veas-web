import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuthQuery, useAuthMutation } from "naystack/graphql/client";
import { useLogout } from "naystack/auth/email/client";
import { useRouter } from "expo-router";
import { GET_CURRENT_USER, GET_PLANETS, UPDATE_USER } from "@veas/gql";
import { useGlobalState } from "@/contexts/global-context";
import { useSubscription } from "@/hooks/use-subscription";
import { CustomerCenterModal } from "@/components/CustomerCenterModal";
import { PaywallModal } from "@/components/PaywallModal";
import { Gender } from "@veas/gql/types";
import { Fonts } from "@/constants/theme";
import BirthChart from "@/components/BirthChart";

// ─── Constants ────────────────────────────────────────────────
const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const SIGN_MEANINGS: Record<string, string> = {
  Aries:
    "Ignites your path with courage, bold initiative, and a pioneering spirit.",
  Taurus:
    "Provides you with grounded presence, steadfast trust, and an appreciation for lasting beauty.",
  Gemini:
    "Fills your approach with curiosity, quick-witted adaptability, and a desire for connection.",
  Cancer:
    "Centers you in deep nurturing, profound intuition, and receptive feminine energy.",
  Leo: "Inspires you toward joyful leadership, authentic self-expression, and a warm, magnetic presence.",
  Virgo:
    "Focuses your energy on practical healing, devoted service, and refined discernment.",
  Libra:
    "Draws you toward cultivating balance, relational harmony, and aesthetic perfection.",
  Scorpio:
    "Grants you the resilience for deep transformation and an unflinching emotional depth.",
  Sagittarius:
    "Expands your horizons through a quest for philosophical truth and optimistic exploration.",
  Capricorn:
    "Steadies you with disciplined ambition, structural mastery, and a respect for time.",
  Aquarius:
    "Awakens your visionary intellect, urging you toward progressive change and collective innovation.",
  Pisces:
    "Dissolves boundaries, blessing you with mystical insight, compassion, and spiritual depth.",
};

const BIG_THREE_CONFIG = [
  { key: "sun", label: "Sun", symbol: "☉", meaning: "Your Core Identity" },
  { key: "moon", label: "Moon", symbol: "☽", meaning: "Your Inner World" },
  {
    key: "rising",
    label: "Rising",
    symbol: "↑",
    meaning: "Your Outward Approach",
  },
] as const;

const GENDER_OPTIONS = [
  { label: "Male", value: Gender.Male },
  { label: "Female", value: Gender.Female },
  { label: "Non-Binary", value: Gender.NonBinary },
];

function getAscendant(
  planets: { name: string; sign: string; house: number }[],
) {
  if (planets.length === 0) return null;
  const planet = planets[0];
  const signIndex = SIGNS.indexOf(planet.sign);
  if (signIndex === -1) return null;
  const ascendantIndex = (((signIndex - (planet.house - 1)) % 12) + 12) % 12;
  return SIGNS[ascendantIndex];
}

function getWesternZodiacSign(dateOfBirth: string) {
  const date = new Date(dateOfBirth);
  const m = date.getMonth() + 1;
  const d = date.getDate();
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return "Aries";
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return "Taurus";
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return "Gemini";
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return "Cancer";
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return "Leo";
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return "Virgo";
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return "Libra";
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return "Scorpio";
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return "Sagittarius";
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return "Capricorn";
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return "Aquarius";
  return "Pisces";
}

// ─── Profile Screen ───────────────────────────────────────────

type Tab = "chart" | "settings";

export default function ProfileScreen() {
  const router = useRouter();
  const logout = useLogout();
  const { currentUser, updateCurrentUser } = useGlobalState();
  const { isPro, isLoading: subLoading } = useSubscription();

  const [getUser, { data: userData }] = useAuthQuery(GET_CURRENT_USER);
  const [getPlanets, { data: planetsData, loading: planetsLoading }] =
    useAuthQuery(GET_PLANETS);
  const [updateUserMutation, { loading: updateLoading }] =
    useAuthMutation(UPDATE_USER);

  const [activeTab, setActiveTab] = useState<Tab>("chart");
  const [customerCenterOpen, setCustomerCenterOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);

  // Settings form state
  const [nameInput, setNameInput] = useState("");
  const [genderInput, setGenderInput] = useState<Gender | "">("");
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);

  useEffect(() => {
    getUser();
    getPlanets();
  }, []);

  const user = currentUser || userData?.getCurrentUser;

  useEffect(() => {
    if (user) {
      setNameInput(user.name || "");
      setGenderInput(user.gender || "");
    }
  }, [user]);

  // Derived data
  const planets = planetsData?.getPlanets?.planets || [];
  const sunPlanet = planets.find((p) => p.name === "Sun");
  const moonPlanet = planets.find((p) => p.name === "Moon");
  const ascendant = getAscendant(planets);
  const westernSign = user?.dateOfBirth
    ? getWesternZodiacSign(user.dateOfBirth)
    : null;

  const bigThree = {
    sun: sunPlanet?.sign || null,
    moon: moonPlanet?.sign || null,
    rising: ascendant,
  };

  const hasBigThree = bigThree.sun || bigThree.moon || bigThree.rising;

  const handleSaveSettings = async () => {
    setSettingsMessage(null);
    try {
      await updateUserMutation({
        name: nameInput || undefined,
        gender: (genderInput as Gender) || undefined,
      });
      updateCurrentUser({
        name: nameInput,
        gender: genderInput as Gender,
      });
      setSettingsMessage("Saved!");
    } catch (e) {
      setSettingsMessage("Something went wrong.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "chart", label: "Chart" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* ─── Dark Header ─── */}
      <View style={styles.darkHeader}>
        <Text style={styles.headerName}>{user?.name || "You"}</Text>
        {user?.email && (
          <Text style={styles.headerEmail}>@{user.email.split("@")[0]}</Text>
        )}
        {westernSign && (
          <View style={styles.signRow}>
            <Text style={styles.signLabel}>Western</Text>
            <Text style={styles.signValue}>☉ {westernSign}</Text>
          </View>
        )}
        {(sunPlanet || moonPlanet || ascendant) && (
          <View style={styles.signRow}>
            <Text style={styles.signLabel}>Vedic</Text>
            {sunPlanet && (
              <Text style={styles.signValue}>☉ {sunPlanet.sign}</Text>
            )}
            {moonPlanet && (
              <Text style={styles.signValue}>☽ {moonPlanet.sign}</Text>
            )}
            {ascendant && <Text style={styles.signValue}>↑ {ascendant}</Text>}
          </View>
        )}

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tabButton,
                activeTab === tab.key && styles.tabButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === tab.key && styles.tabButtonTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ─── Content ─── */}
      <ScrollView
        style={styles.contentArea}
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "chart" ? (
          <>
            {/* Planets Loading */}
            {planetsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1a1a1a" />
              </View>
            ) : (
              <>
                {/* Birth Chart Wheel */}
                {planets.length > 0 && (
                  <View style={styles.chartContainer}>
                    <BirthChart
                      planets={
                        planets as {
                          name: string;
                          sign: string;
                          house: number;
                        }[]
                      }
                    />
                  </View>
                )}

                {/* Cosmic Blueprint */}
                {hasBigThree && (
                  <View style={styles.blueprintCard}>
                    <Text style={styles.blueprintTitle}>
                      Your Cosmic Blueprint
                    </Text>
                    {BIG_THREE_CONFIG.map((config) => {
                      const sign = bigThree[config.key];
                      if (!sign) return null;
                      return (
                        <View key={config.key} style={styles.blueprintItem}>
                          <View style={styles.blueprintSignHeader}>
                            <Text style={styles.blueprintSymbol}>
                              {config.symbol}
                            </Text>
                            <Text style={styles.blueprintSignTitle}>
                              {config.key === "rising"
                                ? `${sign} Rising`
                                : `${config.label} in ${sign}`}
                            </Text>
                          </View>
                          <View style={styles.blueprintBody}>
                            <Text style={styles.blueprintMeaning}>
                              <Text style={styles.blueprintMeaningLabel}>
                                {config.meaning}
                                {"\n"}
                              </Text>
                              {SIGN_MEANINGS[sign] || ""}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}

                {/* Planetary Positions */}
                {planets.length > 0 && (
                  <View style={styles.planetsCard}>
                    <Text style={styles.blueprintTitle}>
                      Planetary Positions
                    </Text>
                    {planets.map((planet) => (
                      <View key={planet.name} style={styles.planetRow}>
                        <Text style={styles.planetName}>{planet.name}</Text>
                        <Text style={styles.planetSign}>{planet.sign}</Text>
                        <Text style={styles.planetHouse}>
                          House {planet.house}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Subscription Section */}
                <View style={styles.subscriptionCard}>
                  <Text style={styles.blueprintTitle}>Subscription</Text>
                  {subLoading ? (
                    <ActivityIndicator color="#1a1a1a" />
                  ) : (
                    <View style={styles.subContent}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {isPro && (
                          <MaterialIcons
                            name="auto-awesome"
                            size={18}
                            color="#b8a06e"
                            style={{ marginRight: 6 }}
                          />
                        )}
                        <Text style={styles.planLabel}>
                          {isPro ? "Veas Pro" : "Free Plan"}
                        </Text>
                      </View>
                      {!isPro && (
                        <TouchableOpacity
                          style={styles.upgradeButton}
                          onPress={() => setPaywallOpen(true)}
                        >
                          <Text style={styles.upgradeButtonText}>
                            Upgrade to Pro
                          </Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.manageButton}
                        onPress={() => setCustomerCenterOpen(true)}
                      >
                        <Text style={styles.manageButtonText}>
                          Manage Subscription
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </>
            )}
          </>
        ) : (
          /* ─── Settings Tab ─── */
          <View>
            {/* Your Info */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Your Info</Text>
              <Text style={styles.fieldLabel}>Name</Text>
              <TextInput
                style={styles.fieldInput}
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Your name"
                placeholderTextColor="#999"
              />
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                style={[styles.fieldInput, styles.fieldDisabled]}
                value={user?.email || ""}
                editable={false}
                placeholderTextColor="#999"
              />
              <Text style={styles.fieldLabel}>Gender</Text>
              <View style={styles.genderRow}>
                {GENDER_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.genderOption,
                      genderInput === opt.value && styles.genderOptionSelected,
                    ]}
                    onPress={() => setGenderInput(opt.value)}
                  >
                    <Text
                      style={[
                        styles.genderOptionText,
                        genderInput === opt.value &&
                          styles.genderOptionTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveSettings}
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
              {settingsMessage && (
                <Text style={styles.settingsMessage}>{settingsMessage}</Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* Logout */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      <PaywallModal
        visible={paywallOpen}
        onClose={() => setPaywallOpen(false)}
      />
      <CustomerCenterModal
        visible={customerCenterOpen}
        onClose={() => setCustomerCenterOpen(false)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chartContainer: {
    marginBottom: 16,
  },

  // Dark Header
  darkHeader: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 0,
  },
  headerName: {
    fontSize: 28,
    fontFamily: Fonts.serif,
    color: "#fff",
    fontWeight: "300",
  },
  headerEmail: {
    fontSize: 13,
    color: "rgba(255,255,255,0.45)",
    marginTop: 2,
  },
  signRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 6,
    flexWrap: "wrap",
  },
  signLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.35)",
  },
  signValue: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },

  // Tab Bar
  tabBar: {
    flexDirection: "row",
    gap: 32,
    marginTop: 22,
  },
  tabButton: {
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabButtonActive: {
    borderBottomColor: "#fff",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.45)",
  },
  tabButtonTextActive: {
    color: "#fff",
  },

  // Content
  contentArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentPadding: {
    padding: 20,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },

  // Blueprint Card
  blueprintCard: {
    backgroundColor: "rgba(26,26,26,0.04)",
    borderRadius: 20,
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(26,26,26,0.08)",
    marginBottom: 20,
  },
  blueprintTitle: {
    fontSize: 20,
    fontFamily: Fonts.serif,
    color: "#1a1a1a",
    marginBottom: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.08)",
    fontWeight: "300",
  },
  blueprintItem: {
    marginBottom: 22,
  },
  blueprintSignHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  blueprintSymbol: {
    fontSize: 20,
    color: "#1a1a1a",
  },
  blueprintSignTitle: {
    fontSize: 18,
    fontFamily: Fonts.serif,
    color: "#1a1a1a",
    fontWeight: "400",
  },
  blueprintBody: {
    paddingLeft: 28,
  },
  blueprintMeaning: {
    fontSize: 14,
    lineHeight: 22,
    color: "rgba(0,0,0,0.6)",
    fontWeight: "300",
  },
  blueprintMeaningLabel: {
    fontWeight: "500",
    color: "#1a1a1a",
  },

  // Planets Card
  planetsCard: {
    backgroundColor: "rgba(26,26,26,0.04)",
    borderRadius: 20,
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(26,26,26,0.08)",
    marginBottom: 20,
  },
  planetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  planetName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1a1a1a",
    width: 100,
  },
  planetSign: {
    fontSize: 15,
    color: "rgba(0,0,0,0.6)",
    flex: 1,
    textAlign: "center",
  },
  planetHouse: {
    fontSize: 14,
    color: "rgba(0,0,0,0.4)",
    width: 70,
    textAlign: "right",
  },

  // Subscription
  subscriptionCard: {
    backgroundColor: "rgba(26,26,26,0.04)",
    borderRadius: 20,
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(26,26,26,0.08)",
    marginBottom: 20,
  },
  subContent: {
    gap: 12,
  },
  planLabel: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  upgradeButton: {
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  upgradeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  manageButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  manageButtonText: {
    color: "#1a1a1a",
    fontSize: 14,
  },

  // Settings
  settingsSection: {
    gap: 10,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.serif,
    color: "#1a1a1a",
    marginBottom: 8,
    fontWeight: "400",
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(0,0,0,0.5)",
    marginTop: 4,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1a1a1a",
    backgroundColor: "#fff",
  },
  fieldDisabled: {
    backgroundColor: "#f5f5f5",
    color: "#999",
  },
  genderRow: {
    flexDirection: "row",
    gap: 10,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    alignItems: "center",
  },
  genderOptionSelected: {
    backgroundColor: "#1a1a1a",
    borderColor: "#1a1a1a",
  },
  genderOptionText: {
    fontSize: 14,
    color: "#1a1a1a",
  },
  genderOptionTextSelected: {
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  settingsMessage: {
    fontSize: 13,
    color: "rgba(0,0,0,0.5)",
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.08)",
    marginVertical: 28,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.3)",
    backgroundColor: "rgba(220, 38, 38, 0.05)",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "500",
  },
});
