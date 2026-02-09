import { and, inArray, lt, notInArray } from "drizzle-orm";
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
  const cutoffDate = new Date(Date.now() - ONE_DAY_IN_MS);

  const cleanupResult = await db.transaction(async (tx) => {
    const unusedCharts = await tx
      .delete(UserChartTable)
      .where(
        and(
          lt(UserChartTable.createdAt, cutoffDate),
          notInArray(
            UserChartTable.id,
            tx.select({ id: UserTable.chartId }).from(UserTable),
          ),
        ),
      )
      .returning({
        id: UserChartTable.id,
        rawChartId: UserChartTable.rawChartId,
        summariesId: UserChartTable.summariesId,
      });

    const rawChartIds = unusedCharts.map((chart) => chart.rawChartId);
    const summariesIds = unusedCharts.map((chart) => chart.summariesId);

    const unusedRawCharts = rawChartIds.length
      ? await tx
          .delete(UserRawChartTable)
          .where(
            and(
              lt(UserRawChartTable.createdAt, cutoffDate),
              inArray(UserRawChartTable.id, rawChartIds),
            ),
          )
          .returning({ id: UserRawChartTable.id })
      : [];

    const unusedSummaries = summariesIds.length
      ? await tx
          .delete(UserChartSummariesTable)
          .where(
            and(
              lt(UserChartSummariesTable.createdAt, cutoffDate),
              inArray(UserChartSummariesTable.id, summariesIds),
            ),
          )
          .returning({ id: UserChartSummariesTable.id })
      : [];

    return {
      deletedCharts: unusedCharts.length,
      deletedRawCharts: unusedRawCharts.length,
      deletedSummaries: unusedSummaries.length,
    };
  });

  return NextResponse.json(
    {
      success: true,
      cutoffDate: cutoffDate.toISOString(),
      ...cleanupResult,
    },
    { status: 200 },
  );
};
