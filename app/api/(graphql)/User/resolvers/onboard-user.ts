import { query } from "naystack/graphql";
import { InputType, Field } from "type-graphql";
import { db } from "@/app/api/lib/db";
import { UserTable } from "@/app/api/(graphql)/User/db";
import { eq } from "drizzle-orm";
import { updateRawChart } from "@/app/api/lib/charts/utils/compress";
import { waitUntil } from "@vercel/functions";
import { generateText } from "ai";
import { INITIAL_SUMMARIZE_SYSTEM_PROMPT } from "../../Chat/prompts";
import { addUserChatSummary } from "../../Chat/utils";
import { GROQ_MODEL } from "@/app/api/lib/ai";
import { getD1Houses, getD1Planets } from "@/app/api/lib/charts/utils/tools";

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

  @Field()
  timezoneOffset: number;

  @Field()
  placeOfBirth: string;
}

export default query(
  async (ctx, input: OnboardUserInput) => {
    if (!ctx.userId) {
      throw new Error("Unauthorized");
    }
    const [updatedUser] = await db
      .update(UserTable)
      .set(input)
      .where(eq(UserTable.id, ctx.userId))
      .returning();

    if (!updatedUser) {
      throw new Error("User not found");
    }

    const chart = await updateRawChart(ctx.userId);
    if (!chart) {
      throw new Error("Failed to update chart");
    }

    waitUntil(
      (async () => {
        const summary = await generateText({
          model: GROQ_MODEL,
          system: INITIAL_SUMMARIZE_SYSTEM_PROMPT,
          prompt: `D1 Planets: ${JSON.stringify(getD1Planets(chart))} \n\n D1 Houses: ${JSON.stringify(getD1Houses(chart))}`,
        });
        await addUserChatSummary(ctx.userId!, summary.text);
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
