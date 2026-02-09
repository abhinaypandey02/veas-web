import z from "zod";
import { generateObject, generateText } from "ai";
import { GetChartsResponse } from "../types";
import {
  getCurrentDashas,
  getD1Houses,
  getD1Planets,
  getPratyantardashas,
} from "./tools";
import { GROQ_MODEL } from "@/app/api/lib/ai";
import { db } from "@/app/api/lib/db";
import {
  UserChartSummariesTable,
  UserChartTable,
} from "@/app/api/(graphql)/User/db";
import { getTransits } from "./fetch";
import {
  getDashaSummarySystemPrompt,
  getTransitSummarySystemPrompt,
  INITIAL_SUMMARIZE_SYSTEM_PROMPT,
} from "@/app/api/(graphql)/Chat/prompts";
import { ChartSummaryType } from "@/app/api/(graphql)/User/enum";
import { and, eq } from "drizzle-orm";
import { waitUntil } from "@vercel/functions";

const WeeklyDailySummarySchema = z.object({
  dailySummary: z.string(),
  weeklySummary: z.string(),
});

type WeeklyDailySummary = z.infer<typeof WeeklyDailySummarySchema>;

const DashaSummariesSchema = z.object({
  mahadashaSummary: z.string(),
  antardashaSummary: z.string(),
  pratyantardashaSummary: z.string(),
});

type DashaSummaries = z.infer<typeof DashaSummariesSchema>;

export async function generateD1Summary(
  chart: GetChartsResponse,
  chartId: number,
) {
  const summary = await generateText({
    model: GROQ_MODEL,
    system: INITIAL_SUMMARIZE_SYSTEM_PROMPT,
    prompt: `D1 Planets: ${JSON.stringify(getD1Planets(chart))} \n\n D1 Houses: ${JSON.stringify(getD1Houses(chart))}`,
  });

  await db
    .update(UserChartTable)
    .set({ summary: summary.text })
    .where(eq(UserChartTable.id, chartId));
  return summary.text;
}

function buildNatalCore(chart: GetChartsResponse) {
  const houses = chart.d1_chart?.houses || [];
  const ascendant = houses.find((h) => h.number === 1) || null;

  const keyHouseNumbers = [1, 7, 10, 4, 2, 8];
  const key_houses = keyHouseNumbers
    .map((num) => houses.find((h) => h.number === num))
    .filter(Boolean);

  const key_planets =
    chart.d1_chart?.planets.map((p) => ({
      celestial_body: p.celestial_body,
      house: p.house,
      sign: p.sign,
      shadbala_total: p.shadbala?.Shadbala?.Total ?? null,
      dignity: p.dignities?.dignity ?? null,
    })) || [];

  return {
    ascendant,
    key_houses,
    key_planets,
  };
}

export async function generateTransitSummaries(
  chart: GetChartsResponse,
  dob: Date,
  chartId: number,
): Promise<WeeklyDailySummary> {
  const natal_core = buildNatalCore(chart);
  const today = new Date();
  const weekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const transit_range = await getTransits(chart, today, weekLater);
  const current_dasha = getPratyantardashas(chart, today, weekLater);
  const ashtakavarga_sav = chart.ashtakavarga?.sav || null;

  const payload = {
    natal_core,
    current_dasha,
    transit_range,
    ashtakavarga_sav,
  };

  const { object } = await generateObject({
    model: GROQ_MODEL,
    schema: WeeklyDailySummarySchema,
    system: getTransitSummarySystemPrompt(dob),
    prompt: JSON.stringify(payload),
  });
  waitUntil(
    updateChartSummaries(
      chartId,
      object.dailySummary,
      ChartSummaryType.Daily,
      new Date(today.getTime() + 24 * 60 * 60 * 1000),
    ),
  );
  waitUntil(
    updateChartSummaries(
      chartId,
      object.weeklySummary,
      ChartSummaryType.Weekly,
      new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
    ),
  );

  return object;
}

export async function generateDashaSummaries(
  chart: GetChartsResponse,
  dob: Date,
  chartId: number,
): Promise<DashaSummaries> {
  const d1_chart = {
    planets: chart.d1_chart?.planets || [],
    houses: getD1Houses(chart),
  };

  const d9_chart = chart.divisional_charts?.d9 || null;
  const d10_chart = chart.divisional_charts?.d10 || null;
  const current_dasha = chart.dashas.current;

  const payload = {
    d1_chart,
    d9_chart,
    d10_chart,
    current_dasha,
  };

  const { object } = await generateObject({
    model: GROQ_MODEL,
    schema: DashaSummariesSchema,
    system: getDashaSummarySystemPrompt(dob),
    prompt: JSON.stringify(payload),
  });

  const { mahadasha, antardasha, pratyantardasha } = getCurrentDashas(chart);

  waitUntil(
    updateChartSummaries(
      chartId,
      object.mahadashaSummary,
      ChartSummaryType.Mahadasha,
      mahadasha ? new Date(mahadasha?.end) : undefined,
    ),
  );
  waitUntil(
    updateChartSummaries(
      chartId,
      object.antardashaSummary,
      ChartSummaryType.Antardasha,
      antardasha ? new Date(antardasha?.end) : undefined,
    ),
  );
  waitUntil(
    updateChartSummaries(
      chartId,
      object.pratyantardashaSummary,
      ChartSummaryType.Pratyantardasha,
      pratyantardasha ? new Date(pratyantardasha?.end) : undefined,
    ),
  );

  return object;
}

export async function updateChartSummaries(
  chartId: number,
  summary: string,
  type: ChartSummaryType,
  expiresAt?: Date,
) {
  await db
    .insert(UserChartSummariesTable)
    .values({
      chartId,
      summary,
      type,
      expiresAt,
    })
    .onConflictDoUpdate({
      target: [UserChartSummariesTable.chartId, UserChartSummariesTable.type],
      set: {
        summary,
        expiresAt,
        updatedAt: new Date(),
      },
    });
}

export async function getChartSummary(chartId: number, type: ChartSummaryType) {
  const [summary] = await db
    .select()
    .from(UserChartSummariesTable)
    .where(
      and(
        eq(UserChartSummariesTable.chartId, chartId),
        eq(UserChartSummariesTable.type, type),
      ),
    )
    .limit(1);
  return summary;
}

export async function generateChartSummaries(
  chartId: number,
  type: ChartSummaryType,
  chart: GetChartsResponse,
  dob: Date,
) {
  switch (type) {
    case ChartSummaryType.Daily:
      return (await generateTransitSummaries(chart, dob, chartId)).dailySummary;
    case ChartSummaryType.Weekly:
      return (await generateTransitSummaries(chart, dob, chartId))
        .weeklySummary;
    case ChartSummaryType.Mahadasha:
      return (await generateDashaSummaries(chart, dob, chartId))
        .mahadashaSummary;
    case ChartSummaryType.Antardasha:
      return (await generateDashaSummaries(chart, dob, chartId))
        .antardashaSummary;
    case ChartSummaryType.Pratyantardasha:
      return (await generateDashaSummaries(chart, dob, chartId))
        .pratyantardashaSummary;
  }
}
