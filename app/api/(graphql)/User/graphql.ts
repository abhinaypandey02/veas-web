import { QueryLibrary } from "naystack/graphql";
import getCurrentUser from "./resolvers/get-current-user";
import onboardUser from "./resolvers/onboard-user";
import getSummary from "./resolvers/get-summary";
import getPlanets from "./resolvers/get-planets";
import updateUser from "./resolvers/update-user";
import updateUserChart from "./resolvers/update-user-chart";

export const UserResolvers = QueryLibrary({
  getCurrentUser,
  onboardUser,
  getSummary,
  getPlanets,
  updateUser,
  updateUserChart,
});
