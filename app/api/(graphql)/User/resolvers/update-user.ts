import { query } from "naystack/graphql";
import { InputType, Field } from "type-graphql";
import { db } from "@/app/api/lib/db";
import { UserTable } from "@/app/api/(graphql)/User/db";
import { eq } from "drizzle-orm";
import { User } from "../types";
import { Gender } from "../enum";

@InputType("UpdateUserInput")
export class UpdateUserInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

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
    if (input.email !== undefined) updates.email = input.email;
    if (input.placeOfBirth !== undefined)
      updates.placeOfBirth = input.placeOfBirth;
    if (input.timezoneOffset !== undefined)
      updates.timezoneOffset = input.timezoneOffset;
    if (input.gender !== undefined) updates.gender = input.gender;

    if (Object.keys(updates).length === 0) {
      throw new Error("No fields to update");
    }

    const [updated] = await db
      .update(UserTable)
      .set(updates)
      .where(eq(UserTable.id, ctx.userId))
      .returning({
        id: UserTable.id,
        name: UserTable.name,
        email: UserTable.email,
        placeOfBirth: UserTable.placeOfBirth,
        timezoneOffset: UserTable.timezoneOffset,
        gender: UserTable.gender,
      });

    if (!updated) {
      throw new Error("User not found");
    }

    return updated;
  },
  {
    mutation: true,
    input: UpdateUserInput,
    output: User,
    authorized: true,
  },
);
