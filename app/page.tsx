"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#FDFBF7] text-slate-900 overflow-hidden font-sans selection:bg-black selection:text-white"
    >
      {/* --- Dynamic Living Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-indigo-100/40 to-purple-100/40 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -15, 15, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-amber-100/30 to-rose-100/30 blur-[100px]"
        />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-50 mix-blend-multiply" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-20 pt-8 sm:px-12 sm:pt-12">
        {/* Navigation */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-between pb-6"
        >
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-slate-900/10 shadow-sm">
              <Image
                src="/logo.jpeg"
                alt="Veas Logo"
                fill
                className="object-cover grayscale"
              />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-slate-900">
              Veas
            </span>
          </div>
          <nav className="hidden md:flex gap-8 text-xs font-mono font-medium uppercase tracking-widest text-slate-500">
            {["The Shift", "The Method", "The Truth"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-slate-900 transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-slate-900 transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>
        </motion.header>

        {/* Hero Content */}
        <section className="mt-12 lg:mt-24 grid grid-cols-1 gap-16 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col justify-center space-y-10"
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-slate-500">
                Live Sky Alignment: Off by ~24°
              </span>
            </div>

            <h1 className="font-serif text-6xl font-medium leading-[0.9] tracking-tight text-slate-900 sm:text-8xl lg:text-[6.5rem]">
              You’ve been reading the <br />
              <span className="italic relative inline-block text-slate-400">
                wrong map.
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                  viewBox="0 0 300 12"
                  className="absolute -bottom-2 left-0 w-full text-rose-400 overflow-visible"
                  fill="none"
                >
                  <motion.path
                    d="M2 10 Q 150 2 298 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </span>
            </h1>

            <p className="max-w-xl font-serif text-xl leading-relaxed text-slate-600">
              The stars have moved since Western astrology was invented 2,000
              years ago. Veas uses the <strong>actual sky</strong> to reveal who
              you <span className="italic">really</span> are.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Link href="/signup">
                <button className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-slate-900 px-10 font-medium text-white transition-all hover:scale-105 hover:shadow-xl hover:shadow-slate-900/10">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="relative font-mono text-xs uppercase tracking-widest">
                    Realign My Chart
                  </span>
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Dynamic "Receipt" / Abstract Visual */}
          <motion.div
            style={{ y }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="lg:col-span-5 relative hidden lg:block"
          >
            <div className="relative z-10 w-full aspect-[3/4] rounded-t-[10rem] rounded-b-[2rem] border border-white/50 bg-white/40 backdrop-blur-md shadow-2xl shadow-slate-200/50 p-8 flex flex-col justify-between overflow-hidden">
              {/* Floating Elements inside the card */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white/10 to-white/60 pointer-events-none" />

              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-end border-b border-slate-900/10 pb-4">
                  <span className="font-mono text-[10px] uppercase text-slate-400">
                    Current Position
                  </span>
                  <span className="font-serif text-3xl text-slate-900 italic">
                    23° 04'
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      label: "Your Known Sun",
                      val: "Leo ♌",
                      status: "Illusion",
                      color: "text-slate-400 line-through",
                    },
                    {
                      label: "Actual Sky Sun",
                      val: "Cancer ♋",
                      status: "Truth",
                      color: "text-indigo-600 font-semibold",
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/60 shadow-sm border border-white"
                    >
                      <span className="text-xs font-mono uppercase text-slate-500">
                        {row.label}
                      </span>
                      <span className={`font-serif text-lg ${row.color}`}>
                        {row.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10">
                <p className="font-serif text-sm text-slate-600 italic text-center">
                  "I always felt too sensitive for a Leo. Now I know why."
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
