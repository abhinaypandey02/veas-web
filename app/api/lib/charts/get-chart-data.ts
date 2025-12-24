import { db } from "@/app/api/lib/db";
import { UserChartSummaryTable } from "@/app/api/(graphql)/User/db";
import { eq, and, inArray } from "drizzle-orm";
import { ChartKey, extractChartDataByKey } from "./keys";
import { getRawChart } from "./utils/get-raw";
import { generateSummaryForKey } from "./utils/generate-summary";
import { waitUntil } from "@vercel/functions";

export interface ChartDataResult {
  key: ChartKey;
  summary: string | null;
  rawData: unknown | null;
  isAvailable: boolean;
}

/**
 * Gets chart data for multiple keys
 * Returns available summaries, and raw data for missing ones
 * Starts background jobs to generate summaries for missing keys
 */
export async function getChartData(
  userId: number,
  keys: ChartKey[],
): Promise<ChartDataResult[]> {
  // Fetch all available summaries for the requested keys
  const availableSummaries = await db
    .select()
    .from(UserChartSummaryTable)
    .where(
      and(
        eq(UserChartSummaryTable.userId, userId),
        inArray(
          UserChartSummaryTable.key,
          keys.map((k) => k as string),
        ),
      ),
    );

  const availableKeys = new Set(
    availableSummaries.map((s) => s.key as ChartKey),
  );
  const missingKeys = keys.filter((k) => !availableKeys.has(k));

  // Build results for available summaries
  const results: ChartDataResult[] = keys.map((key) => {
    const summary = availableSummaries.find((s) => s.key === key);
    if (summary) {
      return {
        key,
        summary: summary.summary,
        rawData: null,
        isAvailable: true,
      };
    }
    return {
      key,
      summary: null,
      rawData: null,
      isAvailable: false,
    };
  });

  // If there are missing keys, fetch raw chart and extract data
  if (missingKeys.length > 0) {
    const rawChart = await getRawChart(userId);

    if (!rawChart) {
      // No raw chart available - return results as is
      return results;
    }

    // Extract raw data for missing keys and start background jobs
    for (const key of missingKeys) {
      const rawData = extractChartDataByKey(rawChart, key);
      const resultIndex = results.findIndex((r) => r.key === key);

      if (resultIndex !== -1) {
        results[resultIndex].rawData = rawData;

        // Start background job to generate summary (non-blocking)
        waitUntil(
          generateSummaryForKey(userId, key, rawData).catch((error) => {
            console.error(`Failed to generate summary for ${key}:`, error);
          }),
        );
      }
    }
  }

  return results;
}
