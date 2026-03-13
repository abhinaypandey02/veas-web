import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuthQuery } from "naystack/graphql/client";
import { ChartSummaryType } from "@veas/gql/types";
import { GET_SUMMARY, GET_CURRENT_USER } from "@veas/gql";
import { useGlobalState } from "@/contexts/global-context";
import { Fonts } from "@/constants/theme";
import { parseRichText } from "@/utils/chat";

// ─── Summary Items (matching webapp's summary-cards.tsx) ──────
const SUMMARY_ITEMS: {
  type: ChartSummaryType;
  title: string;
  subtitle: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
}[] = [
  {
    type: ChartSummaryType.Daily,
    title: "Daily",
    subtitle: "YOUR DAY AHEAD",
    iconName: "wb-sunny",
  },
  {
    type: ChartSummaryType.Weekly,
    title: "Weekly",
    subtitle: "YOUR WEEK AHEAD",
    iconName: "date-range",
  },
  {
    type: ChartSummaryType.Mahadasha,
    title: "Major Period",
    subtitle: "PLANETARY FOCUS",
    iconName: "public",
  },
  {
    type: ChartSummaryType.Antardasha,
    title: "Sub-Period",
    subtitle: "CURRENT FOCUS",
    iconName: "dark-mode",
  },
  {
    type: ChartSummaryType.Pratyantardasha,
    title: "Trigger Period",
    subtitle: "SHORT ACTIVATION",
    iconName: "auto-awesome",
  },
];

// Daily hero background — same as webapp's /daily.png
const DAILY_IMAGE_URI = "https://veasapp.com/daily.png";

export default function DashboardScreen() {
  const router = useRouter();
  const { currentUser } = useGlobalState();
  const [getUser, { data: userData }] = useAuthQuery(GET_CURRENT_USER);
  const [getSummary] = useAuthQuery(GET_SUMMARY);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalIconName, setModalIconName] =
    useState<keyof typeof MaterialIcons.glyphMap>("wb-sunny");
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [loadingType, setLoadingType] = useState<ChartSummaryType | null>(null);

  const userName =
    currentUser?.name?.split(" ")[0] ||
    userData?.getCurrentUser?.name?.split(" ")[0] ||
    "User";

  useEffect(() => {
    getUser();
  }, []);

  const handleCardPress = useCallback(
    async (
      type: ChartSummaryType,
      title: string,
      iconName: keyof typeof MaterialIcons.glyphMap,
    ) => {
      setLoadingType(type);
      setModalTitle(title);
      setModalIconName(iconName);
      setSummaryText(null);
      setModalVisible(true);

      try {
        const result = await getSummary({ type });
        if (result?.data?.getSummary) {
          setSummaryText(result.data.getSummary);
        } else {
          setSummaryText("No summary available at this time.");
        }
      } catch {
        setSummaryText("Failed to load summary. Please try again.");
      } finally {
        setLoadingType(null);
      }
    },
    [getSummary],
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Background Gradient — matching webapp bg-gradient-to-b from-white via-[#F4EFFC] to-[#E6DCF5] */}
      <View style={styles.bgGradient} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Header ─── */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome, {userName}</Text>
          <TouchableOpacity style={styles.crownButton}>
            <MaterialIcons
              name="workspace-premium"
              size={26}
              color="rgba(26,26,26,0.75)"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />

        {/* ─── Trending: Hero Daily Card ─── */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Trending</Text>
          <TouchableOpacity
            style={styles.heroCard}
            onPress={() =>
              handleCardPress(
                SUMMARY_ITEMS[0].type,
                SUMMARY_ITEMS[0].title,
                SUMMARY_ITEMS[0].iconName,
              )
            }
            activeOpacity={0.9}
          >
            <Image source={{ uri: DAILY_IMAGE_URI }} style={styles.heroImage} />
            <View style={styles.heroOverlay} />

            {/* Arrow Button — matching webapp's bg-white/20 rounded-full */}
            <TouchableOpacity
              style={styles.heroArrow}
              onPress={() =>
                handleCardPress(
                  SUMMARY_ITEMS[0].type,
                  SUMMARY_ITEMS[0].title,
                  SUMMARY_ITEMS[0].iconName,
                )
              }
            >
              {loadingType === SUMMARY_ITEMS[0].type ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <MaterialIcons name="north-east" size={18} color="#fff" />
              )}
            </TouchableOpacity>

            {/* Content — bottom left */}
            <View style={styles.heroContent}>
              <Text style={styles.heroSubtitle}>
                {SUMMARY_ITEMS[0].subtitle}
              </Text>
              <Text style={styles.heroTitle}>{SUMMARY_ITEMS[0].title}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ─── Ask Veas AI Bar ─── */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.askVeasBar}
            onPress={() => router.push("/(tabs)/chat")}
            activeOpacity={0.85}
          >
            <View style={styles.askVeasContent}>
              <View style={styles.askVeasIconCircle}>
                <MaterialIcons
                  name="chat-bubble-outline"
                  size={24}
                  color="#fff"
                />
              </View>
              <Text style={styles.askVeasText}>Ask Veas</Text>
            </View>
            <View style={styles.askVeasArrow}>
              <MaterialIcons name="arrow-forward" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* ─── Your Insights: Horizontal Scroll ─── */}
        <View style={styles.insightsSection}>
          <View style={styles.insightsHeader}>
            <Text style={styles.sectionTitle}>Your Insights</Text>
            <Text style={styles.scrollHint}>Scroll for more</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.insightsScroll}
          >
            {SUMMARY_ITEMS.slice(1).map((item) => (
              <TouchableOpacity
                key={item.type}
                style={styles.compactCard}
                onPress={() =>
                  handleCardPress(item.type, item.title, item.iconName)
                }
                activeOpacity={0.85}
              >
                {/* Top row: icon + arrow */}
                <View style={styles.compactTopRow}>
                  <MaterialIcons
                    name={item.iconName}
                    size={24}
                    color="rgba(0,0,0,0.65)"
                  />
                  <TouchableOpacity
                    style={styles.compactArrow}
                    onPress={() =>
                      handleCardPress(item.type, item.title, item.iconName)
                    }
                  >
                    {loadingType === item.type ? (
                      <ActivityIndicator size={12} color="rgba(0,0,0,0.5)" />
                    ) : (
                      <MaterialIcons
                        name="north-east"
                        size={14}
                        color="rgba(0,0,0,0.5)"
                      />
                    )}
                  </TouchableOpacity>
                </View>

                {/* Spacer */}
                <View style={styles.compactSpacer} />

                {/* Bottom: subtitle + title */}
                <Text style={styles.compactSubtitle}>{item.subtitle}</Text>
                <Text style={styles.compactTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
            <View style={{ width: 16 }} />
          </ScrollView>
        </View>

        {/* Bottom padding for tab bar */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ─── Summary Detail Modal ─── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalContent}
            onPress={() => {}}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={styles.modalIconCircle}>
                  <MaterialIcons
                    name={modalIconName}
                    size={22}
                    color="rgba(0,0,0,0.75)"
                  />
                </View>
                <Text style={styles.modalTitle}>
                  {modalTitle.toLowerCase()}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalClose}
              >
                <MaterialIcons
                  name="close"
                  size={22}
                  color="rgba(0,0,0,0.35)"
                />
              </TouchableOpacity>
            </View>

            {/* Body */}
            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={styles.modalBodyContent}
            >
              {summaryText ? (
                <Text style={styles.modalSummaryText}>
                  {parseRichText(summaryText)}
                </Text>
              ) : (
                <View style={styles.modalLoadingContainer}>
                  <ActivityIndicator size="large" color="#1a1a1a" />
                </View>
              )}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F5FF",
  },
  bgGradient: {
    ...StyleSheet.absoluteFillObject,
    // Webapp gradient: from-white via-[#F4EFFC] to-[#E6DCF5]
    backgroundColor: "#F4EFFC",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },

  // ─── Header ───
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 28,
    paddingBottom: 12,
    paddingHorizontal: 4,
  },
  welcomeText: {
    fontSize: 36,
    fontFamily: Fonts.serif,
    color: "#1a1a1a",
    fontWeight: "300",
    letterSpacing: -0.5,
  },
  crownButton: {
    padding: 8,
    borderRadius: 20,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(0,0,0,0.08)",
    marginBottom: 20,
    marginHorizontal: 4,
  },

  // ─── Section ───
  sectionContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: Fonts.serif,
    color: "#1a1a1a",
    marginBottom: 14,
    fontWeight: "300",
    letterSpacing: -0.3,
  },

  // ─── Hero Daily Card ───
  heroCard: {
    height: 200,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    // Webapp: bg-gradient-to-t from-black/60 via-black/20 to-transparent
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  heroArrow: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    // Webapp: bg-white/20 backdrop-blur-md
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  heroContent: {
    position: "absolute",
    bottom: 24,
    left: 28,
    zIndex: 10,
  },
  heroSubtitle: {
    // Webapp: font-sans font-medium uppercase tracking-[0.15em] text-[10px] text-white/80
    color: "rgba(255,255,255,0.8)",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  heroTitle: {
    // Webapp: font-editorial font-light text-4xl text-white
    color: "#fff",
    fontSize: 40,
    fontFamily: Fonts.serif,
    fontWeight: "300",
    letterSpacing: -0.5,
  },

  // ─── Ask Veas Bar ───
  askVeasBar: {
    // Webapp: rounded-[2rem] bg-[#1a1a1a] border border-black/5
    borderRadius: 32,
    backgroundColor: "#1a1a1a",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  askVeasContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  askVeasIconCircle: {
    // Webapp: h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  askVeasText: {
    // Webapp: font-editorial font-light text-white text-2xl
    color: "#fff",
    fontSize: 24,
    fontFamily: Fonts.serif,
    fontWeight: "300",
    letterSpacing: -0.3,
  },
  askVeasArrow: {
    // Webapp: bg-white/20 text-white p-2.5 rounded-full
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  // ─── Insights Section ───
  insightsSection: {
    marginBottom: 16,
  },
  insightsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  scrollHint: {
    // Webapp: text-xs text-black/40 font-sans tracking-wide
    fontSize: 12,
    color: "rgba(0,0,0,0.35)",
    letterSpacing: 0.5,
  },
  insightsScroll: {
    paddingVertical: 12,
    paddingLeft: 4,
    gap: 14,
  },

  // ─── Compact Summary Card ───
  compactCard: {
    // Webapp: min-w-[160px] h-full p-4 rounded-[2rem] bg-[#FDFCF8] border border-black/5
    width: 160,
    height: 180,
    borderRadius: 28,
    backgroundColor: "#FDFCF8",
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.05)",
  },
  compactTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  compactArrow: {
    // Webapp: bg-white border border-black/5 rounded-full aspect-square w-[28px]
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  compactSpacer: {
    flex: 1,
  },
  compactSubtitle: {
    // Webapp: font-sans font-medium uppercase tracking-[0.15em] text-[9px] text-black/50
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 1.5,
    color: "rgba(0,0,0,0.45)",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  compactTitle: {
    // Webapp: font-editorial font-light text-xl text-[#1a1a1a]
    fontSize: 20,
    fontFamily: Fonts.serif,
    fontWeight: "300",
    color: "#1a1a1a",
    lineHeight: 24,
    letterSpacing: -0.2,
  },

  // ─── Summary Modal ───
  modalOverlay: {
    flex: 1,
    // Webapp: bg-white/90 backdrop-blur-sm
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    // Webapp: max-w-sm max-h-[80vh] rounded-[2rem] border border-black/5 bg-[#FDFCF8] shadow-2xl
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    borderRadius: 28,
    backgroundColor: "#FDFCF8",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.05)",
    overflow: "hidden",
    boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.12)",
  },
  modalHeader: {
    // Webapp: p-8 pb-4 border-b border-black/5
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  modalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  modalIconCircle: {
    // Webapp: text-black/80 bg-[var(--color-rose-dust)]/20 p-2.5 rounded-full
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(232, 220, 202, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    // Webapp: font-editorial text-3xl font-light text-[#1a1a1a] lowercase
    fontSize: 28,
    fontFamily: Fonts.serif,
    fontWeight: "300",
    color: "#1a1a1a",
    letterSpacing: -0.3,
  },
  modalClose: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    backgroundColor: "#fff",
  },
  modalBodyContent: {
    padding: 24,
  },
  modalSummaryText: {
    // Webapp: prose prose-sm text-lg leading-tight
    fontSize: 17,
    lineHeight: 28,
    color: "#1a1a1a",
    fontFamily: Fonts.serif,
  },
  modalLoadingContainer: {
    paddingVertical: 48,
    alignItems: "center",
  },
});
