import { initGraphQLServer } from "naystack/graphql";
import { UserResolvers } from "./User/graphql";
import { ChatResolvers } from "./Chat/graphql";
import { FeedbackResolvers } from "./Feedback/graphql";

export const { GET, POST } = await initGraphQLServer({
  resolvers: [UserResolvers, ChatResolvers, FeedbackResolvers],
});
