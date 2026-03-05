import { gql } from "../../__generated__";

export const GET_SUMMARY = gql(`
  #graphql
  query GetSummary($input: GetSummaryInput!) {
    getSummary(input: $input)
  }
`);

export const GET_CURRENT_USER = gql(`
  query GetCurrentUser {
    getCurrentUser {
      id
      email
      name
      placeOfBirth
      timezoneOffset
      gender
      dateOfBirth
      placeOfBirthLat
      placeOfBirthLong
    }
  }
`);

export const GET_CHATS = gql(`
  query GetChats {
    getChats {
      message
      role
      createdAt
    }
  }
`);
