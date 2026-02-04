import { QueryLibrary, FieldLibrary } from "naystack/graphql";
import getGetCurrentUser from "./resolvers/get-current-user";
import onboardUser from "./resolvers/onboard-user";
import isOnboarded from "./resolvers/is-onboarded";
import { User } from "./types";

export const UserResolvers = QueryLibrary({
  getCurrentUser: getGetCurrentUser,
  onboardUser,
});

export const UserFieldResolvers = FieldLibrary(User, {
  isOnboarded,
}) as any;
