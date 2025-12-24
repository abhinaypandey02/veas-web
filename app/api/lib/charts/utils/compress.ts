import { gzipSync, gunzipSync } from "zlib";

/**
 * Compresses JSON data using GZIP and returns as base64 string
 * Uses synchronous compression for better performance on small-to-medium data
 * @param data - The data to compress (object or string)
 * @returns Compressed data as base64-encoded string (for JSONB storage)
 */
export function compressChartData(
  data: Record<string, unknown> | string,
): string {
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
export function decompressChartData(
  compressedDataBase64: string,
): Record<string, unknown> {
  const compressedBuffer = Buffer.from(compressedDataBase64, "base64");
  const decompressed = gunzipSync(compressedBuffer);
  const jsonString = decompressed.toString("utf-8");
  return JSON.parse(jsonString) as Record<string, unknown>;
}
