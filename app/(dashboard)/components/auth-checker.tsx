"use client";

import getCurrentUser from "@/app/api/(graphql)/User/resolvers/get-current-user";
import { QueryResponseType } from "naystack/graphql";
import { useLogout, useToken } from "naystack/auth/email/client";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AuthChecker({
  data,
}: {
  data: QueryResponseType<typeof getCurrentUser>;
}) {
  const logout = useLogout();
  const token = useToken();
  const router = useRouter();
  useEffect(() => {
    if (data === null) {
      if (token) logout();
      router.replace("/login");
    }
  }, [data, logout, router, token]);
  return null;
}
