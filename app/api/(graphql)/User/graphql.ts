import { QueryLibrary, FieldLibrary } from "naystack/graphql";
import getCurrentUser from "./resolvers/get-current-user";
import onboardUser from "./resolvers/onboard-user";
import isOnboarded from "./resolvers/is-onboarded";
import type { UserDB } from "./db";
import { User } from "./types";

export const UserResolvers = QueryLibrary({
  getCurrentUser,
  onboardUser,
});

export const UserFieldResolvers = FieldLibrary<UserDB>(User, {
  isOnboarded,
});
