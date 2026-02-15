"use client";

import { useState, useEffect } from "react";
import SummaryCards from "./components/summary-cards";
import DashboardHeader from "./components/dashboard-header";
import PremiumBanner from "./components/premium-banner";
import { CosmicGraphic } from "@/components/CosmicGraphic"; // Note: CosmicGraphic might need adjustment for light mode visibility
import { X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
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
    <main className="relative grow h-svh w-full overflow-hidden bg-background text-[#1a1a1a]">
      {/* Background - Soft Cream / Off-white */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F4EFFC] to-[#E6DCF5]" />

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

      <div className="relative z-10 mx-auto flex h-full max-w-md flex-col px-4">
        <DashboardHeader
          onPremiumClick={() => setShowPremium(true)}
          userName={userName}
        />

        <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar">
          <SummaryCards />
        </div>
      </div>
    </main>
  );
}
