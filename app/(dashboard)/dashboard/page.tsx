"use client";

import Link from "next/link";
import SummaryCards from "./components/summary-cards";
import { useState, useEffect } from "react";

function useGreeting() {
  const [greeting, setGreeting] = useState("Good Evening");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return greeting;
}

function LiveCosmicTime() {
  const [time, setTime] = useState({ h: "00", m: "00", s: "00" });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime({
        h: now.getHours().toString().padStart(2, "0"),
        m: now.getMinutes().toString().padStart(2, "0"),
        s: now.getSeconds().toString().padStart(2, "0"),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-sm sm:text-base tracking-wider text-white tabular-nums">
      {time.h}:{time.m}:
      <span className="text-cosmic-lavender">{time.s}</span>
    </div>
  );
}

function LiveDate() {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const now = new Date();
    setDateStr(
      now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  return (
    <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/60">
      {dateStr}
    </span>
  );
}

export default function Page() {
  const greeting = useGreeting();

  return (
    <main className="grow min-h-0 bg-background">
      {/* ── Hero Header ── */}
      <div className="px-3 pt-3 sm:px-4 sm:pt-4">
        <div
          className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden"
          style={{ backgroundImage: "url('/landingsectionbg1.png')" }}
        >
          {/* Background image */}
          <img
            src="/landingsectionbg1.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          />
          {/* Overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />

          {/* Content */}
          <div className="relative z-10 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            {/* Top row */}
            <div className="flex items-start justify-between mb-6 sm:mb-10">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 mb-3 sm:mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-cosmic-lavender animate-pulse" />
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white/80">
                    Cosmic cycle active
                  </span>
                </span>
                <h1 className="font-editorial font-medium text-2xl sm:text-3xl lg:text-4xl text-white tracking-[-0.03em] leading-[1.15]">
                  {greeting},{" "}
                  <span className="italic text-cosmic-lavender">Explorer</span>
                </h1>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-white/60 max-w-xs sm:max-w-sm leading-relaxed">
                  Your celestial guide awaits. Explore your cosmic blueprint.
                </p>
              </div>

              {/* Right side — date & time */}
              <div className="hidden sm:flex flex-col items-end gap-1">
                <LiveDate />
                <LiveCosmicTime />
              </div>
            </div>

            {/* AI Chat CTA — featured card inside the hero */}
            <Link href="/chat" className="group block">
              <div className="relative rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4 sm:p-5 transition-all duration-500 hover:bg-white/15 hover:border-white/25 overflow-hidden">
                {/* Subtle glow */}
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-cosmic-lavender/15 blur-2xl group-hover:bg-cosmic-lavender/25 transition-all duration-700 pointer-events-none" />

                <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 group-hover:scale-105 transition-all duration-500">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-white"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      <circle cx="9" cy="10" r="1" fill="currentColor" />
                      <circle cx="12" cy="10" r="1" fill="currentColor" />
                      <circle cx="15" cy="10" r="1" fill="currentColor" />
                    </svg>
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm sm:text-base font-medium text-white leading-tight">
                      Chat with AI Astrologer
                    </h2>
                    <p className="text-[11px] sm:text-xs text-white/50 mt-0.5 leading-snug truncate">
                      Ask about your charts, transits & cosmic insights
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-all duration-300">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-white transition-transform duration-300 group-hover:translate-x-0.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="px-3 sm:px-4 lg:px-6 pb-6">
        <div className="mx-auto max-w-7xl">
          {/* Section Label */}
          <div className="flex items-center gap-3 mt-6 sm:mt-8 mb-4 sm:mb-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cosmic-purple/20 bg-white/70 backdrop-blur-sm">
              <span className="text-cosmic-purple text-xs">✧</span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-muted font-medium">
                Your Insights
              </span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-cosmic-lavender/40 to-transparent" />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <SummaryCards />
          </div>

          {/* Bottom cosmic accent */}
          <div className="flex justify-center mt-8 sm:mt-10 mb-2">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-cosmic-lavender/40" />
              <span className="text-cosmic-purple/30 text-sm">✧</span>
              <span className="font-editorial italic text-xs sm:text-sm text-muted/50">
                aligned with the real sky
              </span>
              <span className="text-cosmic-purple/30 text-sm">✧</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-cosmic-lavender/40" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
