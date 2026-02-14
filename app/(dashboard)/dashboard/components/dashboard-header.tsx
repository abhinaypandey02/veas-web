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
        <div className="w-full max-w-sm pt-8 pb-4 mx-auto">
            <div className="w-full flex items-center justify-between bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/20">
                <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-violet-100 shadow-sm shrink-0">
                        <Image
                            src="/icon1.png" // Fallback
                            alt="User"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="font-editorial text-lg font-normal text-[#1a1a1a]">
                            Hi, <span className="font-medium text-violet-600">{firstName}</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onPremiumClick}
                        className="relative rounded-full bg-gradient-to-r from-amber-100/50 to-amber-100/30 p-1.5 text-amber-600 transition-colors hover:bg-amber-100/80 border border-amber-200/50"
                    >
                        <Crown size={20} weight="fill" />
                    </button>
                    <button className="relative rounded-full bg-white p-1.5 text-[#1a1a1a] transition-colors hover:bg-gray-50 border border-black/5 shadow-sm">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-1 ring-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}
