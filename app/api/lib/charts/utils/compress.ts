import { gzipSync, gunzipSync } from "zlib";
import { GetChartsResponse } from "../types";
import { UserRawChartTable, UserTable } from "@/app/api/(graphql)/User/db";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { getCharts } from "./fetch";

/**
 * Compresses JSON data using GZIP and returns as base64 string
 * Uses synchronous compression for better performance on small-to-medium data
 * @param data - The data to compress (object or string)
 * @returns Compressed data as base64-encoded string (for JSONB storage)
 */
export function compressJSON(data: object): string {
  const jsonString = typeof data === "string" ? data : JSON.stringify(data);
  // Use level 6 (default) - good balance of speed and compression
  // For faster compression, use level 1-3; for better compression, use 7-9
  const compressed = gzipSync(Buffer.from(jsonString, "utf-8"), {
    level: 6,
  });
  return compressed.toString("base64");
}

/**
 * Decompresses GZIP compressed data (from base64 string) back to JSON
 * Uses synchronous decompression for better performance
 * @param compressedDataBase64 - The compressed data as base64-encoded string
 * @returns The decompressed JSON object
 */
export function decompressChartData(compressedDataBase64: string) {
  const compressedBuffer = Buffer.from(compressedDataBase64, "base64");
  const decompressed = gunzipSync(compressedBuffer);
  const jsonString = decompressed.toString("utf-8");
  return JSON.parse(jsonString) as GetChartsResponse;
}

export async function getRawChart(userId: number) {
  const [chartRecord] = await db
    .select()
    .from(UserRawChartTable)
    .where(eq(UserRawChartTable.userId, userId));

  if (!chartRecord || !chartRecord.rawChart) {
    return updateRawChart(userId);
  }

  // rawChart is stored as JSONB with a base64-encoded compressed string
  // The JSONB structure: { compressed: "base64string" }
  const chartData = chartRecord.rawChart as Record<string, unknown>;
  if (!chartData.compressed || typeof chartData.compressed !== "string") {
    return null;
  }

  // Decompress the stored base64-encoded compressed data
  return decompressChartData(chartData.compressed);
}
export async function updateRawChart(userId: number) {
  // Get user data
  const [user] = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.id, userId));

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.dateOfBirth || !user.placeOfBirthLat || !user.placeOfBirthLong) {
    throw new Error(
      "User birth data incomplete. Please complete onboarding first.",
    );
  }

  // Fetch chart data
  const chartData = await getCharts({
    datetime: user.dateOfBirth,
    lat: user.placeOfBirthLat,
    lon: user.placeOfBirthLong,
  });

  // Compress the filtered chart data using GZIP (returns base64 string)
  const compressedBase64 = compressJSON(chartData);

  // Store compressed data as JSONB: { compressed: "base64string" }
  const rawChartJsonb = {
    compressed: compressedBase64,
  };

  // Upsert raw chart (filtered and compressed as JSONB)
  await db
    .insert(UserRawChartTable)
    .values({
      userId,
      rawChart: rawChartJsonb,
    })
    .onConflictDoUpdate({
      target: UserRawChartTable.userId,
      set: {
        rawChart: rawChartJsonb,
        updatedAt: new Date(),
      },
    });
  return chartData;
}
