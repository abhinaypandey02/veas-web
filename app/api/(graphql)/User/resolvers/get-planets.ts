import { query } from "naystack/graphql";
import { Field, ObjectType } from "type-graphql";
import { db } from "@/app/api/lib/db";
import {
  UserTable,
  UserChartTable,
  UserRawChartTable,
} from "@/app/api/(graphql)/User/db";
import { eq } from "drizzle-orm";
import { decompressChartData } from "@/app/api/lib/charts/utils/compress";

@ObjectType("D1Planet")
export class D1Planet {
  @Field()
  name: string;

  @Field()
  sign: string;

  @Field()
  house: number;
}

export default query(
  async (ctx) => {
    if (!ctx.userId) {
      throw new Error("Unauthorized");
    }

    const [chartData] = await db
      .select({
        rawChart: UserRawChartTable.rawChart,
      })
      .from(UserTable)
      .where(eq(UserTable.id, ctx.userId))
      .innerJoin(UserChartTable, eq(UserTable.chartId, UserChartTable.id))
      .innerJoin(
        UserRawChartTable,
        eq(UserChartTable.rawChartId, UserRawChartTable.id),
      );

    if (!chartData) {
      throw new Error("User chart not found");
    }

    const chart = decompressChartData(chartData.rawChart);

    return chart.d1_chart.planets.map((planet) => ({
      name: planet.celestial_body,
      sign: planet.sign,
      house: planet.house,
    }));
  },
  {
    output: [D1Planet],
    authorized: true,
  },
);
