import { query } from "naystack/graphql";
import { db } from "@/app/api/lib/db";
import { eq, ne, and } from "drizzle-orm";
import { Chat } from "../types";
import { ChatRole, ChatTable } from "../db";

export default query(
  async (ctx) => {
    return db
      .select()
      .from(ChatTable)
      .where(
        and(
          eq(ChatTable.userId, ctx.userId),
          ne(ChatTable.role, ChatRole.summary),
        ),
      )
      .orderBy(ChatTable.id);
  },
  {
    output: [Chat],
    authorized: true,
  },
);
