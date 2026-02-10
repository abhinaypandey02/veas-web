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

export enum Gender {
  Male = "Male",
  Female = "Female",
  NonBinary = "NonBinary",
}

registerEnumType(Gender, {
  name: "Gender",
});
