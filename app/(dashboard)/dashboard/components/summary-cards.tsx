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
    title: "Mahadasha Summary",
    subtitle: "Know about your current mahadasha",
  },
  {
    type: ChartSummaryType.Antardasha,
    title: "Antardasha Summary",
    subtitle: "Know about your current antardasha",
  },
  {
    type: ChartSummaryType.Pratyantardasha,
    title: "Pratyantardasha Summary",
    subtitle: "Know about your current pratyantardasha",
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
