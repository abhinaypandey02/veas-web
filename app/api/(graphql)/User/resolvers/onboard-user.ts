import { query } from "naystack/graphql";
import { InputType, Field } from "type-graphql";
import { db } from "@/app/api/lib/db";
import { UserChartTable } from "@/app/api/(graphql)/User/db";
import { and, eq } from "drizzle-orm";
import { updateRawChart } from "@/app/api/lib/charts/utils/compress";
import { waitUntil } from "@vercel/functions";
import {
  generateD1Summary,
  generateTransitSummaries,
  generateDashaSummaries,
} from "@/app/api/lib/charts/utils/summaries";
import { getLocalTime } from "@/utils/location";

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
    const [newChart] = await db
      .insert(UserChartTable)
      .values(input)
      .returning({ id: UserChartTable.id });
    waitUntil(
      (async () => {
        const localDateOfBirth = getLocalTime(
          input.dateOfBirth,
          input.timezone,
        );
        const chart = await updateRawChart(newChart.id, input);

        if (!chart) {
          throw new Error("Failed to update chart");
        }
        await generateD1Summary(chart, newChart.id);
        await generateTransitSummaries(chart, localDateOfBirth, newChart.id);
        await generateDashaSummaries(chart, localDateOfBirth, newChart.id);
      })(),
    );
    return newChart.id;
  },
  {
    mutation: true,
    input: OnboardUserInput,
    output: Number,
  },
);
