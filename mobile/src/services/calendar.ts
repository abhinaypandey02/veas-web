import AsyncStorage from "@react-native-async-storage/async-storage";

const EVENTS_KEY = "veas.calendar.events";
const FORECASTS_KEY = "veas.calendar.forecasts";

export type CalendarEventCategory =
  | "meeting"
  | "breakup"
  | "exam"
  | "travel"
  | "milestone";

export type CalendarEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: CalendarEventCategory;
  notes?: string;
  createdAt: string;
};

export type CalendarForecast = {
  date: string; // YYYY-MM-DD
  text: string;
  createdAt: string;
};

export async function loadEvents() {
  const raw = await AsyncStorage.getItem(EVENTS_KEY);
  if (!raw) return [] as CalendarEvent[];
  return JSON.parse(raw) as CalendarEvent[];
}

export async function saveEvents(events: CalendarEvent[]) {
  await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export async function loadForecasts() {
  const raw = await AsyncStorage.getItem(FORECASTS_KEY);
  if (!raw) return [] as CalendarForecast[];
  return JSON.parse(raw) as CalendarForecast[];
}

export async function saveForecasts(forecasts: CalendarForecast[]) {
  await AsyncStorage.setItem(FORECASTS_KEY, JSON.stringify(forecasts));
}
