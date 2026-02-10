import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { UserTable } from "../User/db";

export const FeedbackTable = pgTable("feedbacks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => UserTable.id),
  score: integer("score").notNull(),
  text: text("text"),
  createdAt: timestamp("created_at").defaultNow(),
});
