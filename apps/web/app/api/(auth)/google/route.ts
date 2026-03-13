import { initGoogleAuth } from "naystack/auth";
import { db } from "@/app/api/lib/db";
import { UserTable } from "@/app/api/(graphql)/User/db";
import { eq } from "drizzle-orm";

export const { GET } = initGoogleAuth({
  redirectURL: process.env.NEXT_PUBLIC_BASE_URL + "/dashboard",
  errorRedirectURL: process.env.NEXT_PUBLIC_BASE_URL + "/signup",
  getUserIdFromEmail: async ({ email, name }, data) => {
    if (!email) return null;

    const [existingUser] = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email));

    if (existingUser) {
      return existingUser.id;
    } else if (name && email) {
      if (!data) return null;
      const onboardingData = JSON.parse(data);

      const [newUser] = await db
        .insert(UserTable)
        .values({
          email,
          name,
          ...onboardingData,
        })
        .returning({
          id: UserTable.id,
        });
      if (newUser) {
        return newUser.id;
      }
    }
    return null;
  },
});
