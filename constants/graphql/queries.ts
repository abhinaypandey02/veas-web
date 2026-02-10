import { gql } from "@/__generated__";

export const GET_SUMMARY = gql(`
  #graphql
  query GetSummary($input: GetSummaryInput!) {
    getSummary(input: $input)
  }
`);
