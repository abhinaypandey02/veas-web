import { and, gte, inArray, lt, notInArray } from "drizzle-orm";
import { NextResponse } from "next/server";

import {
  UserChartSummariesTable,
  UserChartTable,
  UserRawChartTable,
  UserTable,
} from "@/app/api/(graphql)/User/db";
import { db } from "@/app/api/lib/db";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export const POST = async () => {
  const startDate = new Date(Date.now() - 7 * ONE_DAY_IN_MS);
  const cutoffDate = new Date(Date.now() - ONE_DAY_IN_MS);

  const cleanupResult = await db.transaction(async (tx) => {
    const unusedCharts = await tx
      .delete(UserChartTable)
      .where(
        and(
          lt(UserChartTable.createdAt, cutoffDate),
          gte(UserChartTable.createdAt, startDate),
          notInArray(
            UserChartTable.id,
            tx.select({ id: UserTable.chartId }).from(UserTable),
          ),
        ),
      )
      .returning({
        id: UserChartTable.id,
      });

    const chartIds = unusedCharts.map((chart) => chart.id);
    if (!chartIds.length) return 0;
    await tx
      .delete(UserRawChartTable)
      .where(inArray(UserRawChartTable.chartId, chartIds));
    await tx
      .delete(UserChartSummariesTable)
      .where(inArray(UserChartSummariesTable.chartId, chartIds));
    return unusedCharts.length;
  });

  return NextResponse.json(
    {
      success: true,
      cutoffDate: cutoffDate.toISOString(),
      count: cleanupResult,
    },
    { status: 200 },
  );
};
