import { gzipSync, gunzipSync } from "zlib";
import { GetChartsResponse } from "../types";
import {
  UserChartTable,
  UserRawChartTable,
  UserTable,
} from "@/app/api/(graphql)/User/db";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { getCharts } from "./fetch";
import { OnboardUserInput } from "@/app/api/(graphql)/User/resolvers/onboard-user";

/**
 * Compresses JSON data using GZIP and returns as base64 string
 * Uses synchronous compression for better performance on small-to-medium data
 * @param data - The data to compress (object or string)
 * @returns Compressed data as base64-encoded string
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
    .from(UserTable)
    .where(eq(UserTable.id, userId))
    .innerJoin(UserChartTable, eq(UserTable.chartId, UserChartTable.id))
    .innerJoin(
      UserRawChartTable,
      eq(UserChartTable.rawChartId, UserRawChartTable.id),
    );

  if (!chartRecord?.user_raw_charts?.rawChart) {
    return null;
  }

  return decompressChartData(chartRecord.user_raw_charts.rawChart);
}

export async function updateRawChart(input: OnboardUserInput) {
  // Fetch chart data
  const chartData = await getCharts({
    datetime: input.dateOfBirth,
    lat: input.placeOfBirthLat,
    lon: input.placeOfBirthLong,
  });

  // Compress the filtered chart data using GZIP (returns base64 string)
  const compressedBase64 = compressJSON(chartData);

  // Upsert raw chart (filtered and compressed as base64 text)
  const [rawChart] = await db
    .insert(UserRawChartTable)
    .values({
      rawChart: compressedBase64,
    })
    .onConflictDoNothing()
    .returning({
      id: UserRawChartTable.id,
    });

  if (!rawChart) {
    throw new Error("Failed to insert raw chart");
  }

  return [rawChart.id, chartData] as const;
}
