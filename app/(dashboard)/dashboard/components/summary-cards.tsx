"use client";

import { ChartSummaryType } from "@/__generated__/graphql";
import SummaryCard from "./summary-card";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white sm:w-[18px] sm:h-[18px]">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white sm:w-[18px] sm:h-[18px]">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="8" cy="15" r="1" fill="currentColor" />
      <circle cx="12" cy="15" r="1" fill="currentColor" />
    </svg>
  );
}

function SaturnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white sm:w-[18px] sm:h-[18px]">
      <circle cx="12" cy="12" r="5" />
      <ellipse cx="12" cy="12" rx="10" ry="3" transform="rotate(-20 12 12)" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white sm:w-[18px] sm:h-[18px]">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white sm:w-[18px] sm:h-[18px]">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

const SUMMARY_ITEMS: {
  type: ChartSummaryType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}[] = [
    {
      type: ChartSummaryType.Daily,
      title: "Daily Summary",
      subtitle: "Know about your day ahead",
      icon: <SunIcon />,
    },
    {
      type: ChartSummaryType.Weekly,
      title: "Weekly Summary",
      subtitle: "Know about your week ahead",
      icon: <CalendarIcon />,
    },
    {
      type: ChartSummaryType.Mahadasha,
      title: "Major Period Summary",
      subtitle: "Understand your current major planetary period",
      icon: <SaturnIcon />,
    },
    {
      type: ChartSummaryType.Antardasha,
      title: "Sub-Period Summary",
      subtitle: "See the focus of your current sub-period",
      icon: <MoonIcon />,
    },
    {
      type: ChartSummaryType.Pratyantardasha,
      title: "Trigger Period Summary",
      subtitle: "Zoom into your current short activation window",
      icon: <StarIcon />,
    },
  ];

export default function SummaryCards() {
  return (
    <>
      {SUMMARY_ITEMS.map((item) => (
        <SummaryCard
          key={item.type}
          type={item.type}
          title={item.title}
          subtitle={item.subtitle}
          icon={item.icon}
        />
      ))}
    </>
  );
}
