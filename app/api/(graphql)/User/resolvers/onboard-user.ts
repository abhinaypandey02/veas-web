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
import { generateText } from "ai";
import { INITIAL_SUMMARIZE_SYSTEM_PROMPT } from "../../Chat/prompts";
import { GROQ_MODEL } from "@/app/api/lib/ai";
import { getD1Houses, getD1Planets } from "@/app/api/lib/charts/utils/tools";

@InputType("OnboardUserInput")
export class OnboardUserInput {
  @Field()
  dateOfBirth: Date;

  @Field()
  placeOfBirthLat: number;

  @Field()
  placeOfBirthLong: number;
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
      .returning({
        id: UserChartTable.id,
      });

    waitUntil(
      (async () => {
        const summary = await generateText({
          model: GROQ_MODEL,
          system: INITIAL_SUMMARIZE_SYSTEM_PROMPT,
          prompt: `D1 Planets: ${JSON.stringify(getD1Planets(chart))} \n\n D1 Houses: ${JSON.stringify(getD1Houses(chart))}`,
        });
        await db
          .update(UserChartSummariesTable)
          .set({ d1Summary: summary.text })
          .where(eq(UserChartSummariesTable.id, summaries.id));
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
