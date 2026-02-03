import { apiFetch } from "./api";

export type ChartResponse = {
  sunSign: {
    sidereal: string;
    tropical: string;
    symbol: string;
    degree: number;
  };
  moonSign: {
    sidereal: string;
    nakshatra: string;
    symbol: string;
    degree: number;
  };
  ascendant: {
    sign: string;
    symbol: string;
    degree: number;
  };
  ayanamsa: number;
};

export async function calculateChart(params: {
  date: string;
  time: string;
  location: string;
  timezoneOffset: number;
}) {
  const response = await apiFetch("/calculate-chart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    auth: false,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to calculate chart");
  }

  return (await response.json()) as ChartResponse;
}
