"use client";

import { ChartSummaryType } from "@/__generated__/graphql";
import SummaryCard from "./summary-card";
import { Sun, Calendar, Planet, Moon, Sparkle } from "@phosphor-icons/react";

const SUMMARY_ITEMS = [
  {
    type: ChartSummaryType.Daily,
    title: "Daily Summary",
    subtitle: "Know about your day ahead",
    icon: Sun,
    variant: "gold",
  },
  {
    type: ChartSummaryType.Weekly,
    title: "Weekly Summary",
    subtitle: "Know about your week ahead",
    icon: Calendar,
    variant: "blue",
  },
  {
    type: ChartSummaryType.Mahadasha,
    title: "Major Period Summary",
    subtitle: "Understand your current major planetary period",
    icon: Planet,
    variant: "purple",
  },
  {
    type: ChartSummaryType.Antardasha,
    title: "Sub-Period Summary",
    subtitle: "See the focus of your current sub-period",
    icon: Moon,
    variant: "indigo",
  },
  {
    type: ChartSummaryType.Pratyantardasha,
    title: "Trigger Period Summary",
    subtitle: "Zoom into your current short activation window",
    icon: Sparkle,
    variant: "pink",
  },
];

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-2 grid-rows-[3fr_3fr_3fr] gap-3 h-full">
      {SUMMARY_ITEMS.map((item, index) => (
        <div key={item.type} className={index === 0 ? "col-span-2 row-span-1" : "col-span-1 row-span-1"}>
          <SummaryCard
            type={item.type}
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
            compact={index !== 0}
            variant={item.variant as any}
            bgImage={
              item.type === ChartSummaryType.Daily ? "/daily.png" :
                item.type === ChartSummaryType.Weekly ? "/weekly.png" :
                  item.type === ChartSummaryType.Mahadasha ? "/majorperiod.jpg" :
                    item.type === ChartSummaryType.Antardasha ? "/footerbg.jpg" :
                      item.type === ChartSummaryType.Pratyantardasha ? "/moon.png" :
                        undefined
            }
            bgImageCover={item.type !== ChartSummaryType.Mahadasha}
          />
        </div>
      ))}
    </div>
  );
}
