import { z } from "zod";
import { ChartKey } from "../../lib/charts/keys";
import { getChartData } from "../../lib/charts/get-chart-data";
import { generateText, ToolLoopAgent } from "ai";
import { CHAT_SYSTEM_PROMPT, CHAT_SUMMARIZE_SYSTEM_PROMPT } from "./prompts";
import { GROQ_MODEL } from "../../lib/ai";
import { ChatDB, ChatRole, ChatTable } from "./db";
import { and, eq, lte, ne } from "drizzle-orm";
import { db } from "../../lib/db";

export const getAstrologerAssistant = (id: number) =>
  new ToolLoopAgent({
    model: GROQ_MODEL as unknown as string,
    tools: {
      getChartData: {
        description: "",
        inputSchema: z.object({
          keys: z.array(
            z.enum(Object.values(ChartKey) as [string, ...string[]]),
          ),
        }),
        execute: async ({ keys }: { keys: ChartKey[] }) => {
          console.log(keys);
          const chartData = await getChartData(id, keys);
          return chartData;
        },
      },
    },
    instructions: CHAT_SYSTEM_PROMPT,
  });

const MAXIMUM_MESSAGES = 5;
const MESSAGE_THRESHOLD = 5;

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
    model: GROQ_MODEL,
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
    await db.insert(ChatTable).values({
      userId,
      role: ChatRole.summary,
      message: summary.text,
      createdAt: new Date(2000, 1, 1),
    });
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
