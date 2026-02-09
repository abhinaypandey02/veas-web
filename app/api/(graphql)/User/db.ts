import {
  pgTable,
  serial,
  text,
  timestamp,
  real,
  integer,
  unique,
} from "drizzle-orm/pg-core";

export const UserTable = pgTable("users", {
  id: serial("id").primaryKey(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  chartId: integer("chart_id")
    .notNull()
    .references(() => UserChartTable.id),
  placeOfBirth: text("place_of_birth").notNull(),
  timezoneOffset: real("timezone_offset").notNull(),
});

export type UserDB = typeof UserTable.$inferSelect;
export type UserRawChartDB = typeof UserRawChartTable.$inferSelect;
export type UserChartDB = typeof UserChartTable.$inferSelect;
export type UserChartSummariesDB = typeof UserChartSummariesTable.$inferSelect;

export const UserRawChartTable = pgTable("user_raw_charts", {
  id: serial("id").primaryKey(),
  rawChart: text("raw_chart").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const UserChartTable = pgTable(
  "user_charts",
  {
    id: serial("id").primaryKey(),
    dateOfBirth: timestamp("date_of_birth").notNull(),
    placeOfBirthLat: real("place_of_birth_lat").notNull(),
    placeOfBirthLong: real("place_of_birth_long").notNull(),
    rawChartId: integer("raw_chart_id")
      .notNull()
      .references(() => UserRawChartTable.id)
      .unique(),
    summariesId: integer("summaries_id")
      .notNull()
      .references(() => UserChartSummariesTable.id)
      .unique(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    unique("user_chart_unique").on(
      table.dateOfBirth,
      table.placeOfBirthLat,
      table.placeOfBirthLong,
    ),
  ],
);

export const UserChartSummariesTable = pgTable("user_chart_summaries", {
  id: serial("id").primaryKey(),
  d1Summary: text("d1_summary"),
  dailySummary: text("daily_summary"),
  weeklySummary: text("weekly_summary"),
  antardashaSummary: text("antardasha_summary"),
  pratyantardashaSummary: text("pratyantardasha_summary"),
  mahadashaSummary: text("mahadasha_summary"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
