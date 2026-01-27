"use client";
import Link from "next/link";
import Logo from "./logo";
// import { useLogout, useToken } from "naystack/auth/email/client";

export default function Navbar() {
  // Temporarily bypassed auth
  // const token = useToken();
  // const logout = useLogout();
  return (
    <>
      <nav className="fixed top-0 z-50 flex justify-between px-6 sm:px-12 py-6 w-full items-center text-foreground">
        <Logo className="text-3xl sm:text-4xl relative z-10" />
        <div className="flex items-center text-sm gap-6 font-sans tracking-wide">
          <Link 
            href="/login"
            className="hover:text-cosmic-purple transition-colors duration-300"
          >
            Login
          </Link>
          <Link 
            href="/signup"
            className="hover:text-cosmic-purple transition-colors duration-300"
          >
            Start
          </Link>
        </div>
      </nav>
      {/* Spacer removed as nav is fixed overlay */}
    </>
  );
}
