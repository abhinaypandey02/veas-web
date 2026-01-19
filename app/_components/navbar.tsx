"use client";
import Link from "next/link";
import Logo from "./logo";
import { useLogout, useToken } from "naystack/auth/email/client";

export default function Navbar() {
  const token = useToken();
  const logout = useLogout();
  return (
    <>
      <nav className="fixed top-0 z-50 flex justify-between px-4 sm:px-10 py-2 sm:py-4 w-full items-center">
        <Logo className="text-3xl sm:text-4xl" />
        <div className="flex items-center text-sm gap-4">
          {token ? (
            <>
              <button onClick={() => logout()}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">Register</Link>
            </>
          )}
        </div>
      </nav>
      <div className="h-12" />
    </>
  );
}
