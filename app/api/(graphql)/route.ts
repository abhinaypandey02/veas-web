import { Context, initGraphQLServer } from "naystack/graphql";

import { NextRequest } from "next/server";
import { UserResolvers, UserFieldResolvers } from "./User/graphql";
import { ChatResolvers } from "./Chat/graphql";
import { getUserIdFromRequest } from "@/app/api/(auth)/email";

export const getContext = async (req: NextRequest) => {
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
};

export const { GET, POST } = await initGraphQLServer({
  authChecker: async ({ context }: { context: Context }) => !!context.userId,
  context: getContext,
  resolvers: [UserResolvers, UserFieldResolvers, ChatResolvers],
});
