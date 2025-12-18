import { getGraphQLQuery } from "naystack/graphql/server";

export const query = getGraphQLQuery({
  uri: process.env.NEXT_PUBLIC_BACKEND_BASE_URL!,
});
