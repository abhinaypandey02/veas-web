import React from "react";
import { BottomNavbar } from "./components/bottom-navbar";
import getCurrentUser from "../api/(graphql)/User/resolvers/get-current-user";
import { redirect } from "next/navigation";
import { logout, getCurrentRefreshToken } from "naystack/auth";
import { Injector } from "naystack/graphql/server";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex pb-16 flex-col min-h-svh">
      {children}
      <Injector
        fetch={async () => {
          const user = await getCurrentUser.authCall();
          if (!user) {
            const refreshToken = await getCurrentRefreshToken();
            if (refreshToken) {
              await logout();
            }
            redirect("/login");
          }
        }}
        Component={() => null}
      />
      <div className="h-(--vv-bottom-inset)" />
      <BottomNavbar />
    </div>
  );
}
