import z from "zod";
import {
  DashaValue,
  DivisionalCharts,
  GetChartsResponse,
  Planet,
} from "../types";
import { tool } from "ai";
import { getTransits } from "./fetch";

export function getD1Planets(chart: GetChartsResponse) {
  return (
    chart.d1_chart?.planets.map((planet) => {
      const { shadbala, aspects, ...rest } = planet;
      return rest;
    }) || []
  );
}

export function getD1Houses(chart: GetChartsResponse) {
  return (
    chart.d1_chart?.houses.map((house) => {
      const { occupants, ...rest } = house;
      return {
        ...rest,
        occupants: occupants.map((occupant) => occupant.celestial_body),
      };
    }) || []
  );
}

export function getTools(
  chart: GetChartsResponse,
  onToolCall: (message: string) => void,
  rest?: Partial<Parameters<typeof tool>[0]>,
) {
  const tools = [
    {
      name: "getD1Planets",
      callMessage: "looking at your core birth chart",
      description: "Get the planets in the D1 chart",
      execute: async () => getD1Planets(chart),
    },
    {
      name: "getD1Shadbala",
      callMessage: "checking your planetary strength levels",
      description: "Get the shadbala of the planets in the D1 chart",
      execute: async () =>
        chart.d1_chart?.planets.map((planet) => planet.shadbala) || [],
    },
    {
      name: "getD1Aspects",
      callMessage: "analyzing how your planets interact",
      description: "Get the aspects of the planets in the D1 chart",
      execute: async () =>
        chart.d1_chart?.planets.map((planet) => planet.aspects) || [],
    },
    {
      name: "getD1Houses",
      callMessage: "reviewing your life areas and placements",
      description: "Get the houses of the planets in the D1 chart",
      execute: async () => getD1Houses(chart),
    },
    {
      name: "getDivisionalCharts",
      callMessage: "digging into deeper layers of your chart",
      description: "Get the divisional charts of the chart",
      inputSchema: z.object({
        chartType: z.enum(Object.keys(chart.divisional_charts)),
      }),
      execute: async ({ chartType }: { chartType: keyof DivisionalCharts }) =>
        chart.divisional_charts[chartType],
    },

    {
      name: "getAshtakavarga",
      callMessage: "calculating your planetary support scores",
      description: "Get the ashtakavarga",
      execute: async () => chart.ashtakavarga,
    },
    {
      name: "getPanchanga",
      callMessage: "checking your birth day influences",
      description: "Get the panchanga",
      execute: async () => chart.panchanga,
    },
    {
      name: "getAyanamsa",
      callMessage: "adjusting your chart to the sidereal system",
      description: "Get the ayanamsa",
      execute: async () => chart.ayanamsa,
    },
    {
      name: "getMahadashas",
      callMessage: "reviewing your major life cycles",
      description: "Get the Mahadashas",
      execute: async () =>
        Object.entries(chart.dashas.all?.mahadashas || {}).map(
          ([key, value]) => ({
            start: value.start,
            end: value.end,
            planet: key,
          }),
        ),
    },
    {
      name: "getAntardashas",
      callMessage: "looking at your sub-cycle influences",
      description: "Get the Antardashas",
      inputSchema: z.object({
        from: z.iso.date(),
        to: z.iso.date(),
      }),
      execute: async ({ from, to }: { from: string; to: string }) =>
        getAntardashas(chart, new Date(from), new Date(to)),
    },
    {
      name: "getPratyantardashas",
      callMessage: "zooming into short-term timing influences...",
      description: "Get the Pratyantardashas",
      inputSchema: z.object({
        from: z.iso.date(),
        to: z.iso.date(),
      }),
      execute: async ({ from, to }: { from: string; to: string }) =>
        getPratyantardashas(chart, new Date(from), new Date(to)),
    },
    {
      name: "getTransits",
      callMessage: "checking current planetary movements...",
      description:
        "Get the transits for daily/weekly horoscopes. From and to can be same for single day. Maxmimum range is 30 days.",
      inputSchema: z.object({
        from: z.iso.date(),
        to: z.iso.date(),
      }),
      execute: async ({ from, to }: { from: string; to: string }) =>
        getTransits(chart, new Date(from), new Date(to)),
    },
  ];
  return tools.reduce(
    (acc, _tool) => ({
      ...acc,
      [_tool.name]: tool({
        // @ts-expect-error - zod object is not a flexible schema
        inputSchema: z.object({}),
        onInputAvailable: ({ input }) => {
          onToolCall(_tool.callMessage);
        },
        ...rest,
        ..._tool,
      }),
    }),
    {},
  );
}

export function getDashas<T extends DashaValue>(
  chartData: Partial<Record<Planet, T>>,
  from: Date,
  to: Date,
  parseValue: (key: string, value: T) => object,
) {
  const mahadashas = [];
  for (const [key, value] of Object.entries(chartData)) {
    const dashaStart = new Date(value.start);
    const dashaEnd = new Date(value.end);

    // Check if dasha overlaps with the query range [from, to]
    // Two ranges overlap if: dashaStart < to AND dashaEnd > from
    if (dashaStart < to && dashaEnd > from) {
      mahadashas.push(parseValue(key, value));
    }

    // If we've passed the query range, we can stop
    if (dashaStart >= to) {
      break;
    }
  }
  return mahadashas;
}
export function getAntardashas(chart: GetChartsResponse, from: Date, to: Date) {
  const dashas = chart.dashas.all?.mahadashas || {};
  return getDashas(dashas, from, to, (key, value) => ({
    start: value.start,
    end: value.end,
    planet: key,
    antardashas: getDashas(value.antardashas, from, to, (key, value) => ({
      start: value.start,
      end: value.end,
      planet: key,
    })),
  }));
}

export function getPratyantardashas(
  chart: GetChartsResponse,
  from: Date,
  to: Date,
) {
  const dashas = chart.dashas.all?.mahadashas || {};
  return getDashas(dashas, from, to, (key, value) => ({
    start: value.start,
    end: value.end,
    planet: key,
    antardashas: getDashas(value.antardashas, from, to, (key, value) => ({
      start: value.start,
      end: value.end,
      planet: key,
      pratyantardashas: getDashas(
        value.pratyantardashas,
        from,
        to,
        (key, value) => ({
          start: value.start,
          end: value.end,
          planet: key,
        }),
      ),
    })),
  }));
}

export function getCurrentDashas(chart: GetChartsResponse) {
  const current_dasha = chart.dashas.current;
  const currentMahadashaKey = Object.keys(
    current_dasha?.mahadashas ?? {},
  )[0] as Planet | undefined;
  const currentMahadasha = currentMahadashaKey
    ? current_dasha?.mahadashas?.[currentMahadashaKey]
    : undefined;

  const currentAntardashaKey = Object.keys(
    currentMahadasha?.antardashas ?? {},
  )[0] as Planet | undefined;
  const currentAntardasha = currentAntardashaKey
    ? currentMahadasha?.antardashas?.[currentAntardashaKey]
    : undefined;

  const currentPratyantardashaKey = Object.keys(
    currentAntardasha?.pratyantardashas ?? {},
  )[0] as Planet | undefined;
  const currentPratyantardasha = currentPratyantardashaKey
    ? currentAntardasha?.pratyantardashas?.[currentPratyantardashaKey]
    : undefined;
  return {
    mahadasha:
      currentMahadashaKey && currentMahadasha
        ? {
            planet: currentMahadashaKey,
            start: currentMahadasha?.start,
            end: currentMahadasha?.end,
          }
        : undefined,
    antardasha:
      currentAntardashaKey && currentAntardasha
        ? {
            planet: currentAntardashaKey,
            start: currentAntardasha?.start,
            end: currentAntardasha?.end,
          }
        : undefined,
    pratyantardasha:
      currentPratyantardashaKey && currentPratyantardasha
        ? {
            planet: currentPratyantardashaKey,
            start: currentPratyantardasha?.start,
            end: currentPratyantardasha?.end,
          }
        : undefined,
  };
}
