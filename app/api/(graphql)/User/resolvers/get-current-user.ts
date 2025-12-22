import { query } from "naystack/graphql";
import { db } from "@/app/api/lib/db";
import { UserTable } from "@/app/api/(graphql)/User/db";
import { eq } from "drizzle-orm";
import { User } from "../types";

export default query(
  async (ctx) => {
    if (!ctx.userId) return null;

    const [user] = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.id, ctx.userId));
    return user || null;
  },
  {
    output: User,
  },
);
