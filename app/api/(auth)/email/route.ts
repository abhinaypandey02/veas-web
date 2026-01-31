import { getEmailAuthRoutes } from "naystack/auth";
import { db } from "@/app/api/lib/db";
import { UserTable } from "@/app/api/(graphql)/User/db";
import { eq } from "drizzle-orm";

export const { GET, POST, PUT, DELETE } = getEmailAuthRoutes({
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
});
