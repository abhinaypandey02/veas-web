import React from "react";
import { BottomNavbar } from "./components/bottom-navbar";
import getCurrentUser from "../api/(graphql)/User/resolvers/get-current-user";
import { Injector } from "naystack/graphql/server";
import AuthChecker from "./components/auth-checker";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex pb-16 flex-col min-h-svh">
      {children}
      <Injector fetch={getCurrentUser.authCall} Component={AuthChecker} />
      <div className="h-(--vv-bottom-inset)" />
      <BottomNavbar />
    </div>
  );
}
