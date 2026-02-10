"use client";

import { ChartSummaryType } from "@/__generated__/graphql";
import SummaryCard from "./summary-card";

const SUMMARY_ITEMS: {
  type: ChartSummaryType;
  title: string;
  subtitle: string;
}[] = [
  {
    type: ChartSummaryType.Daily,
    title: "Daily Summary",
    subtitle: "Know about your day ahead",
  },
  {
    type: ChartSummaryType.Weekly,
    title: "Weekly Summary",
    subtitle: "Know about your week ahead",
  },
  {
    type: ChartSummaryType.Mahadasha,
    title: "Major Period Summary",
    subtitle: "Understand your current major planetary period",
  },
  {
    type: ChartSummaryType.Antardasha,
    title: "Sub-Period Summary",
    subtitle: "See the focus of your current sub-period",
  },
  {
    type: ChartSummaryType.Pratyantardasha,
    title: "Trigger Period Summary",
    subtitle: "Zoom into your current short activation window",
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
        />
      ))}
    </>
  );
}
