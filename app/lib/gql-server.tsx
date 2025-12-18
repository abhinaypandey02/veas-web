import { getGraphQLQuery } from "naystack/graphql/server";

export const query = getGraphQLQuery({ uri: "http://localhost:3000/api" });
