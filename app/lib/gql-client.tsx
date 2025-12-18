"use client";
import { getApolloWrapper } from "naystack/graphql/client";

export const ApolloWrapper = getApolloWrapper({
  graphqlUri: "/api",
  authEndpoint: "/api/email/",
});
