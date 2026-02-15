"use client";

import { useState } from "react";
import { useAuthQuery } from "naystack/graphql/client";
import { GET_SUMMARY } from "@/constants/graphql/queries";
import { ChartSummaryType } from "@/__generated__/graphql";
import { ArrowUpRight, X, IconProps } from "@phosphor-icons/react";
import Loader from "@/components/loader";
import { renderRichText } from "../../chat/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface SummaryCardProps {
  title: string;
  subtitle: string;
  type: ChartSummaryType;
  icon: React.ComponentType<IconProps>;
  compact?: boolean;
  variant?: "gold" | "blue" | "purple" | "indigo" | "pink";
  bgImage?: string;
  bgImageCover?: boolean;
}

const MONOCHROME_STYLE = {
  bg: "bg-[#fdfbf7]", // Warm off-white
  border: "border-[#f0f0f0]", // Very soft border
  iconBg: "bg-transparent",
  iconColor: "text-[#1a1a1a]",
  title: "text-[#1a1a1a]",
  subtitle: "text-[#4a4a4a]", // Warmer grey
  button: "bg-transparent hover:bg-[#1a1a1a]/5 text-[#1a1a1a]",
};

export default function SummaryCard({
  title,
  subtitle,
  type,
  icon: Icon,
  compact = false,
  variant, // Kept for prop compatibility but unused
  bgImage, // unused in retro mode
  bgImageCover = false, // unused
}: SummaryCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [getSummary, { loading }] = useAuthQuery(GET_SUMMARY);

  const handleFetchSummary = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (loading) return;

    if (summary) {
      setShowModal(true);
      return;
    }

    const result = await getSummary({ type });
    if (result.data?.getSummary) {
      setSummary(result.data.getSummary);
      setShowModal(true);
    }
  };

  return (
    <>
      <div
        onClick={() => handleFetchSummary()}
        className={`group relative overflow-hidden rounded-[2rem] bg-[#FDFCF8] border border-black/5 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 cursor-pointer 
        ${compact ? "p-4 min-w-[160px] h-full" : "p-7"}
        ${bgImage ? "text-white" : "text-[#1a1a1a]"}
        ${title === "Daily" ? "w-full h-full" : ""}
        `}
      >
        {/* Background Image for Hero/Daily */}
        {bgImage && (
          <>
            <Image
              src={bgImage}
              alt="Background"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </>
        )}

        {/* Soft Gradient Overlay on Hover (non-image cards) */}
        {!bgImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-[var(--color-rose-dust)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        )}

        {/* Arrow button */}
        <button
          onClick={handleFetchSummary}
          className={`absolute top-4 right-4 z-20 flex items-center justify-center transition-all duration-300 rounded-full aspect-square shadow-sm
            ${bgImage
              ? "bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md border-white/10"
              : "bg-white border border-black/5 text-black/60 group-hover:bg-[#1a1a1a] group-hover:text-white"
            }
          `}
          style={{ width: compact ? 28 : 36 }}
          aria-label="Get summary"
        >
          {loading ? (
            <Loader size={12} className="text-current opacity-70" />
          ) : (
            <ArrowUpRight size={compact ? 16 : 20} weight="light" />
          )}
        </button>

        <div className="relative z-10 flex flex-col h-full justify-between pointer-events-none">
          {/* Icon (Hidden on Hero/Daily to match image style? Or keep it? keeping for now but maybe white) */}
          {!bgImage && (
            <div className="flex items-start mb-1 text-black/70 group-hover:text-black transition-colors duration-500">
              <Icon size={compact ? 24 : 32} weight="light" />
            </div>
          )}
          {bgImage && <div />} {/* Spacer */}

          <div className="z-20 relative">
            {/* Subtitle / Label */}
            <p
              className={`font-sans font-medium uppercase tracking-[0.15em] mb-1.5
                ${compact ? "text-[9px]" : "text-[10px]"}
                ${bgImage ? "text-white/80" : "text-black/50"}
              `}
            >
              {subtitle}
            </p>

            {/* Title */}
            <div className="relative h-auto w-full">
              <h3
                className={`font-editorial font-light leading-none transition-all duration-500
                  ${compact ? "text-xl leading-tight" : "text-4xl"}
                  ${bgImage ? "text-white" : "text-[#1a1a1a]"}
                  group-hover:tracking-wide
                `}
              >
                {title}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          // ... Modal content remains same ...
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/90 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm max-h-[80vh] overflow-hidden rounded-[2rem] border border-black/5 bg-[#FDFCF8] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="relative flex items-center justify-between p-8 pb-4 border-b border-black/5">
                <div className="flex items-center gap-4">
                  <div className="text-black/80 bg-[var(--color-rose-dust)]/20 p-2.5 rounded-full">
                    <Icon size={24} weight="light" />
                  </div>
                  <h3 className="font-editorial text-3xl font-light text-[#1a1a1a] lowercase">
                    {title}
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex h-10 w-10 items-center justify-center text-black/40 hover:text-black hover:bg-black/5 rounded-full transition-colors"
                >
                  <X size={24} weight="light" />
                </button>
              </div>

              {/* Content */}
              <div className="relative p-6 overflow-y-auto bg-white">
                {summary ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: renderRichText(summary) }}
                    className="prose prose-sm max-w-none text-black prose-headings:font-editorial prose-headings:font-bold prose-p:font-sans prose-p:font-medium text-lg leading-tight"
                  />
                ) : (
                  <div className="flex justify-center py-8">
                    <Loader className="text-black" />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
