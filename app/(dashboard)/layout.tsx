import React from "react";
import { BottomNavbar } from "./components/bottom-navbar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex pb-[calc(env(safe-area-inset-bottom)+64px)] flex-col min-h-svh">
      {children}
      <BottomNavbar />
    </div>
  );
}
