import { QueryLibrary } from "naystack/graphql";
import getUser from "./resolvers/get-user";

export default QueryLibrary({
  getUser,
});
