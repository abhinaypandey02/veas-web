import { query } from "naystack/graphql";
import { InputType, Field } from "type-graphql";
import { db } from "@/app/api/lib/db";
import { FeedbackTable } from "../db";

@InputType("SubmitFeedbackInput")
export class SubmitFeedbackInput {
  @Field()
  score!: number;

  @Field({ nullable: true })
  text?: string;
}

export default query(
  async (ctx, input: SubmitFeedbackInput) => {
    if (!ctx.userId) {
      throw new Error("Unauthorized");
    }

    if (input.score < 1 || input.score > 5) {
      throw new Error("Score must be between 1 and 5");
    }

    await db.insert(FeedbackTable).values({
      userId: ctx.userId,
      score: input.score,
      text: input.text,
    });

    return true;
  },
  {
    mutation: true,
    input: SubmitFeedbackInput,
    output: Boolean,
    authorized: true,
  },
);
