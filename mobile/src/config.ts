import Constants from "expo-constants";

const extraBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl as string | undefined;

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || extraBaseUrl || "https://api.veas.app/api";

console.log("DEBUG: API_BASE_URL", API_BASE_URL);

export const GRAPHQL_ENDPOINT = `${API_BASE_URL}/graphql`;
export const EMAIL_AUTH_ENDPOINT = `${API_BASE_URL}/email`;
export const CHAT_ENDPOINT = `${API_BASE_URL}/Chat/send-chat`;
export const CHART_ENDPOINT = `${API_BASE_URL}/calculate-chart`;

console.log("DEBUG: EMAIL_AUTH_ENDPOINT", EMAIL_AUTH_ENDPOINT);
