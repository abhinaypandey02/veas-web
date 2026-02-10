import { query } from "naystack/graphql";
import { InputType, Field } from "type-graphql";
import { db } from "@/app/api/lib/db";
import { UserTable } from "@/app/api/(graphql)/User/db";
import { eq } from "drizzle-orm";
import { createUserChart } from "./create-user-chart";

@InputType("UpdateUserChartInput")
export class UpdateUserChartInput {
  @Field()
  dateOfBirth: Date;

  @Field()
  lat: number;

  @Field()
  long: number;

  @Field({ nullable: true })
  placeOfBirth?: string;

  @Field({ nullable: true })
  timezoneOffset?: number;
}

export default query(
  async (ctx, input: UpdateUserChartInput) => {
    if (!ctx.userId) {
      throw new Error("Unauthorized");
    }

    const [user] = await db
      .select({ timezoneOffset: UserTable.timezoneOffset })
      .from(UserTable)
      .where(eq(UserTable.id, ctx.userId));

    if (!user) {
      throw new Error("User not found");
    }

    const chartId = await createUserChart({
      lat: input.lat,
      long: input.long,
      dob: input.dateOfBirth,
      timezone: user.timezoneOffset,
    });

    await db
      .update(UserTable)
      .set({ chartId })
      .where(eq(UserTable.id, ctx.userId));

    return chartId;
  },
  {
    mutation: true,
    input: UpdateUserChartInput,
    output: Number,
    authorized: true,
  },
);
