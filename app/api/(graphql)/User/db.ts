import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const UserTable = pgTable("users", {
  id: serial("id"),
  password: text("password").notNull(),
  email: text("email").notNull(),
});
