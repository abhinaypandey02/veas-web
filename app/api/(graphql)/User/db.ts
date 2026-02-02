import {
  pgTable,
  serial,
  text,
  timestamp,
  real,
  integer,
  jsonb,
  unique,
  pgEnum,
} from "drizzle-orm/pg-core";
import { ChartKey } from "@/app/api/lib/charts/keys";

export const UserTable = pgTable("users", {
  id: serial("id").primaryKey(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  name: text("name"),
  dateOfBirth: timestamp("date_of_birth"),
  placeOfBirthLat: real("place_of_birth_lat"),
  placeOfBirthLong: real("place_of_birth_long"),
  placeOfBirth: text("place_of_birth"),
  timezoneOffset: real("timezone_offset"),
});

export type UserDB = typeof UserTable.$inferSelect;

// Chart key enum for database - automatically uses all ChartKey enum values
export const chartKeyEnum = pgEnum(
  "chart_key",
  Object.values(ChartKey) as [string, ...string[]],
);

// Normalized chart summaries table - multiple rows per user
export const UserChartSummaryTable = pgTable(
  "user_chart_summaries",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => UserTable.id),
    key: chartKeyEnum("key").notNull(),
    summary: text("summary"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    // Unique constraint: one summary per user per key
    unique().on(table.userId, table.key),
  ],
);
export type UserChartSummaryDB = typeof UserChartSummaryTable.$inferSelect;

export const UserRawChartTable = pgTable(
  "user_raw_charts",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => UserTable.id),
    rawChart: jsonb("raw_chart").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [unique().on(table.userId)],
);
