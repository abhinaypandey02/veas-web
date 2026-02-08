import {
  pgTable,
  serial,
  text,
  timestamp,
  real,
  integer,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";

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
