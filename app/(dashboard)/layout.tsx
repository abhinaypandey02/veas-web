import React from "react";
import { BottomNavbar } from "./components/bottom-navbar";
import getCurrentUser from "../api/(graphql)/User/resolvers/get-current-user";
import { redirect } from "next/navigation";
import { logout, getCurrentRefreshToken } from "naystack/auth";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser.authCall();
  if (!user) {
    const refreshToken = await getCurrentRefreshToken();
    if (refreshToken) {
      await logout();
    }
    redirect("/login");
  }
  return (
    <div className="flex pb-16 flex-col min-h-svh">
      {children}
      <div className="h-(--vv-bottom-inset)" />
      <BottomNavbar />
    </div>
  );
}
