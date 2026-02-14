import { count, sql, gte } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "../api/lib/db";
import {
  UserTable,
  UserChartTable,
  UserChartSummariesTable,
} from "../api/(graphql)/User/db";
import { ChatTable } from "../api/(graphql)/Chat/db";
import { FeedbackTable } from "../api/(graphql)/Feedback/db";

async function getStats() {
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
    recentFeedbacks,
  };
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
    </div>
  );
}

function BreakdownCard({
  title,
  items,
}: {
  title: string;
  items: { label: string; count: number }[];
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 mb-4">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400">No data yet</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const pct = total > 0 ? (item.count / total) * 100 : 0;
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-medium text-gray-900">
                    {item.count}{" "}
                    <span className="text-gray-400 font-normal">
                      ({pct.toFixed(0)}%)
                    </span>
                  </span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-cosmic-purple"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">
            Platform statistics overview
          </p>
        </div>

        {/* Primary metrics */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Overview
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              subtitle="All registered users"
            />
            <StatCard
              title="Total Charts"
              value={stats.totalCharts}
              subtitle={`${stats.chartsLast7d} in last 7 days`}
            />
            <StatCard
              title="Total Chat Messages"
              value={stats.totalChats}
              subtitle={`${stats.uniqueChatUsers} unique users chatted`}
            />
            <StatCard
              title="Total Feedbacks"
              value={stats.totalFeedbacks}
              subtitle={`Avg score: ${stats.avgFeedbackScore}`}
            />
          </div>
        </section>

        {/* Activity metrics */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Activity
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Total Summaries Generated"
              value={stats.totalSummaries}
            />
            <StatCard
              title="Charts (last 30 days)"
              value={stats.chartsLast30d}
              subtitle={`${stats.chartsLast7d} in last 7 days`}
            />
            <StatCard
              title="Chat Messages (last 24h)"
              value={stats.chatsLast24h}
              subtitle={`${stats.chatsLast7d} in 7d / ${stats.chatsLast30d} in 30d`}
            />
          </div>
        </section>

        {/* Breakdowns */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Breakdowns
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <BreakdownCard
              title="Users by Gender"
              items={stats.genderBreakdown.map((g) => ({
                label: g.gender,
                count: g.count,
              }))}
            />
            <BreakdownCard
              title="Chat Messages by Role"
              items={stats.chatRoleBreakdown.map((c) => ({
                label: c.role,
                count: c.count,
              }))}
            />
            <BreakdownCard
              title="Summaries by Type"
              items={stats.summaryTypeBreakdown.map((s) => ({
                label: s.type,
                count: s.count,
              }))}
            />
          </div>
        </section>

        {/* Recent feedbacks */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Feedbacks
          </h2>
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
            {stats.recentFeedbacks.length === 0 ? (
              <p className="p-6 text-sm text-gray-400">No feedbacks yet</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">
                      Comment
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentFeedbacks.map((fb, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {fb.score}/5
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-md truncate">
                        {fb.text || "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                        {fb.createdAt
                          ? new Date(fb.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
