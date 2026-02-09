import { SearchTimezoneResponse } from "@/utils/location";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  if (!lat || !lon) {
    return new Response("Missing lat or lon", { status: 400 });
  }
  const response = await fetch(
    `http://api.geonames.org/timezoneJSON?lat=${lat}&lng=${lon}&username=abhinayx`,
  ).then((res) => res.json() as Promise<SearchTimezoneResponse>);

  return NextResponse.json(response.gmtOffset);
};
