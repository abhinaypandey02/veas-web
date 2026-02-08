import { QueryLibrary } from "naystack/graphql";
import getCurrentUser from "./resolvers/get-current-user";
import onboardUser from "./resolvers/onboard-user";

export const UserResolvers = QueryLibrary({
  getCurrentUser,
  onboardUser,
});
