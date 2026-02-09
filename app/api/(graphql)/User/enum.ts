import { registerEnumType } from "type-graphql";

export enum ChartSummaryType {
  Daily = "Daily",
  Weekly = "Weekly",
  Mahadasha = "Mahadasha",
  Antardasha = "Antardasha",
  Pratyantardasha = "Pratyantardasha",
}

registerEnumType(ChartSummaryType, {
  name: "ChartSummaryType",
});
