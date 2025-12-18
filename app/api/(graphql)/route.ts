import { initGraphQLServer } from "naystack/graphql";
import { NextRequest } from "next/server";
import UserResolvers from "./User/graphql";
import { getUserIdFromRequest } from "@/app/api/(auth)/email";

export const { GET, POST } = await initGraphQLServer({
  context: async (req: NextRequest) => {
    const res = getUserIdFromRequest(req);
    if (!res) return { userId: null };
    if (res.refreshUserID) {
      const isMobile = req.headers.get("x-platform-is-mobile");
      if (isMobile) return { userId: null };
      return { userId: res.refreshUserID, onlyQuery: true };
    }
    if (res.accessUserId) {
      return { userId: res.accessUserId };
    }
  },
  resolvers: [UserResolvers],
});
