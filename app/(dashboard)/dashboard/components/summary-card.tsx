"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthQuery } from "naystack/graphql/client";
import { GET_SUMMARY } from "@/constants/graphql/queries";
import { ChartSummaryType } from "@/__generated__/graphql";
import { ArrowRight, X } from "@phosphor-icons/react";
import Loader from "@/components/loader";
import { renderRichText } from "../../chat/utils";

interface SummaryCardProps {
  title: string;
  subtitle: string;
  type: ChartSummaryType;
}

export default function SummaryCard({
  title,
  subtitle,
  type,
}: SummaryCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [getSummary, { loading }] = useAuthQuery(GET_SUMMARY);
  const [cardHeight, setCardHeight] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const frontRef = useRef<HTMLDivElement | null>(null);
  const backRef = useRef<HTMLDivElement | null>(null);

  const handleFetchSummary = async () => {
    if (loading) return;
    const result = await getSummary({ type });
    if (result.data?.getSummary) {
      setSummary(result.data.getSummary);
      setFlipped(true);
    }
  };

  const handleClose = () => {
    setFlipped(false);
  };

  useEffect(() => {
    const target = flipped ? backRef.current : frontRef.current;
    if (!target) return;

    const nextHeight = target.offsetHeight;
    if (!cardHeight || nextHeight !== cardHeight) {
      setCardHeight(nextHeight);
    }
  }, [flipped, summary, cardHeight]);

  return (
    <div className="perspective-[1000px]">
      <div
        ref={containerRef}
        className="relative w-full transition-transform duration-700 transform-3d"
        style={{
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          height: cardHeight ? `${cardHeight}px` : undefined,
        }}
      >
        {/* Front face */}
        <div
          ref={frontRef}
          className="relative rounded-2xl bg-primary p-6 text-white backface-hidden"
        >
          <button
            onClick={handleFetchSummary}
            className="absolute top-5 right-5"
            aria-label="Get summary"
          >
            {loading ? (
              <Loader size={20} className="text-white" />
            ) : (
              <ArrowRight size={20} weight="bold" />
            )}
          </button>
          <h3 className="text-lg font-semibold font-editorial">{title}</h3>
          <p className="mt-1 text-sm text-white/70">{subtitle}</p>
        </div>

        {/* Back face */}
        <div
          ref={backRef}
          className="absolute inset-x-0 top-0 rounded-2xl bg-white p-6 text-primary shadow-lg backface-hidden transform-[rotateY(180deg)]"
        >
          <button
            onClick={handleClose}
            className="absolute top-5 right-5"
            aria-label="Close summary"
          >
            <X size={20} weight="bold" />
          </button>
          {summary && (
            <p
              dangerouslySetInnerHTML={{ __html: renderRichText(summary) }}
              className="text-sm leading-relaxed pr-6"
            />
          )}
        </div>
      </div>
    </div>
  );
}
