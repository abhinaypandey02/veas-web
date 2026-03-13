import { getEmailAuthRoutes } from "naystack/auth";
import { db } from "@/app/api/lib/db";
import { UserTable } from "@/app/api/(graphql)/User/db";
import { eq } from "drizzle-orm";
import { ALLOWED_ORIGINS } from "@/app/api/lib/cors";

export const { GET, POST, PUT, DELETE, OPTIONS } = getEmailAuthRoutes({
  createUser: async (data) => {
    const [user] = await db.insert(UserTable).values(data).returning();
    return user;
  },
  getUser: async ({ email }) => {
    const [user] = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email));
    return user;
  },
  allowedOrigins: ALLOWED_ORIGINS,
});
