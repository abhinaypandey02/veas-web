import { pgTable, serial, text, pgEnum, integer, timestamp, jsonb, unique } from "drizzle-orm/pg-core";
import { ChartKey } from "../../lib/charts/keys";

export const UserTable = pgTable("users", {
  id: serial("id"),
  password: text("password").notNull(),
  email: text("email").notNull(),
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
