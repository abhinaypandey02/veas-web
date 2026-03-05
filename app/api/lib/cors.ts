import { NextRequest } from "next/server";

export function getCorsHeaders(req: NextRequest, allowedOrigins: string[]) {
  const origin = req.headers.get("origin") ?? "";
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}
