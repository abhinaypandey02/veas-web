import { db } from "@/app/api/lib/db";
import { UserRawChartTable } from "@/app/api/(graphql)/User/db";
import { eq } from "drizzle-orm";
import { decompressChartData } from "./compress";

/**
 * Retrieves and decompresses the raw chart data for a user
 * @param userId - The user ID to get chart data for
 * @returns The decompressed chart data, or null if not found
 */
export async function getRawChart(
  userId: number,
): Promise<Record<string, unknown> | null> {
  const [chartRecord] = await db
    .select()
    .from(UserRawChartTable)
    .where(eq(UserRawChartTable.userId, userId));

  if (!chartRecord || !chartRecord.rawChart) {
    return null;
  }

  // rawChart is stored as JSONB with a base64-encoded compressed string
  // The JSONB structure: { compressed: "base64string" }
  const chartData = chartRecord.rawChart as Record<string, unknown>;
  if (!chartData.compressed || typeof chartData.compressed !== "string") {
    return null;
  }

  // Decompress the stored base64-encoded compressed data
  const decompressed = decompressChartData(chartData.compressed);
  return decompressed;
}
