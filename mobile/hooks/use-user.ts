import { useAuthMutation } from "naystack/graphql/client";
import { UpdateUserInput } from "@/__generated__/graphql";
import { UPDATE_USER } from "@/constants/graphql/mutations";
import { useGlobalState } from "@/contexts/global-context";

export function useUser() {
  const { currentUser, updateCurrentUser } = useGlobalState();
  const [updateUserMutation, { loading }] = useAuthMutation(UPDATE_USER);

  async function updateUser(input: UpdateUserInput) {
    await updateUserMutation(input);
    const nonNullFields = Object.fromEntries(
      Object.entries(input).filter(([, v]) => v != null),
    ) as Partial<Parameters<typeof updateCurrentUser>[0]>;
    updateCurrentUser(nonNullFields);
  }

  return { user: currentUser, updateUser, loading };
}
