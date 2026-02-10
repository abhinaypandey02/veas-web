import { gql } from "@/__generated__";
import gqlTag from "graphql-tag";

export const GET_SUMMARY = gql(`
  #graphql
  query GetSummary($input: GetSummaryInput!) {
    getSummary(input: $input)
  }
`);

export const GET_CURRENT_USER = gqlTag`
  query GetCurrentUser {
    getCurrentUser {
      id
      email
      name
      placeOfBirth
      timezoneOffset
      dateOfBirth
      placeOfBirthLat
      placeOfBirthLong
    }
  }
`;
