"use client";

import Link from "next/link";

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

export interface AdminStats {
  totalUsers: number;
  totalChats: number;
  totalFeedbacks: number;
  totalCharts: number;
  totalSummaries: number;
  genderBreakdown: { gender: string; count: number }[];
  chatRoleBreakdown: { role: string; count: number }[];
  summaryTypeBreakdown: { type: string; count: number }[];
  avgFeedbackScore: number;
  uniqueChatUsers: number;
  chatsLast24h: number;
  chatsLast7d: number;
  chatsLast30d: number;
  chartsLast7d: number;
  chartsLast30d: number;
  recentFeedbacks: {
    score: number;
    text: string | null;
    createdAt: string | null;
  }[];
}

function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">Loading statistics...</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm animate-pulse"
            >
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="mt-3 h-8 w-16 bg-gray-200 rounded" />
              <div className="mt-2 h-3 w-32 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function AdminDashboard({
  data: stats,
  loading,
}: {
  data?: AdminStats;
  loading: boolean;
}) {
  if (loading || !stats) {
    return <LoadingSkeleton />;
  }

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
            <Link href="/admin/users">
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                subtitle="All registered users"
              />
            </Link>
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
