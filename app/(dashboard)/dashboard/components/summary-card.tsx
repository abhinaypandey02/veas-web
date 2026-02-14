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

const VARIANTS = {
  gold: {
    bg: "bg-[#FDF6E3]", // Warm light yellow/beige
    border: "border-amber-200/50",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600",
    title: "text-amber-950",
    subtitle: "text-amber-700/60",
    button: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600",
    gradient: "from-amber-200/20 to-transparent",
  },
  blue: {
    bg: "bg-[#E0F2FE]", // Light blue
    border: "border-sky-200/50",
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-600",
    title: "text-sky-950",
    subtitle: "text-sky-700/60",
    button: "bg-sky-500/10 hover:bg-sky-500/20 text-sky-600",
    gradient: "from-sky-200/20 to-transparent",
  },
  purple: {
    bg: "bg-[#F3E8FF]", // Light purple
    border: "border-purple-200/50",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-600",
    title: "text-purple-950",
    subtitle: "text-purple-700/60",
    button: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-600",
    gradient: "from-purple-200/20 to-transparent",
  },
  indigo: {
    bg: "bg-[#E0E7FF]", // Light indigo
    border: "border-indigo-200/50",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-600",
    title: "text-indigo-950",
    subtitle: "text-indigo-700/60",
    button: "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600",
    gradient: "from-indigo-200/20 to-transparent",
  },
  pink: {
    bg: "bg-[#FCE7F3]", // Light pink
    border: "border-pink-200/50",
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-600",
    title: "text-pink-950",
    subtitle: "text-pink-700/60",
    button: "bg-pink-500/10 hover:bg-pink-500/20 text-pink-600",
    gradient: "from-pink-200/20 to-transparent",
  },
};

export default function SummaryCard({
  title,
  subtitle,
  type,
  icon: Icon,
  compact = false,
  variant = "purple",
  bgImage,
  bgImageCover = false,
}: SummaryCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [getSummary, { loading }] = useAuthQuery(GET_SUMMARY);

  const styles = VARIANTS[variant] || VARIANTS.purple;

  const handleFetchSummary = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (loading) return;

    // If we already have the summary, just open the modal
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
        style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px" }}
        className={`relative w-full h-full overflow-hidden rounded-3xl border ${styles.border} ${bgImage ? 'bg-black' : styles.bg} transition-transform active:scale-[0.98] cursor-pointer ${compact ? 'p-4' : 'p-6'}`}
      >
        {/* Background image */}
        {bgImage && (
          <Image
            src={bgImage}
            alt=""
            fill
            className={bgImageCover ? "object-cover" : "object-contain"}
            sizes="(max-width: 768px) 100vw, 400px"
          />
        )}

        {/* Decorative gradients */}
        {!bgImage && <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${styles.gradient} blur-2xl opacity-60`} />}

        {/* Arrow button at top-right corner */}
        <button
          onClick={handleFetchSummary}
          className={`absolute top-0 right-0 z-20 flex items-center justify-center transition-colors ${bgImage ? 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md' : styles.button} ${compact ? 'h-8 w-8 rounded-bl-2xl rounded-tr-3xl' : 'h-12 w-12 rounded-bl-2xl rounded-tr-3xl'}`}
          aria-label="Get summary"
        >
          {loading ? (
            <Loader size={compact ? 14 : 16} className="text-current opacity-70" />
          ) : (
            <ArrowUpRight size={compact ? 14 : 18} weight="bold" />
          )}
        </button>

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex items-start mb-2">
            <div className={`flex items-center justify-center rounded-2xl ${bgImage ? 'bg-white/20 text-white backdrop-blur-md' : `${styles.iconBg} ${styles.iconColor}`} ring-1 ring-black/5 ${compact ? 'h-8 w-8' : 'h-12 w-12'}`}>
              <Icon size={compact ? 16 : 24} weight="duotone" />
            </div>
          </div>

          <div>
            <h3 className={`font-editorial font-medium ${bgImage ? 'text-white' : styles.title} ${compact ? 'text-sm' : 'text-3xl'}`}>{title}</h3>
            <p className={`mt-0.5 font-medium ${bgImage ? 'text-white/80' : styles.subtitle} leading-tight ${compact ? 'text-[10px]' : 'text-sm'}`}>{subtitle}</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-sm max-h-[80vh] overflow-hidden rounded-3xl ${styles.bg} shadow-2xl flex flex-col`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-2 border-b border-black/5">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconColor} h-10 w-10`}>
                    <Icon size={20} weight="duotone" />
                  </div>
                  <div>
                    <h3 className={`font-editorial font-medium ${styles.title} text-lg`}>{title}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${styles.iconBg} ${styles.iconColor} transition-colors hover:bg-black/5`}
                >
                  <X size={16} weight="bold" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto">
                {summary ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: renderRichText(summary) }}
                    className={`prose prose-sm max-w-none ${styles.title} prose-p:opacity-80 prose-headings:font-editorial prose-strong:font-medium`}
                  />
                ) : (
                  <div className="flex justify-center py-8">
                    <Loader className={styles.iconColor} />
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
