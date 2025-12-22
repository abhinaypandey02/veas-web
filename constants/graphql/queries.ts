import { gql } from "@/__generated__";

export const GET_CURRENT_USER = gql(`
  #graphql
  query GetCurrentUser {
    getCurrentUser {
      id
      email
      name
      dateOfBirth
      placeOfBirthLat
      placeOfBirthLong
      timezone
      isOnboarded
    }
  }
`);
