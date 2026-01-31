import React from "react";
import { BottomNavbar } from "./components/bottom-navbar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex pb-16 flex-col h-svh">
      {children}
      <BottomNavbar />
    </div>
  );
}
