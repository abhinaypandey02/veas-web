import type { GetChartsResponse } from "../types";

export interface GetChartsParams {
  datetime: Date | string;
  lat: number;
  lon: number;
}

// Re-export the response type for convenience
export type { GetChartsResponse };

/**
 * Fetches charts from the Vedic Charts API
 * @param params - Chart parameters including datetime, timezone, lat, and lon
 * @returns The JSON response from the API
 */
export async function getCharts(
  params: GetChartsParams,
): Promise<GetChartsResponse> {
  // Format datetime to ISO string if it's a Date object
  const datetimeString =
    params.datetime instanceof Date
      ? params.datetime.toISOString()
      : params.datetime;

  const requestBody = {
    datetime: datetimeString,
    timezone: 0,
    lat: params.lat,
    lon: params.lon,
  };

  const response = await fetch(
    "https://vedic-charts-python.vercel.app/get_charts",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch charts: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}
