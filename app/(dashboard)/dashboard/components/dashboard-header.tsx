"use client";

import { Bell, Sparkle, Crown } from "@phosphor-icons/react";
import Image from "next/image";

interface DashboardHeaderProps {
    onPremiumClick?: () => void;
    userName?: string;
}

export default function DashboardHeader({ onPremiumClick, userName = "User" }: DashboardHeaderProps) {
    const firstName = userName.split(" ")[0];

    return (
        <div className="w-full pt-8 pb-2 relative px-1">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="font-editorial text-4xl font-normal text-[#1a1a1a]">
                        Welcome, {firstName}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onPremiumClick}
                        className="p-2 text-[#1a1a1a]/80 hover:bg-black/5 rounded-full transition-colors"
                    >
                        <Crown size={24} weight="light" />
                    </button>
                </div>
            </div>
            {/* Elegant Separator */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </div>
    );
}
