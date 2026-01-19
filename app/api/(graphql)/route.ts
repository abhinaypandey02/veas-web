import { initGraphQLServer } from "naystack/graphql";
import { UserResolvers, UserFieldResolvers } from "./User/graphql";
import { ChatResolvers } from "./Chat/graphql";

export const { GET, POST } = await initGraphQLServer({
  resolvers: [UserResolvers, UserFieldResolvers, ChatResolvers],
});
