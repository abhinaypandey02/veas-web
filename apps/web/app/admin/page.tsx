import { Injector } from "naystack/graphql/server";
import type { Metadata } from "next";
import { connection } from "next/server";
import { count, sql, gte } from "drizzle-orm";
import { db } from "../api/lib/db";
import {
  UserTable,
  UserChartTable,
  UserChartSummariesTable,
} from "../api/(graphql)/User/db";
import { ChatTable } from "../api/(graphql)/Chat/db";
import { FeedbackTable } from "../api/(graphql)/Feedback/db";
import AdminDashboard from "./admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | Veas",
};

async function fetchStats() {
  await connection();
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    [{ totalUsers }],
    [{ totalChats }],
    [{ totalFeedbacks }],
    [{ totalCharts }],
    [{ totalSummaries }],
    genderBreakdown,
    chatRoleBreakdown,
    summaryTypeBreakdown,
    [{ avgFeedbackScore }],
    [{ uniqueChatUsers }],
    [{ chatsLast24h }],
    [{ chatsLast7d }],
    [{ chatsLast30d }],
    [{ chartsLast7d }],
    [{ chartsLast30d }],
    recentFeedbacks,
  ] = await Promise.all([
    db.select({ totalUsers: count() }).from(UserTable),
    db.select({ totalChats: count() }).from(ChatTable),
    db.select({ totalFeedbacks: count() }).from(FeedbackTable),
    db.select({ totalCharts: count() }).from(UserChartTable),
    db.select({ totalSummaries: count() }).from(UserChartSummariesTable),
    db
      .select({ gender: UserTable.gender, count: count() })
      .from(UserTable)
      .groupBy(UserTable.gender),
    db
      .select({ role: ChatTable.role, count: count() })
      .from(ChatTable)
      .groupBy(ChatTable.role),
    db
      .select({ type: UserChartSummariesTable.type, count: count() })
      .from(UserChartSummariesTable)
      .groupBy(UserChartSummariesTable.type),
    db
      .select({
        avgFeedbackScore:
          sql<number>`coalesce(round(avg(${FeedbackTable.score})::numeric, 1), 0)`,
      })
      .from(FeedbackTable),
    db
      .select({
        uniqueChatUsers: sql<number>`count(distinct ${ChatTable.userId})`,
      })
      .from(ChatTable),
    db
      .select({ chatsLast24h: count() })
      .from(ChatTable)
      .where(gte(ChatTable.createdAt, last24h)),
    db
      .select({ chatsLast7d: count() })
      .from(ChatTable)
      .where(gte(ChatTable.createdAt, last7d)),
    db
      .select({ chatsLast30d: count() })
      .from(ChatTable)
      .where(gte(ChatTable.createdAt, last30d)),
    db
      .select({ chartsLast7d: count() })
      .from(UserChartTable)
      .where(gte(UserChartTable.createdAt, last7d)),
    db
      .select({ chartsLast30d: count() })
      .from(UserChartTable)
      .where(gte(UserChartTable.createdAt, last30d)),
    db
      .select({
        score: FeedbackTable.score,
        text: FeedbackTable.text,
        createdAt: FeedbackTable.createdAt,
      })
      .from(FeedbackTable)
      .orderBy(sql`${FeedbackTable.createdAt} desc`)
      .limit(5),
  ]);

  return {
    totalUsers,
    totalChats,
    totalFeedbacks,
    totalCharts,
    totalSummaries,
    genderBreakdown,
    chatRoleBreakdown,
    summaryTypeBreakdown,
    avgFeedbackScore,
    uniqueChatUsers,
    chatsLast24h,
    chatsLast7d,
    chatsLast30d,
    chartsLast7d,
    chartsLast30d,
    recentFeedbacks: recentFeedbacks.map((fb) => ({
      ...fb,
      createdAt: fb.createdAt?.toISOString() ?? null,
    })),
  };
}

export default function AdminPage() {
  return <Injector fetch={fetchStats} Component={AdminDashboard} />;
}
