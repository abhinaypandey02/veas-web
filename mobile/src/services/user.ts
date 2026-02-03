import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { graphqlRequest } from "./graphql";
import { GET_CHATS, GET_CURRENT_USER, ONBOARD_USER } from "./queries";

export type User = {
  id: number;
  email: string;
  name: string | null;
  dateOfBirth: number | null;
  placeOfBirth: string | null;
  placeOfBirthLat: number | null;
  placeOfBirthLong: number | null;
  timezoneOffset: number | null;
  isOnboarded: boolean;
};

export type ChatMessage = {
  message: string;
  role: "assistant" | "user" | "summary";
  createdAt: number;
};

export function useCurrentUser(enabled: boolean) {
  return useQuery({
    queryKey: ["currentUser"],
    enabled,
    queryFn: async () => {
      const data = await graphqlRequest<{ getCurrentUser: User | null }>(
        GET_CURRENT_USER,
      );
      return data.getCurrentUser;
    },
  });
}

export function useChats(enabled: boolean) {
  return useQuery({
    queryKey: ["chats"],
    enabled,
    queryFn: async () => {
      const data = await graphqlRequest<{ getChats: ChatMessage[] }>(GET_CHATS);
      return data.getChats;
    },
  });
}

export function useOnboardUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      name: string;
      dateOfBirth: string;
      placeOfBirth: string;
      placeOfBirthLat: number;
      placeOfBirthLong: number;
      timezoneOffset: number;
    }) => {
      const data = await graphqlRequest<{ onboardUser: boolean }>(ONBOARD_USER, {
        input,
      });
      return data.onboardUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}
