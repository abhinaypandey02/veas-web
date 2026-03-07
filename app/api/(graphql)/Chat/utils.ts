import { generateText, ToolLoopAgent } from "ai";
import { CHAT_SUMMARIZE_SYSTEM_PROMPT } from "./prompts";
import { LLM_MODEL, LLM_MODEL_LITE, LLM_MODEL_SUMMARY } from "../../lib/ai";
import { ChatDB, ChatRole, ChatTable } from "./db";
import { and, eq, lte, ne } from "drizzle-orm";
import { db } from "../../lib/db";
import { getChatSystemPrompt } from "./prompts";
import { GetChartsResponse } from "../../lib/charts/types";
import { getTools } from "../../lib/charts/utils/tools";
import { UserChartDB, UserDB } from "../User/db";
import { MAXIMUM_MESSAGES } from "@/app/api/(graphql)/Chat/constants";

export const getAstrologerAssistant = (
  user: UserDB,
  userChart: UserChartDB,
  chartData: GetChartsResponse,
  onToolCall: (message: string) => void,
  isFirstChat: boolean,
) =>
  new ToolLoopAgent({
    model: isFirstChat ? LLM_MODEL_LITE : LLM_MODEL,
    tools: getTools(chartData, onToolCall),
    instructions: getChatSystemPrompt(user, userChart),
    providerOptions: undefined,
    // maxOutputTokens: MAX_TOKEN_LIMIT,
  });

const MAXIMUM_UNSUMMARIZED_MESSAGES = MAXIMUM_MESSAGES.PRO_DAILY_LIMIT;
const MESSAGE_THRESHOLD = Math.round(MAXIMUM_UNSUMMARIZED_MESSAGES / 2);

export async function processChat(
  userId: number,
  previousMessages: ChatDB[],
  newMessage: string,
  newResponse: string,
) {
  await db.insert(ChatTable).values([
    {
      userId,
      role: ChatRole.User,
      message: newMessage,
    },
    {
      userId,
      role: ChatRole.Assistant,
      message: newResponse,
    },
  ]);
  if (
    previousMessages.length <
    MAXIMUM_UNSUMMARIZED_MESSAGES + MESSAGE_THRESHOLD
  )
    return;
  const messagesToSummarize = previousMessages.slice(
    0,
    -MAXIMUM_UNSUMMARIZED_MESSAGES + 2,
  );
  const summary = await generateText({
    model: LLM_MODEL_SUMMARY,
    system: CHAT_SUMMARIZE_SYSTEM_PROMPT,
    prompt: JSON.stringify(messagesToSummarize, null, 2),
  });
  const lastCreatedAt =
    messagesToSummarize[messagesToSummarize.length - 1].createdAt;
  await db
    .update(ChatTable)
    .set({
      isSummarized: true,
    })
    .where(
      and(
        lte(ChatTable.createdAt, lastCreatedAt),
        ne(ChatTable.role, ChatRole.Summary),
        eq(ChatTable.userId, userId),
      ),
    );
  if (!previousMessages.some((m) => m.role === ChatRole.Summary)) {
    await addUserChatSummary(userId, summary.text);
  } else {
    await db
      .update(ChatTable)
      .set({
        message: summary.text,
      })
      .where(
        and(eq(ChatTable.role, ChatRole.Summary), eq(ChatTable.userId, userId)),
      );
  }
}
export function addUserChatSummary(userId: number, summary: string) {
  return db.insert(ChatTable).values({
    userId,
    role: ChatRole.Summary,
    message: summary,
    createdAt: new Date(2000, 1, 1),
  });
}
