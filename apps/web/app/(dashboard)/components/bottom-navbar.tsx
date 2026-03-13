"use client";

import { cn } from "@/components/utils";
import { House, User, MagicWandIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { href: "/dashboard", label: "Home", icon: House },
  { href: "/chat", label: "Chat", icon: MagicWandIcon },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNavbar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 px-4 w-full max-w-sm">
      <nav className="relative flex items-center justify-between rounded-full border border-white/20 bg-black/80 p-2 shadow-2xl backdrop-blur-xl">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative z-10 flex flex-1 flex-col items-center justify-center gap-1 px-2 py-2 transition-colors duration-200",
                isActive ? "text-white" : "text-white/50 hover:text-white/80"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-white/20"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center gap-0.5">
                <Icon size={24} weight={isActive ? "fill" : "regular"} />
                <span className="text-[10px] font-medium">{label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
