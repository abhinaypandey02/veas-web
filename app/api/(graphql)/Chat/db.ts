import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { UserTable } from "../User/db";
import { ChatRole } from "./enum";

export { ChatRole };

export const chatRolesEnum = pgEnum(
  "chat_role",
  Object.values(ChatRole) as [ChatRole, ...ChatRole[]],
);

export const ChatTable = pgTable("chat", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => UserTable.id)
    .notNull(),
  role: chatRolesEnum("role").notNull(),
  isSummarized: boolean("is_summarized").notNull().default(false),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ChatDB = typeof ChatTable.$inferSelect;
