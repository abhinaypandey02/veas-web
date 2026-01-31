"use client";

import { cn } from "@/components/utils";
import { House, User, MagicWandIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Home", icon: House },
  { href: "/chat", label: "Chat", icon: MagicWandIcon },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full fixed bottom-0 z-50 shadow-md bg-surface pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-sm items-center justify-around px-2 py-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 rounded-lg px-4 py-1.5 transition-colors ${
                isActive ? "text-primary" : "text-muted hover:text-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={24} weight={isActive ? "fill" : "regular"} />
              <span
                className={cn(
                  "text-xs font-medium ",
                  isActive ? "text-primary" : "text-muted",
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
