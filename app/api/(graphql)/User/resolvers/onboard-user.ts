import { query } from "naystack/graphql";
import { InputType, Field } from "type-graphql";
import { db } from "@/app/api/lib/db";
import { UserTable } from "@/app/api/(graphql)/User/db";
import { eq } from "drizzle-orm";
import { updateRawChart } from "@/app/api/lib/charts/update-raw-chart";
import { getChartData } from "@/app/api/lib/charts/get-chart-data";
import { ChartKey } from "@/app/api/lib/charts/keys";
import { waitUntil } from "@vercel/functions";

@InputType("OnboardUserInput")
export class OnboardUserInput {
  @Field()
  name: string;

  @Field()
  dateOfBirth: Date;

  @Field()
  placeOfBirthLat: number;

  @Field()
  placeOfBirthLong: number;
}

export default query(
  async (ctx, input: OnboardUserInput) => {
    if (!ctx.userId) {
      throw new Error("Unauthorized");
    }
    const [updatedUser] = await db
      .update(UserTable)
      .set({
        name: input.name,
        dateOfBirth: input.dateOfBirth,
        placeOfBirthLat: input.placeOfBirthLat,
        placeOfBirthLong: input.placeOfBirthLong,
      })
      .where(eq(UserTable.id, ctx.userId))
      .returning();

    if (!updatedUser) {
      throw new Error("User not found");
    }

    // Update raw chart and generate initial summaries in background (non-blocking)
    waitUntil(
      (async () => {
        if (!ctx.userId) return;

        try {
          // First, update the raw chart
          await updateRawChart(ctx.userId);

          // Then, trigger summary generation for D1 and DASHA
          // This will extract raw data and start background jobs to generate summaries
          await getChartData(ctx.userId, [
            ChartKey.D1,
            ChartKey.CURRENT_AND_NEXT_DASHA,
          ]).catch((error) => {
            console.error("Failed to get chart data for D1 and DASHA:", error);
          });
        } catch (error) {
          console.error("Failed to update raw chart:", error);
        }
      })(),
    );

    return true;
  },
  {
    mutation: true,
    input: OnboardUserInput,
    output: Boolean,
  },
);
