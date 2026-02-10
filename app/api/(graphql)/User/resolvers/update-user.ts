import { query } from "naystack/graphql";
import { InputType, Field } from "type-graphql";
import { db } from "@/app/api/lib/db";
import { UserTable } from "@/app/api/(graphql)/User/db";
import { eq } from "drizzle-orm";
import { Gender } from "../enum";

@InputType("UpdateUserInput")
export class UpdateUserInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  placeOfBirth?: string;

  @Field({ nullable: true })
  timezoneOffset?: number;

  @Field(() => Gender, { nullable: true })
  gender?: Gender;
}

export default query(
  async (ctx, input: UpdateUserInput) => {
    if (!ctx.userId) {
      throw new Error("Unauthorized");
    }

    const updates: Partial<typeof UserTable.$inferInsert> = {};

    if (input.name !== undefined) updates.name = input.name;
    if (input.placeOfBirth !== undefined)
      updates.placeOfBirth = input.placeOfBirth;
    if (input.timezoneOffset !== undefined)
      updates.timezoneOffset = input.timezoneOffset;
    if (input.gender !== undefined) updates.gender = input.gender;

    if (Object.keys(updates).length === 0) {
      return true;
    }

    await db.update(UserTable).set(updates).where(eq(UserTable.id, ctx.userId));

    return true;
  },
  {
    mutation: true,
    input: UpdateUserInput,
    output: Boolean,
    authorized: true,
  },
);
