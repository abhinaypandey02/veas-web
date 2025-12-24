"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useLogout } from "@/app/(auth)/utils";

export default function LogoutButton() {
  const logout = useLogout();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoggingOut ? "Logging out..." : "Log out"}
    </button>
  );
}

