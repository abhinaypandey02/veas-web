import { gql } from "../__generated__";

export const ONBOARD_USER = gql(`
  #graphql
  mutation OnboardUser($input: OnboardUserInput!) {
    onboardUser(input: $input)
  }
`);

export const UPDATE_USER = gql(`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input)
  }
`);

export const UPDATE_USER_CHART = gql(`
  mutation UpdateUserChart($input: UpdateUserChartInput!) {
    updateUserChart(input: $input)
  }
`);

export const SUBMIT_FEEDBACK = gql(`
  mutation SubmitFeedback($input: SubmitFeedbackInput!) {
    submitFeedback(input: $input)
  }
`);
