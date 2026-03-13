import {
  pgTable,
  serial,
  integer,
  pgEnum,
  timestamp,
} from "drizzle-orm/pg-core";
import { SubscriptionType } from "./enum";
import { UserTable } from "@/app/api/(graphql)/User/db";

export const subscriptionTypeEnum = pgEnum(
  "subscription_type",
  Object.values(SubscriptionType) as [SubscriptionType, ...SubscriptionType[]],
);

export const SubscriptionTable = pgTable("subscription", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => UserTable.id),
  type: subscriptionTypeEnum("type").notNull(),
  validTill: timestamp("valid_till").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type SubscriptionDB = typeof SubscriptionTable.$inferSelect;
