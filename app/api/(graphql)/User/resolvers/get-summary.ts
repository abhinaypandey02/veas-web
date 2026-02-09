import { query } from "naystack/graphql";
import { InputType, Field } from "type-graphql";
import { db } from "@/app/api/lib/db";
import {
  UserTable,
  UserChartTable,
  UserRawChartTable,
} from "@/app/api/(graphql)/User/db";
import { eq } from "drizzle-orm";
import { ChartSummaryType } from "@/app/api/(graphql)/User/enum";
import { decompressChartData } from "@/app/api/lib/charts/utils/compress";
import {
  getChartSummary,
  generateChartSummaries,
} from "@/app/api/lib/charts/utils/summaries";
import { getLocalTime } from "@/utils/location";

@InputType("GetSummaryInput")
export class GetSummaryInput {
  @Field(() => ChartSummaryType)
  type: ChartSummaryType;
}

export default query(
  async (ctx, input: GetSummaryInput) => {
    if (!ctx.userId) {
      throw new Error("Unauthorized");
    }

    // First, fetch only chartId to check for existing summary
    const [user] = await db
      .select({ chartId: UserTable.chartId })
      .from(UserTable)
      .where(eq(UserTable.id, ctx.userId));

    if (!user) {
      throw new Error("User not found");
    }

    const existingSummary = await getChartSummary(user.chartId, input.type);

    const isExpired =
      existingSummary?.expiresAt && existingSummary.expiresAt < new Date();

    if (existingSummary && !isExpired) {
      return existingSummary.summary;
    }

    // Only fetch full chart data when regeneration is needed
    const [chartData] = await db
      .select({
        dateOfBirth: UserChartTable.dateOfBirth,
        rawChart: UserRawChartTable.rawChart,
        timezoneOffset: UserTable.timezoneOffset,
      })
      .from(UserTable)
      .where(eq(UserTable.id, ctx.userId))
      .innerJoin(UserChartTable, eq(UserTable.chartId, UserChartTable.id))
      .innerJoin(
        UserRawChartTable,
        eq(UserTable.chartId, UserRawChartTable.chartId),
      );

    if (!chartData) {
      throw new Error("User chart not found");
    }

    const chart = decompressChartData(chartData.rawChart);
    const localDateOfBirth = getLocalTime(
      chartData.dateOfBirth,
      chartData.timezoneOffset,
    );

    await generateChartSummaries(
      user.chartId,
      input.type,
      chart,
      localDateOfBirth,
    );

    const newSummary = await getChartSummary(user.chartId, input.type);
    return newSummary?.summary || null;
  },
  {
    input: GetSummaryInput,
    output: String,
    outputOptions: {
      nullable: true,
    },
    authorized: true,
  },
);
