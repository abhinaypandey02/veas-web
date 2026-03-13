import { QueryLibrary } from "naystack/graphql";
import getChats from "./resolvers/get-chats";

export const ChatResolvers = QueryLibrary({
  getChats,
});
