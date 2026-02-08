import { query } from "naystack/graphql";
import { InputType, Field } from "type-graphql";
import { db } from "@/app/api/lib/db";
import { UserTable } from "@/app/api/(graphql)/User/db";
import { eq } from "drizzle-orm";
import { updateRawChart } from "@/app/api/lib/charts/utils/compress";

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

    await updateRawChart(ctx.userId);

    return true;
  },
  {
    mutation: true,
    input: OnboardUserInput,
    output: Boolean,
  },
);
