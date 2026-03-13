import { NextRequest } from "next/server";

export const ALLOWED_ORIGINS = [
  "https://app.veasapp.com",
  "http://localhost:8081",
];

export function getCorsHeaders(req: NextRequest, allowedOrigins?: string[]) {
  const origin = req.headers.get("origin") ?? "";
  const allowedOrigin = (allowedOrigins || ALLOWED_ORIGINS).includes(origin)
    ? origin
    : "";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}
