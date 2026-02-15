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
        <div className="w-full pt-8 pb-4 relative px-1">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-editorial text-4xl font-normal text-[#1a1a1a]">
                        Welcome, {firstName}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    {/* Hidden for now to match clean look, or kept subtle? User said "match the layout". Image has profile icon top right? No, image is cut off at top. I will keep the crown/bell for functionality but maybe make them minimal. Actually, let's keep them top right. */}
                    <button
                        onClick={onPremiumClick}
                        className="p-2 text-[#1a1a1a]/80 hover:bg-black/5 rounded-full transition-colors"
                    >
                        <Crown size={24} weight="light" />
                    </button>
                </div>
            </div>
        </div>
    );
}
