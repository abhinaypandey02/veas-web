"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const navItems = [
    {
        label: "Birth Chart",
        href: "#",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
            </svg>
        ),
    },
    {
        label: "Readings",
        href: "#",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
        ),
    },
    {
        label: "Compatibility",
        href: "#",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
        ),
    },
    {
        label: "Transits",
        href: "#",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20" />
                <path d="M2 12h20" />
                <path d="m4.93 4.93 14.14 14.14" />
                <path d="m19.07 4.93-14.14 14.14" />
            </svg>
        ),
    },
    {
        label: "Academy",
        href: "#",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
        ),
    },
];

export default function LandingSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <motion.aside
            initial={{ width: 300, opacity: 0 }}
            animate={{ width: isCollapsed ? 80 : 300, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full border-r border-foreground/10 py-10 hidden lg:flex flex-col justify-between relative bg-secondary/30 backdrop-blur-sm"
        >
            {/* Collapse Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-10 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-foreground/10 bg-background text-muted hover:text-foreground shadow-sm transition-colors"
            >
                <svg
                    width="10"
                    height="10"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
                >
                    <path
                        d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64023 8.86462 3.84168L5.43521 7.49991L8.86462 11.1581C9.05348 11.3596 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32414 12.0433 8.13528 11.8419L4.38528 7.84188C4.20477 7.64926 4.20477 7.35056 4.38528 7.15794L8.13528 3.15794C8.32414 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {/* Top Content */}
            <div className="px-6 flex flex-col items-center lg:items-stretch overflow-hidden">
                {/* Logo */}
                <div className={`mb-14 transition-all duration-300 ${isCollapsed ? "flex justify-center" : ""}`}>
                    <Link href="/" className="font-editorial italic font-bold text-5xl text-foreground block whitespace-nowrap">
                        {isCollapsed ? "v" : "veas"}
                    </Link>
                </div>

                {/* Navigation Items */}
                <nav className={`flex flex-col ${isCollapsed ? "gap-4" : "gap-3"}`}>
                    {navItems.map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                        >
                            <Link
                                href={item.href}
                                className={`group flex items-center gap-3 rounded-xl transition-all duration-300 ${isCollapsed
                                        ? "justify-center p-2 hover:bg-white/10"
                                        : "px-4 py-3 bg-white/40 border border-white/20 shadow-sm hover:bg-white/60 hover:shadow-md hover:-translate-y-0.5"
                                    }`}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <span className={`text-foreground/80 transition-colors ${isCollapsed ? "" : "bg-white/30 p-1.5 rounded-lg border border-white/10"}`}>
                                    {item.icon}
                                </span>
                                {!isCollapsed && (
                                    <span className="font-medium text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        </motion.div>
                    ))}
                </nav>
            </div>

            {/* Bottom CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="px-6 overflow-hidden"
            >
                <button
                    onClick={() => {
                        document.getElementById('bento-grid')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="block w-full"
                >
                    {isCollapsed ? (
                        <div className="w-10 h-10 rounded-full border border-foreground/20 text-foreground flex items-center justify-center hover:bg-foreground hover:text-white transition-colors mx-auto">
                            ↓
                        </div>
                    ) : (
                        <div className="w-full py-3 px-6 rounded-full border border-foreground/20 text-sm font-medium text-foreground hover:bg-foreground hover:text-white transition-colors uppercase tracking-wider whitespace-nowrap text-center">
                            How it works
                        </div>
                    )}
                </button>
            </motion.div>
        </motion.aside>
    );
}
