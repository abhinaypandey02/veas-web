import { google } from "@ai-sdk/google";

export const LLM_MODEL = google("gemini-3-flash-preview") as unknown as string;
export const LLM_MODEL_LITE = google("gemini-2.5-flash") as unknown as string;
