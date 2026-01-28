"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/academy", label: "Academy" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <>
      {/* Single morphing navbar */}
      <nav
        className={`fixed z-50 flex items-center text-white transition-all duration-500 ease-out ${
          isScrolled
            ? "top-6 left-1/2 -translate-x-1/2 px-3 py-2 rounded-full border border-white/50"
            : "top-0 left-0 w-full px-8 sm:px-16 py-10 sm:py-12 border border-transparent"
        }`}
        style={{
          backdropFilter: isScrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: isScrolled ? "blur(12px)" : "none",
          boxShadow: isScrolled ? "0 4px 30px rgba(0, 0, 0, 0.15)" : "none",
          backgroundColor: isScrolled
            ? "rgba(255, 255, 255, 0.05)"
            : "transparent",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className={`font-serif italic text-white font-medium relative z-10 drop-shadow-sm transition-all duration-500 ${
            isScrolled
              ? "text-2xl sm:text-3xl px-2 py-1"
              : "text-4xl sm:text-5xl"
          }`}
        >
          veas
        </Link>

        {/* Spacer - pushes content apart when expanded */}
        <div
          className={`transition-all duration-500 ${isScrolled ? "w-0" : "flex-1"}`}
        />

        {/* Divider - only in pill mode */}
        <div
          className={`hidden sm:block w-px h-6 bg-white/30 mx-2 transition-all duration-300 ${
            isScrolled ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
          }`}
        />

        {/* Nav Links */}
        <div
          className={`hidden sm:flex items-center font-sans text-white transition-all duration-500 ${
            isScrolled
              ? "gap-1 text-sm"
              : "gap-6 lg:gap-8 text-sm tracking-wide"
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative group transition-all duration-300 ${
                isScrolled
                  ? "px-3 lg:px-4 py-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
                  : "py-2"
              }`}
            >
              <span className="relative z-10 font-medium transition-colors duration-300 group-hover:text-white/80">
                {link.label}
              </span>
              {/* Animated underline - only in expanded mode */}
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-300 ease-out ${
                  isScrolled
                    ? "w-0 opacity-0"
                    : "w-0 group-hover:w-full opacity-100"
                }`}
              />
              {/* Dot indicator - only in pill mode */}
              <span
                className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cosmic-lavender transition-all duration-300 ${
                  isScrolled ? "scale-0 group-hover:scale-100" : "scale-0"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Divider - only in pill mode */}
        <div
          className={`hidden sm:block w-px h-6 bg-white/30 mx-2 transition-all duration-300 ${
            isScrolled ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
          }`}
        />

        {/* CTA Button */}
        <div
          className={`hidden sm:block transition-all duration-500 ${isScrolled ? "" : "ml-2"}`}
        >
          <Link
            href="/signup"
            className={`inline-flex font-semibold transition-all duration-300 ${
              isScrolled
                ? "px-4 lg:px-5 py-2 rounded-full bg-white/10 text-white text-sm hover:bg-white/20"
                : "px-6 py-2.5 rounded-full border border-white/40 text-white text-sm hover:bg-white/10"
            }`}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu button - only in pill mode */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className={`sm:hidden p-2 rounded-full hover:bg-white/10 transition-all duration-300 ${
            isScrolled
              ? "opacity-100 scale-100 ml-1"
              : "opacity-0 scale-0 w-0 overflow-hidden"
          }`}
        >
          <svg
            className="w-6 h-6 text-white"
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
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu for floating nav */}
      <AnimatePresence>
        {isScrolled && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm border border-white/50 p-4 text-white sm:hidden"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "24px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.15)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div className="flex flex-col gap-2">
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
                href="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 px-4 py-3 rounded-xl bg-white/10 text-white text-center font-medium hover:bg-white/20 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
