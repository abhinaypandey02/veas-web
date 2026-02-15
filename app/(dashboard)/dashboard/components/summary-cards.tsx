import Link from "next/link";
import Image from "next/image";
import { ChartSummaryType } from "@/__generated__/graphql";
import SummaryCard from "./summary-card";
import { Sun, Calendar, Planet, Moon, Sparkle, ChatCircleDots, ArrowRight } from "@phosphor-icons/react";

const SUMMARY_ITEMS = [
  {
    type: ChartSummaryType.Daily,
    title: "Daily",
    subtitle: "Your day ahead",
    icon: Sun,
  },
  {
    type: ChartSummaryType.Weekly,
    title: "Weekly",
    subtitle: "Your week ahead",
    icon: Calendar,
  },
  {
    type: ChartSummaryType.Mahadasha,
    title: "Major Period",
    subtitle: "Planetary focus",
    icon: Planet,
  },
  {
    type: ChartSummaryType.Antardasha,
    title: "Sub-Period",
    subtitle: "Current focus",
    icon: Moon,
  },
  {
    type: ChartSummaryType.Pratyantardasha,
    title: "Trigger Period",
    subtitle: "Short activation",
    icon: Sparkle,
  },
];

export default function SummaryCards() {
  return (
    <div className="flex flex-col gap-8 pb-32">

      {/* Trending Section (Hero) */}
      <section className="px-1">
        <h2 className="font-editorial text-2xl mb-4 ml-1">Trending</h2>
        <div className="w-full h-48">
          <SummaryCard
            type={SUMMARY_ITEMS[0].type}
            title={SUMMARY_ITEMS[0].title}
            subtitle={SUMMARY_ITEMS[0].subtitle}
            icon={SUMMARY_ITEMS[0].icon}
            bgImage="/daily.png"
          // hero variant implied by bgImage existing + manual sizing here
          />
        </div>
      </section>

      {/* Ask Veas AI - Full Width Bar */}
      <section className="px-1">
        <Link
          href="/chat"
          className="group relative block w-full overflow-hidden rounded-[2rem] bg-[#1a1a1a] border border-black/5 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)] hover:-translate-y-1 active:translate-y-[1px]"
        >
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none opacity-20" />

          <div className="absolute top-1/2 -translate-y-1/2 right-6 z-20">
            <div className="bg-white/20 text-white p-2.5 rounded-full flex items-center justify-center aspect-square shadow-sm backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all duration-300">
              <ArrowRight size={16} weight="regular" />
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="text-white flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <ChatCircleDots size={24} weight="light" />
              </div>
              <div>

                <h3 className="font-editorial font-light text-white leading-none text-2xl group-hover:tracking-wide transition-all duration-500">
                  Ask Veas AI
                </h3>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Insights Section (Horizontal Scroll) */}
      <section>
        <div className="flex items-center justify-between px-2 mb-4">
          <h2 className="font-editorial text-2xl">Your Insights</h2>
          <span className="text-xs text-black/40 font-sans tracking-wide">Scroll for more</span>
        </div>

        <div className="flex overflow-x-auto gap-4 px-1 pb-4 -mx-1 no-scrollbar snap-x snap-mandatory">
          {/* Weekly */}
          <div className="snap-start shrink-0 w-40 h-40">
            <SummaryCard
              type={SUMMARY_ITEMS[1].type}
              title={SUMMARY_ITEMS[1].title}
              subtitle={SUMMARY_ITEMS[1].subtitle}
              icon={SUMMARY_ITEMS[1].icon}
              compact
            />
          </div>

          {/* Major Period */}
          <div className="snap-start shrink-0 w-40 h-40">
            <SummaryCard
              type={SUMMARY_ITEMS[2].type}
              title={SUMMARY_ITEMS[2].title}
              subtitle={SUMMARY_ITEMS[2].subtitle}
              icon={SUMMARY_ITEMS[2].icon}
              compact
            />
          </div>

          {/* Sub-Period */}
          <div className="snap-start shrink-0 w-40 h-40">
            <SummaryCard
              type={SUMMARY_ITEMS[3].type}
              title={SUMMARY_ITEMS[3].title}
              subtitle={SUMMARY_ITEMS[3].subtitle}
              icon={SUMMARY_ITEMS[3].icon}
              compact
            />
          </div>

          {/* Trigger Period */}
          <div className="snap-start shrink-0 w-40 h-40">
            <SummaryCard
              type={SUMMARY_ITEMS[4].type}
              title={SUMMARY_ITEMS[4].title}
              subtitle={SUMMARY_ITEMS[4].subtitle}
              icon={SUMMARY_ITEMS[4].icon}
              compact
            />
          </div>
          {/* Spacer for end of list padding */}
          <div className="w-1 shrink-0" />
        </div>
      </section>

    </div>
  );
}
