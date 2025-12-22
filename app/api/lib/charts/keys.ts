/**
 * Chart keys enum - defines all available chart types that can be summarized
 */
export enum ChartKey {
  D1 = "D1",
  D2 = "D2",
  D3 = "D3",
  D4 = "D4",
  D7 = "D7",
  D9 = "D9",
  D10 = "D10",
  D12 = "D12",
  D16 = "D16",
  D20 = "D20",
  D24 = "D24",
  D27 = "D27",
  D30 = "D30",
  D40 = "D40",
  D45 = "D45",
  D60 = "D60",
  DASHA = "DASHA",
  ASHTAKAVARGA = "ASHTAKAVARGA",
  PANCHANGA = "PANCHANGA",
}

/**
 * Maps chart keys to their corresponding fields in the raw chart response
 */
export const CHART_KEY_TO_FIELD: Record<ChartKey, string> = {
  [ChartKey.D1]: "d1_chart",
  [ChartKey.D2]: "divisional_charts.d2",
  [ChartKey.D3]: "divisional_charts.d3",
  [ChartKey.D4]: "divisional_charts.d4",
  [ChartKey.D7]: "divisional_charts.d7",
  [ChartKey.D9]: "divisional_charts.d9",
  [ChartKey.D10]: "divisional_charts.d10",
  [ChartKey.D12]: "divisional_charts.d12",
  [ChartKey.D16]: "divisional_charts.d16",
  [ChartKey.D20]: "divisional_charts.d20",
  [ChartKey.D24]: "divisional_charts.d24",
  [ChartKey.D27]: "divisional_charts.d27",
  [ChartKey.D30]: "divisional_charts.d30",
  [ChartKey.D40]: "divisional_charts.d40",
  [ChartKey.D45]: "divisional_charts.d45",
  [ChartKey.D60]: "divisional_charts.d60",
  [ChartKey.DASHA]: "dashas",
  [ChartKey.ASHTAKAVARGA]: "ashtakavarga",
  [ChartKey.PANCHANGA]: "panchanga",
};

/**
 * Extracts chart data for a specific key from the raw chart response
 * For DASHA, returns only current and upcoming (not all dashas)
 */
export function extractChartDataByKey(
  rawChart: Record<string, unknown>,
  key: ChartKey,
): unknown {
  const fieldPath = CHART_KEY_TO_FIELD[key];
  const parts = fieldPath.split(".");

  let current: unknown = rawChart;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return null;
    }
  }

  // Special handling for DASHA - return only current and upcoming
  if (key === ChartKey.DASHA && current && typeof current === "object") {
    const dashas = current as Record<string, unknown>;
    return {
      current: dashas.current || null,
      upcoming: dashas.upcoming || null,
    };
  }

  return current;
}
