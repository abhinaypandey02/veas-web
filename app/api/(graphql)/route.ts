import { initGraphQLServer } from "naystack/graphql";
import { UserResolvers } from "./User/graphql";
import { ChatResolvers } from "./Chat/graphql";

export const { GET, POST } = await initGraphQLServer({
  resolvers: [UserResolvers, ChatResolvers],
});
