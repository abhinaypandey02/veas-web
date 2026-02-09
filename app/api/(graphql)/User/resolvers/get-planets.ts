import { query } from "naystack/graphql";
import { Field, ObjectType } from "type-graphql";
import { db } from "@/app/api/lib/db";
import { UserTable, UserRawChartTable } from "@/app/api/(graphql)/User/db";
import { eq } from "drizzle-orm";
import { decompressChartData } from "@/app/api/lib/charts/utils/compress";
import { getCurrentDashas } from "@/app/api/lib/charts/utils/tools";

@ObjectType("D1Planet")
export class D1Planet {
  @Field()
  name: string;

  @Field()
  sign: string;

  @Field()
  house: number;
}

@ObjectType("CurrentMahadasha")
export class CurrentMahadasha {
  @Field()
  planet: string;

  @Field()
  start: string;

  @Field()
  end: string;
}

@ObjectType("PlanetsResponse")
export class PlanetsResponse {
  @Field(() => [D1Planet])
  planets: D1Planet[];

  @Field(() => CurrentMahadasha, { nullable: true })
  currentMahadasha?: CurrentMahadasha;
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
      .innerJoin(
        UserRawChartTable,
        eq(UserTable.chartId, UserRawChartTable.chartId),
      );

    if (!chartData) {
      throw new Error("User chart not found");
    }

    const chart = decompressChartData(chartData.rawChart);
    const { mahadasha } = getCurrentDashas(chart);

    return {
      planets: chart.d1_chart.planets.map((planet) => ({
        name: planet.celestial_body,
        sign: planet.sign,
        house: planet.house,
      })),
      currentMahadasha: mahadasha,
    };
  },
  {
    output: PlanetsResponse,
    authorized: true,
  },
);
