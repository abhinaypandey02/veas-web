import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useToken } from "naystack/auth/email/client";
import { useAuthQuery } from "naystack/graphql/client";
import { GetCurrentUserQuery } from "@veas/gql/types";
import { GET_CURRENT_USER } from "@veas/gql";
import {
  configureRevenueCat,
  identifyRevenueCatUser,
  resetRevenueCatUser,
} from "@/services/revenuecat";

type CurrentUser = NonNullable<GetCurrentUserQuery["getCurrentUser"]>;

interface GlobalState {
  currentUser: CurrentUser | null;
  updateCurrentUser: (fields: Partial<CurrentUser>) => void;
}

const GlobalContext = createContext<GlobalState>({
  currentUser: null,
  updateCurrentUser: () => {},
});

export function useGlobalState() {
  return useContext(GlobalContext);
}

export function GlobalStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useToken();
  const [getUser] = useAuthQuery(GET_CURRENT_USER);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const updateCurrentUser = useCallback((fields: Partial<CurrentUser>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...fields } : prev));
  }, []);

  useEffect(() => {
    configureRevenueCat();
  }, []);

  useEffect(() => {
    if (token) {
      getUser().then((result) => {
        const user = result?.data?.getCurrentUser;
        if (user) {
          setCurrentUser(user);
          identifyRevenueCatUser(user.id.toString());
        }
      });
    } else if (token === null) {
      setCurrentUser(null);
      resetRevenueCatUser();
    }
  }, [token]);

  return (
    <GlobalContext.Provider value={{ currentUser, updateCurrentUser }}>
      {children}
    </GlobalContext.Provider>
  );
}
