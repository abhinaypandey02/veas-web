import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";

export const LLM_MODEL = openai("gpt-5.2") as unknown as string;
export const LLM_MODEL_LITE = openai("gpt-5-mini") as unknown as string;
export const LLM_MODEL_SUMMARY = google(
  "gemini-3-flash-preview",
) as unknown as string;
