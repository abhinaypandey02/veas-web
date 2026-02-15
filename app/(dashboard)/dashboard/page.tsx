"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import SummaryCards from "./components/summary-cards";
import DashboardHeader from "./components/dashboard-header";
import PremiumBanner from "./components/premium-banner";
import { CosmicGraphic } from "@/components/CosmicGraphic"; // Note: CosmicGraphic might need adjustment for light mode visibility
import { X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useAuthQuery } from "naystack/graphql/client";
import { GET_CURRENT_USER } from "@/constants/graphql/queries";

interface GetCurrentUserResponse {
  getCurrentUser: {
    name: string;
  } | null;
}

export default function Page() {
  const [showPremium, setShowPremium] = useState(false);
  const [getUser, { data: userData }] = useAuthQuery<GetCurrentUserResponse, {}>(GET_CURRENT_USER);
  const userName = userData?.getCurrentUser?.name || "User";

  // Fetch user data on mount
  useEffect(() => {
    getUser({});
  }, [getUser]);

  return (
    <main className="relative grow min-h-svh w-full overflow-y-auto bg-white text-[#1a1a1a]">
      {/* CosmicGraphic might be hard to see on light bg, maybe hide or adjust opacity/blend mode */}
      <div className="opacity-30 mix-blend-multiply pointer-events-none absolute inset-0">
        <CosmicGraphic />
      </div>

      {/* Premium Modal */}
      <AnimatePresence>
        {showPremium && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md"
            >
              <button
                onClick={() => setShowPremium(false)}
                className="absolute -top-12 right-0 rounded-full bg-white/10 p-2 text-white"
              >
                <X size={20} />
              </button>
              <PremiumBanner />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-md md:max-w-4xl px-4 md:px-8">
        <DashboardHeader
          onPremiumClick={() => setShowPremium(true)}
          userName={userName}
        />

        <div className="flex flex-col gap-3 pb-32 md:pb-24">
          <div>
            <SummaryCards />
          </div>

          <div className="pt-2 shrink-0">
            <Link href="/chat" className="block w-full">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="relative flex items-center justify-between rounded-3xl overflow-hidden p-6 shadow-xl border-2 border-white backdrop-blur-xl"
              >
                <Image
                  src="/askveasbg.png"
                  alt="Background"
                  fill
                  className="object-cover"
                />
                <div className="relative z-10 flex items-center justify-between w-full">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-editorial text-2xl font-medium text-white">Ask Veas AI</h3>
                    <p className="text-xs text-white/80 leading-tight">Chat with your personal astrologer</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path></svg>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
