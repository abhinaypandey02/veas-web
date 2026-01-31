import { getRefreshToken } from "naystack/auth";
import { redirect } from "next/navigation";
import React from "react";
import { BottomNavbar } from "./components/bottom-navbar";

export default function layout({ children }: { children: React.ReactNode }) {
  const token = getRefreshToken();
  if (!token) {
    redirect("/login");
  }
  return (
    <div className="flex flex-col h-screen">
      {children}
      <BottomNavbar />
    </div>
  );
}
