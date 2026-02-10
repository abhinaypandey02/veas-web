import { query } from "naystack/graphql";
import { db } from "@/app/api/lib/db";
import { UserTable, UserChartTable } from "@/app/api/(graphql)/User/db";
import { eq } from "drizzle-orm";
import { User } from "../types";

export default query(
  async (ctx) => {
    if (!ctx.userId) return null;

    const [user] = await db
      .select({
        id: UserTable.id,
        email: UserTable.email,
        name: UserTable.name,
        placeOfBirth: UserTable.placeOfBirth,
        timezoneOffset: UserTable.timezoneOffset,
        dateOfBirth: UserChartTable.dateOfBirth,
        placeOfBirthLat: UserChartTable.placeOfBirthLat,
        placeOfBirthLong: UserChartTable.placeOfBirthLong,
      })
      .from(UserTable)
      .leftJoin(UserChartTable, eq(UserTable.chartId, UserChartTable.id))
      .where(eq(UserTable.id, ctx.userId));
    return user || null;
  },
  {
    output: User,
    outputOptions: {
      nullable: true,
    },
  },
);
