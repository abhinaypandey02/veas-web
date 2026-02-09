import { query } from "naystack/graphql";
import { InputType, Field } from "type-graphql";
import { db } from "@/app/api/lib/db";
import {
  UserChartSummariesTable,
  UserChartTable,
} from "@/app/api/(graphql)/User/db";
import { and, eq } from "drizzle-orm";
import { updateRawChart } from "@/app/api/lib/charts/utils/compress";
import { waitUntil } from "@vercel/functions";
import {
  generateD1Summary,
  generateTransitSummaries,
  generateDashaSummaries,
} from "@/app/api/lib/charts/utils/summaries";

@InputType("OnboardUserInput")
export class OnboardUserInput {
  @Field()
  dateOfBirth: Date;

  @Field()
  placeOfBirthLat: number;

  @Field()
  placeOfBirthLong: number;

  @Field()
  timezone: number;
}

export default query(
  async (_, input: OnboardUserInput) => {
    const [existingChart] = await db
      .select({
        id: UserChartTable.id,
      })
      .from(UserChartTable)
      .where(
        and(
          eq(UserChartTable.dateOfBirth, input.dateOfBirth),
          eq(UserChartTable.placeOfBirthLat, input.placeOfBirthLat),
          eq(UserChartTable.placeOfBirthLong, input.placeOfBirthLong),
        ),
      )
      .limit(1);

    if (existingChart) {
      return existingChart.id;
    }

    const [rawChartId, chart] = await updateRawChart(input);
    if (!rawChartId) {
      throw new Error("Failed to update chart");
    }
    const [summaries] = await db
      .insert(UserChartSummariesTable)
      .values({})
      .returning({
        id: UserChartSummariesTable.id,
      });
    if (!summaries) {
      throw new Error("Failed to create summaries");
    }
    const [newChart] = await db
      .insert(UserChartTable)
      .values({ ...input, rawChartId, summariesId: summaries.id })
      .returning();
    const localDateOfBirth = new Date(input.dateOfBirth);
    localDateOfBirth.setMinutes(
      localDateOfBirth.getMinutes() + input.timezone * 60,
    );
    waitUntil(generateD1Summary(chart, summaries.id));
    waitUntil(generateTransitSummaries(chart, localDateOfBirth, summaries.id));
    waitUntil(generateDashaSummaries(chart, localDateOfBirth, summaries.id));
    return newChart.id;
  },
  {
    mutation: true,
    input: OnboardUserInput,
    output: Number,
  },
);
