import { openai } from "@ai-sdk/openai";

export const LLM_MODEL = openai("gpt-5.2") as unknown as string;
export const LLM_MODEL_LITE = openai("gpt-5-mini") as unknown as string;
