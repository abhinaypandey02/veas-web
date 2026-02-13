"use client";

import { useState } from "react";
import { ChartSummaryType, GetSummaryDocument } from "@/__generated__/graphql";
import { useAuthQuery } from "naystack/graphql/client";
import { X } from "@phosphor-icons/react";

interface SummaryCardProps {
  title: string;
  subtitle: string;
  type: ChartSummaryType;
  icon: React.ReactNode;
}

const CARD_STYLES: Record<
  string,
  { bg: string; border: string; glow: string; iconBg: string }
> = {
  [ChartSummaryType.Daily]: {
    bg: "bg-gradient-to-br from-[#14248A] via-[#1e3494] to-[#998FC7]",
    border: "border-[#4a56b0]/40",
    glow: "bg-cosmic-lavender/20",
    iconBg: "bg-white/12",
  },
  [ChartSummaryType.Weekly]: {
    bg: "bg-gradient-to-br from-[#1a1a1a] via-[#2a2a35] to-[#3a3a4a]",
    border: "border-white/15",
    glow: "bg-white/8",
    iconBg: "bg-white/10",
  },
  [ChartSummaryType.Mahadasha]: {
    bg: "bg-gradient-to-br from-[#6b5fa0] via-[#7d6fb8] to-[#14248A]",
    border: "border-cosmic-lavender/30",
    glow: "bg-cosmic-lavender/15",
    iconBg: "bg-white/12",
  },
  [ChartSummaryType.Antardasha]: {
    bg: "bg-gradient-to-br from-[#14248A] via-[#1a2e6e] to-[#1a1a1a]",
    border: "border-[#3a4a8a]/30",
    glow: "bg-[#4a5aaa]/15",
    iconBg: "bg-white/10",
  },
  [ChartSummaryType.Pratyantardasha]: {
    bg: "bg-gradient-to-br from-[#2a2240] via-[#3a2e5a] to-[#998FC7]",
    border: "border-cosmic-purple/30",
    glow: "bg-cosmic-purple/12",
    iconBg: "bg-white/12",
  },
};

export default function SummaryCard({
  title,
  subtitle,
  type,
  icon,
}: SummaryCardProps) {
  const [showSummary, setShowSummary] = useState(false);
  const style = CARD_STYLES[type] || CARD_STYLES[ChartSummaryType.Daily];

  // Fetch summary data using the GraphQL query
  const { data, loading, error, refetch } = useAuthQuery(GetSummaryDocument, {
    variables: { input: { type } },
    skip: !showSummary, // Only fetch when user clicks the card
  });

  const handleClick = () => {
    setShowSummary(true);
    if (!data && !loading) {
      refetch();
    }
  };

  const handleClose = () => {
    setShowSummary(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`relative w-full rounded-[1.25rem] sm:rounded-[1.5rem] ${style.bg} border-2 ${style.border} overflow-hidden group transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-1 active:scale-[0.99]`}
      >
        {/* ── Decorative layers ── */}
        <div
          className={`absolute -top-10 -right-10 w-40 h-40 rounded-full ${style.glow} blur-3xl pointer-events-none transition-all duration-700 group-hover:scale-150 group-hover:opacity-80`}
        />
        <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/[0.08] blur-2xl pointer-events-none" />
        {/* Noise/grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: "url('/noise.svg')", backgroundSize: "200px" }}
        />

        {/* ── Card content - HORIZONTAL LAYOUT ── */}
        <div className="relative z-10 p-5 sm:p-6">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Icon (Left) */}
            <div
              className={`w-12 h-12 sm:w-13 sm:h-13 rounded-xl ${style.iconBg} backdrop-blur-md border-2 border-white/25 flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-110 group-hover:bg-white/30 group-hover:border-white/35 group-hover:shadow-lg transition-all duration-500`}
            >
              {icon}
            </div>

            {/* Text (Center) */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold font-editorial text-white tracking-tight leading-tight mb-0.5">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-white/55 leading-snug truncate">
                {subtitle}
              </p>
            </div>

            {/* Arrow (Right) */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/12 border-2 border-white/25 flex items-center justify-center flex-shrink-0 group-hover:bg-white/25 group-hover:border-white/35 group-hover:shadow-md transition-all duration-300 shadow-sm">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-white/90 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </button>

      {/* ── Summary Modal ── */}
      {showSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl sm:rounded-[1.5rem] bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className={`relative ${style.bg} p-6 sm:p-8`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 rounded-xl ${style.iconBg} backdrop-blur-sm border border-white/15 flex items-center justify-center`}
                    >
                      {icon}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-editorial font-medium text-white tracking-tight">
                      {title}
                    </h2>
                  </div>
                  <p className="text-sm text-white/60">{subtitle}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all duration-300 flex-shrink-0"
                  aria-label="Close"
                >
                  <X size={18} weight="bold" className="text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(85vh-180px)]">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-4 border-cosmic-lavender/30 border-t-cosmic-purple animate-spin" />
                    <span className="text-sm text-muted">
                      Loading your cosmic insights...
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
                      <span className="text-2xl">⚠</span>
                    </div>
                    <p className="text-sm text-danger">
                      Failed to load summary. Please try again.
                    </p>
                  </div>
                </div>
              )}

              {data?.getSummary && (
                <div className="prose prose-sm sm:prose max-w-none">
                  <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
                    {data.getSummary}
                  </p>
                </div>
              )}

              {!loading && !error && !data?.getSummary && (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-12 h-12 rounded-full bg-cosmic-lavender/20 border border-cosmic-purple/20 flex items-center justify-center">
                      <span className="text-xl">✧</span>
                    </div>
                    <p className="text-sm text-muted">
                      No summary available yet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
