"use client";
import Link from "next/link";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useToken } from "naystack/auth/email/client";

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
];

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = useToken();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100 && !isScrolled) {
      setIsScrolled(true);
    } else if (latest <= 50 && isScrolled) {
      setIsScrolled(false);
      setIsMenuOpen(false);
    }
  });

  return (
    <>
      {/* Navbar */}
      <motion.nav
        layout
        transition={{ type: "spring", stiffness: 200, damping: 28, mass: 0.8 }}
        className={`fixed z-50 flex items-center text-white top-0 left-0 w-full ${isScrolled
          ? "px-6 sm:px-16 py-3 sm:py-4"
          : "justify-center sm:justify-start px-6 sm:px-16 py-8 sm:py-12"
          }`}
        style={{
          backdropFilter: isScrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: isScrolled ? "blur(16px)" : "none",
          boxShadow: isScrolled ? "0 1px 0 rgba(255, 255, 255, 0.1)" : "none",
          backgroundColor: isScrolled
            ? "rgba(19, 11, 37, 0.9)"
            : "transparent",
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Logo */}
        <motion.div layout="position" className="relative z-10">
          <Link
            href="/"
            className={`font-serif italic text-white font-medium drop-shadow-sm block ${isScrolled
              ? "text-xl sm:text-3xl px-2 sm:px-3 py-1"
              : "text-3xl sm:text-5xl"
              }`}
          >
            veas
          </Link>
        </motion.div>

        {/* Spacer - desktop only, pushes content apart */}
        <div className="hidden sm:block flex-1" />

        {/* Nav Links - desktop only */}
        <motion.div
          layout
          className={`hidden sm:flex items-center font-sans text-white ${isScrolled
            ? "gap-1 text-sm"
            : "gap-6 lg:gap-8 text-sm tracking-wide"
            }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative group transition-colors duration-300 ${isScrolled
                ? "px-3 lg:px-4 py-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
                : "py-2"
                }`}
            >
              <span className="relative z-10 font-medium group-hover:text-white/80 transition-colors">
                {link.label}
              </span>
              {!isScrolled && (
                <span className="absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-300 w-0 group-hover:w-full" />
              )}
              {isScrolled && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cosmic-lavender transition-all duration-300 scale-0 group-hover:scale-100" />
              )}
            </a>
          ))}
        </motion.div>

        {/* CTA Button - desktop only */}
        <motion.div layout className={`hidden sm:block ${isScrolled ? "" : "ml-2"}`}>
          <Link
            href={token ? "/dashboard" : "/signup"}
            className={`inline-flex font-semibold transition-all duration-300 whitespace-nowrap ${isScrolled
              ? "px-4 lg:px-5 py-2 rounded-full bg-white/10 text-white text-sm hover:bg-white/20"
              : "px-6 py-2.5 rounded-full border border-white/40 text-white text-sm hover:bg-white/10"
              }`}
          >
            {token ? "Dashboard" : "Get Started"}
          </Link>
        </motion.div>

        {/* Mobile hamburger */}
        <div className="sm:hidden flex-1" />
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="sm:hidden p-2 rounded-full hover:bg-white/10"
        >
          <svg
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </>
            )}
          </svg>
        </button>
      </motion.nav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-0 left-0 right-0 z-40 pt-20 pb-6 px-6 text-white sm:hidden"
            style={{
              background: "rgba(19, 11, 37, 0.97)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href={token ? "/dashboard" : "/signup"}
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 px-4 py-3 rounded-xl bg-white/15 text-white text-center font-medium hover:bg-white/25 transition-colors"
              >
                {token ? "Dashboard" : "Get Started"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
