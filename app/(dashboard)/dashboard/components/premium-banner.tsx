"use client";

import { Crown } from "@phosphor-icons/react";
import Link from "next/link";

export default function PremiumBanner() {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--cosmic-gold)] to-[#D4AF37] p-6 text-primary shadow-lg ring-1 ring-white/20">
            {/* Abstract shapes/texture overlay */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/20 blur-xl" />
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-20 w-20 rounded-full bg-white/20 blur-xl" />

            <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                    <h3 className="font-editorial text-2xl font-medium tracking-tight text-[#1a1a1a]">
                        Get Premium
                    </h3>
                    <p className="mt-2 text-sm font-medium text-[#1a1a1a]/80 max-w-[80%] text-balance">
                        Unlock unlimited Tarot Readings, ad-free experience, and deeper cosmic insights.
                    </p>
                </div>
                <div className="shrink-0 rounded-full bg-white/20 p-2 backdrop-blur-sm">
                    <Crown size={32} weight="fill" className="text-[#1a1a1a]" />
                </div>
            </div>

            <div className="mt-6">
                <button className="w-full rounded-full bg-[#1a1a1a] px-4 py-3 text-sm font-semibold text-[var(--cosmic-gold)] transition-transform active:scale-95">
                    Upgrade Now
                </button>
            </div>
        </div>
    );
}
