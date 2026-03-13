import { initGraphQLServer } from "naystack/graphql";
import { UserResolvers } from "./User/graphql";
import { ChatResolvers } from "./Chat/graphql";
import { FeedbackResolvers } from "./Feedback/graphql";
import { ALLOWED_ORIGINS } from "@/app/api/lib/cors";

export const { GET, OPTIONS, POST } = await initGraphQLServer({
  resolvers: [UserResolvers, ChatResolvers, FeedbackResolvers],
  allowedOrigins: ALLOWED_ORIGINS,
});
