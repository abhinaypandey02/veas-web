import { gql } from "@/__generated__";
import gqlTag from "graphql-tag";

export const ONBOARD_USER = gql(`
  #graphql
  mutation OnboardUser($input: OnboardUserInput!) {
    onboardUser(input: $input)
  }
`);

export const UPDATE_USER = gqlTag`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      name
      email
      placeOfBirth
      timezoneOffset
    }
  }
`;

export const UPDATE_USER_CHART = gqlTag`
  mutation UpdateUserChart($input: UpdateUserChartInput!) {
    updateUserChart(input: $input)
  }
`;
