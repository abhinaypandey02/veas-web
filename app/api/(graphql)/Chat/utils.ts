import { generateText, ToolLoopAgent } from "ai";
import { CHAT_SUMMARIZE_SYSTEM_PROMPT } from "./prompts";
import { LLM_MODEL } from "../../lib/ai";
import { ChatDB, ChatRole, ChatTable } from "./db";
import { and, eq, lte, ne } from "drizzle-orm";
import { db } from "../../lib/db";
import { getChatSystemPrompt } from "./prompts";
import { GetChartsResponse } from "../../lib/charts/types";
import { getTools } from "../../lib/charts/utils/tools";
import { UserChartDB, UserDB } from "../User/db";

export const getAstrologerAssistant = (
  user: UserDB,
  userChart: UserChartDB,
  chartData: GetChartsResponse,
  onToolCall: (message: string) => void,
) =>
  new ToolLoopAgent({
    model: LLM_MODEL,
    tools: getTools(chartData, onToolCall),
    instructions: getChatSystemPrompt(user, userChart),
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingLevel: "medium",
        },
      },
    },
  });

const MAXIMUM_MESSAGES = 15;
const MESSAGE_THRESHOLD = 10;

export async function processChat(
  userId: number,
  previousMessages: ChatDB[],
  newMessage: string,
  newResponse: string,
) {
  await db.insert(ChatTable).values([
    {
      userId,
      role: ChatRole.user,
      message: newMessage,
    },
    {
      userId,
      role: ChatRole.assistant,
      message: newResponse,
    },
  ]);
  if (previousMessages.length < MAXIMUM_MESSAGES + MESSAGE_THRESHOLD) return;
  const messagesToSummarize = previousMessages.slice(0, -MAXIMUM_MESSAGES + 3);
  const summary = await generateText({
    model: LLM_MODEL,
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
        ne(ChatTable.role, ChatRole.summary),
        eq(ChatTable.userId, userId),
      ),
    );
  if (!previousMessages.some((m) => m.role === ChatRole.summary)) {
    await addUserChatSummary(userId, summary.text);
  } else {
    await db
      .update(ChatTable)
      .set({
        message: summary.text,
      })
      .where(
        and(eq(ChatTable.role, ChatRole.summary), eq(ChatTable.userId, userId)),
      );
  }
}
export function addUserChatSummary(userId: number, summary: string) {
  return db.insert(ChatTable).values({
    userId,
    role: ChatRole.summary,
    message: summary,
    createdAt: new Date(2000, 1, 1),
  });
}
