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
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/academy", label: "Academy" },
  { href: "/blog", label: "Blog" },
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
        className={`fixed z-50 flex items-center text-white ${isScrolled
            ? "top-4 sm:top-6 left-1/2 -translate-x-1/2 px-2 sm:px-2 py-2 rounded-full border border-white/50"
            : "top-0 left-0 w-full justify-center sm:justify-start px-6 sm:px-16 py-8 sm:py-12 border border-transparent"
          }`}
        style={{
          backdropFilter: isScrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: isScrolled ? "blur(12px)" : "none",
          boxShadow: isScrolled ? "0 4px 30px rgba(0, 0, 0, 0.15)" : "none",
          backgroundColor: isScrolled
            ? "rgba(255, 255, 255, 0.05)"
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

        {/* Spacer - desktop only, pushes content apart when expanded */}
        <AnimatePresence>
          {!isScrolled && (
            <motion.div
              initial={{ flexGrow: 0, opacity: 0 }}
              animate={{ flexGrow: 1, opacity: 1 }}
              exit={{ flexGrow: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden sm:block flex-1"
            />
          )}
        </AnimatePresence>

        {/* Divider - pill mode, desktop only */}
        <AnimatePresence>
          {isScrolled && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0, width: 0 }}
              animate={{ opacity: 1, scaleY: 1, width: "auto" }}
              exit={{ opacity: 0, scaleY: 0, width: 0 }}
              className="hidden sm:block mx-1"
            >
              <div className="w-px h-6 bg-white/30" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav Links - desktop only */}
        <motion.div
          layout
          className={`hidden sm:flex items-center font-sans text-white ${isScrolled
              ? "gap-1 text-sm"
              : "gap-6 lg:gap-8 text-sm tracking-wide"
            }`}
        >
          {navLinks.map((link) => (
            <Link
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
            </Link>
          ))}
        </motion.div>

        {/* Divider - pill mode, desktop only */}
        <AnimatePresence>
          {isScrolled && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0, width: 0 }}
              animate={{ opacity: 1, scaleY: 1, width: "auto" }}
              exit={{ opacity: 0, scaleY: 0, width: 0 }}
              className="hidden sm:block mx-1"
            >
              <div className="w-px h-6 bg-white/30" />
            </motion.div>
          )}
        </AnimatePresence>

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

        {/* Mobile hamburger - appears next to logo in pill mode */}
        <AnimatePresence>
          {isScrolled && (
            <motion.button
              type="button"
              aria-label="Toggle menu"
              initial={{ opacity: 0, width: 0, scale: 0 }}
              animate={{ opacity: 1, width: "auto", scale: 1 }}
              exit={{ opacity: 0, width: 0, scale: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="sm:hidden p-2 rounded-full hover:bg-white/10 ml-1"
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
            </motion.button>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {isScrolled && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm border border-white/50 p-4 text-white sm:hidden"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "24px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.15)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={token ? "/dashboard" : "/signup"}
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 px-4 py-3 rounded-xl bg-white/10 text-white text-center font-medium hover:bg-white/20 transition-colors"
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
