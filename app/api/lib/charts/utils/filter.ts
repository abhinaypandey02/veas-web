import type { GetChartsResponse } from "./fetch";

/**
 * Filters planet data to keep only essential fields for LLM analysis
 * Removes detailed technical calculations but keeps all astrologically meaningful data
 */
export function filterPlanet(planet: unknown): unknown {
  if (!planet || typeof planet !== "object") return planet;

  const p = planet as Record<string, unknown>;

  // Keep all essential planet fields that LLMs can interpret
  const filtered: Record<string, unknown> = {
    celestial_body: p.celestial_body,
    sign: p.sign,
    sign_degrees: p.sign_degrees, // Keep degrees - useful for precise analysis
    nakshatra: p.nakshatra,
    pada: p.pada,
    nakshatra_deity: p.nakshatra_deity,
    house: p.house,
    motion_type: p.motion_type,
    dignities: p.dignities, // Full dignities object - important for interpretation
    conjuncts: p.conjuncts,
    aspects: p.aspects, // Full aspects - crucial for chart reading
    has_lordship_houses: p.has_lordship_houses,
  };

  // Keep only overall Shadbala strength (Total and Rupas)
  // Remove detailed breakdowns: Sthanabala components, Digbala, Kaalabala, etc.
  if (p.shadbala && typeof p.shadbala === "object") {
    const shadbala = p.shadbala as Record<string, unknown>;
    if (shadbala.Shadbala && typeof shadbala.Shadbala === "object") {
      const shadbalaMain = shadbala.Shadbala as Record<string, unknown>;
      filtered.shadbala = {
        Shadbala: {
          Total: shadbalaMain.Total,
          Rupas: shadbalaMain.Rupas,
        },
      };
    }
  }

  return filtered;
}

/**
 * Filters house data to keep only essential fields for summary generation
 */
export function filterHouse(house: unknown): unknown {
  if (!house || typeof house !== "object") return house;

  const h = house as Record<string, unknown>;

  // Simplify occupants to just planet names
  let occupants: string[] = [];
  if (Array.isArray(h.occupants)) {
    occupants = h.occupants
      .map((occ) => {
        if (occ && typeof occ === "object") {
          const occObj = occ as Record<string, unknown>;
          return occObj.celestial_body as string;
        }
        return null;
      })
      .filter((name): name is string => typeof name === "string");
  }

  // Keep essential house fields
  return {
    number: h.number,
    sign: h.sign,
    lord: h.lord,
    occupants,
    aspects_received: h.aspects_received,
    purposes: h.purposes,
    lord_placed_sign: h.lord_placed_sign,
    lord_placed_house: h.lord_placed_house,
  };
}

/**
 * Filters a chart (D1, D9, D10, etc.) to keep only essential data for LLM analysis
 * Reusable for both summary generation and raw chart storage
 */
export function filterChart(chart: unknown): unknown {
  if (!chart || typeof chart !== "object") return chart;

  const c = chart as Record<string, unknown>;
  const filtered: Record<string, unknown> = {};

  // Filter planets if present
  if (Array.isArray(c.planets)) {
    filtered.planets = c.planets.map(filterPlanet);
  }

  // Filter houses if present
  if (Array.isArray(c.houses)) {
    filtered.houses = c.houses.map(filterHouse);
  }

  // Keep any other top-level chart properties (if any)
  Object.keys(c).forEach((key) => {
    if (key !== "planets" && key !== "houses") {
      filtered[key] = c[key];
    }
  });

  return filtered;
}

/**
 * Filters the entire chart response to remove unnecessary technical details
 * while preserving all data that LLMs can meaningfully interpret
 */
export function filterRawChart(
  chartData: GetChartsResponse,
): Record<string, unknown> {
  // Filter D1 chart
  const filteredD1Chart = filterChart(chartData.d1_chart);

  // Filter all divisional charts
  const filteredDivisionalCharts: Record<string, unknown> = {};
  const divisionalCharts = chartData.divisional_charts as Record<
    string,
    unknown
  >;
  Object.keys(divisionalCharts).forEach((key) => {
    filteredDivisionalCharts[key] = filterChart(divisionalCharts[key]);
  });

  // Return filtered chart data - keep everything else as is
  // (dashas, panchanga, ayanamsa, person, ashtakavarga are all useful for LLMs)
  return {
    d1_chart: filteredD1Chart,
    divisional_charts: filteredDivisionalCharts,
    dashas: chartData.dashas, // Keep dashas - important for predictions
    panchanga: chartData.panchanga, // Keep panchanga - useful context
    ayanamsa: chartData.ayanamsa, // Keep ayanamsa - important reference
    person: chartData.person, // Keep person data - birth details
    ashtakavarga: chartData.ashtakavarga, // Keep ashtakavarga - useful for analysis
  };
}
