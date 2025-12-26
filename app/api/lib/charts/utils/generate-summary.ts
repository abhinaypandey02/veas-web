import { db } from "@/app/api/lib/db";
import { UserChartSummaryTable } from "@/app/api/(graphql)/User/db";
import { eq, and } from "drizzle-orm";
import { generateText } from "ai";
import { GROQ_MODEL } from "@/app/api/lib/ai";
import type { ChartKey } from "../keys";
import { getPromptForKey } from "../prompts";
import { filterChart } from "./filter";

/**
 * Generates a summary for a specific chart key and stores it in the database
 */
export async function generateSummaryForKey(
  userId: number,
  key: ChartKey,
  rawData: unknown,
): Promise<void> {
  try {
    // Filter the chart data if it's a chart object
    const filteredData =
      rawData && typeof rawData === "object" && "planets" in rawData
        ? filterChart(rawData)
        : rawData;

    // Get the appropriate prompt for this key
    const prompt = getPromptForKey(key);

    if (!prompt) return;

    // Generate summary using AI
    const { text } = await generateText({
      model: GROQ_MODEL,
      prompt: prompt.replace(
        "{chartData}",
        JSON.stringify(filteredData, null, 2),
      ),
    });

    // Store the summary in the database
    // Use a workaround for composite unique constraint - delete then insert
    await db
      .delete(UserChartSummaryTable)
      .where(
        and(
          eq(UserChartSummaryTable.userId, userId),
          eq(UserChartSummaryTable.key, key),
        ),
      );

    await db.insert(UserChartSummaryTable).values({
      userId,
      key,
      summary: text,
    });
  } catch (error) {
    console.error(`Error generating summary for ${key}:`, error);
    throw error;
  }
}
