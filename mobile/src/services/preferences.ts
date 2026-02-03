import AsyncStorage from "@react-native-async-storage/async-storage";

const PREF_KEY = "veas.preferences";

export type Preferences = {
  dailyNotifications: boolean;
  eventNotifications: boolean;
};

const defaultPreferences: Preferences = {
  dailyNotifications: false,
  eventNotifications: false,
};

export async function loadPreferences() {
  const raw = await AsyncStorage.getItem(PREF_KEY);
  if (!raw) return defaultPreferences;
  return { ...defaultPreferences, ...(JSON.parse(raw) as Preferences) };
}

export async function savePreferences(prefs: Preferences) {
  await AsyncStorage.setItem(PREF_KEY, JSON.stringify(prefs));
}
