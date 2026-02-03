export const GET_CURRENT_USER = `
  query GetCurrentUser {
    getCurrentUser {
      id
      email
      name
      dateOfBirth
      placeOfBirth
      placeOfBirthLat
      placeOfBirthLong
      timezoneOffset
      isOnboarded
    }
  }
`;

export const GET_CHATS = `
  query GetChats {
    getChats {
      message
      role
      createdAt
    }
  }
`;

export const ONBOARD_USER = `
  mutation OnboardUser($input: OnboardUserInput!) {
    onboardUser(input: $input)
  }
`;
