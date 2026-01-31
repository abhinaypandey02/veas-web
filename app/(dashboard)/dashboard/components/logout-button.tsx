"use client";

import React from "react";
import { useLogout } from "naystack/auth/email/client";
import Link from "next/link";

export default function LogoutButton() {
  const logout = useLogout();

  return (
    <Link replace href="/">
      <button
        onClick={logout}
        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Log out
      </button>
    </Link>
  );
}
