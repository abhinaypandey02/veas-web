"use client";

import { PaperPlaneRight, Users } from "@phosphor-icons/react";

export default function InviteCard() {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--cosmic-cobalt)] to-[var(--cosmic-purple)] p-6 text-white shadow-lg">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Users size={120} weight="duotone" />
            </div>

            <div className="relative z-10">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                    <PaperPlaneRight size={20} weight="fill" />
                </div>

                <h3 className="font-editorial text-xl font-medium">
                    Invite Friends
                </h3>
                <p className="mt-1 text-sm text-white/70">
                    Earn a 5% discount for every friend who joins.
                </p>

                <div className="mt-4 flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-8 w-8 rounded-full bg-white/20 ring-2 ring-[var(--cosmic-cobalt)]" />
                        ))}
                    </div>
                    <span className="text-xs font-medium text-white/50">+153 joined</span>
                </div>
            </div>
        </div>
    );
}
