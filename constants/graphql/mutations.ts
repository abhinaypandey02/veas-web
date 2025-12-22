import { gql } from "@/__generated__";

export const ONBOARD_USER = gql(`
  #graphql
  mutation OnboardUser($input: OnboardUserInput!) {
    onboardUser(input: $input)
  }
`);
