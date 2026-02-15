import { openai } from "@ai-sdk/openai";

export const LLM_MODEL = openai("gpt-4o-mini") as unknown as string;
export const LLM_MODEL_LITE = openai("gpt-4o-mini") as unknown as string;
