"use client";
import Link from "next/link";
import Logo from "./logo";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/academy", label: "Academy" },
  { href: "/blog", label: "Blog" },
];

function NavLinkWhite({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="relative group py-2">
      <span className="relative z-10 font-medium text-white transition-colors duration-300 group-hover:text-white/80">
        {label}
      </span>
      {/* Animated underline */}
      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 ease-out group-hover:w-full" />
    </Link>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger transformation when scrolled past 100px
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Initial navbar - visible when not scrolled */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 z-50 flex justify-between px-8 sm:px-16 py-12 sm:py-14 w-full items-center"
          >
            <Link href="/" className="font-serif italic text-5xl sm:text-5xl text-white font-medium relative z-10 drop-shadow-sm">
              veas
            </Link>
            <div className="flex items-center text-sm gap-8 font-sans tracking-wide">
              {navLinks.map((link) => (
                <NavLinkWhite key={link.href} {...link} />
              ))}
              <Link
                href="/signup"
                className="ml-2 px-6 py-2.5 rounded-full bg-white text-foreground text-sm font-semibold hover:bg-white/90 transition-colors duration-300 shadow-md"
              >
                Get Started
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Floating pill navbar - visible when scrolled */}
      <AnimatePresence>
        {isScrolled && (
          <motion.nav
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/5"
          >
            {/* Logo */}

            <Link href="/" className="px-3 py-1.5 rounded-full hover:bg-foreground/5 transition-colors">
              <span className="font-serif italic text-4xl text-foreground">veas</span>
            </Link>

            {/* Divider */}
            <div className="w-px h-6 bg-foreground/10" />

            {/* Nav Links */}
            <div className="flex items-center gap-1 text-sm font-sans text-foreground/70">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 rounded-full hover:bg-foreground/5 hover:text-foreground transition-all duration-300 group"
                >
                  <span>{link.label}</span>
                  {/* Dot indicator on hover */}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-foreground scale-0 group-hover:scale-100 transition-transform duration-300" />
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-foreground/10" />

            {/* CTA Button */}
            <Link
              href="/signup"
              className="px-5 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:bg-cosmic-cobalt transition-colors duration-300"
            >
              Get Started
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
