"use client";

import Link from "next/link";

interface UserData {
  id: number;
  name: string;
  email: string;
  gender: string;
  placeOfBirth: string;
  timezoneOffset: number;
  totalMessages: number;
  dateOfBirth: string | null;
  placeOfBirthLat: number | null;
  placeOfBirthLong: number | null;
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

export default function UserDetail({
  data: user,
  loading,
}: {
  data?: UserData | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="mt-2 h-4 w-32 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm animate-pulse space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/admin/users" className="text-sm text-gray-500 hover:text-gray-700">
            &larr; Back to Users
          </Link>
          <p className="mt-8 text-gray-500">User not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin/users" className="text-sm text-gray-500 hover:text-gray-700">
            &larr; Back to Users
          </Link>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
          <p className="mt-2 text-sm text-gray-500">{user.email}</p>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Birth Details
            </h2>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <DetailRow
                label="Date of Birth"
                value={
                  user.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"
                }
              />
              <DetailRow label="Place of Birth" value={user.placeOfBirth} />
              {user.placeOfBirthLat != null && user.placeOfBirthLong != null && (
                <DetailRow
                  label="Coordinates"
                  value={`${user.placeOfBirthLat.toFixed(4)}, ${user.placeOfBirthLong.toFixed(4)}`}
                />
              )}
              <DetailRow
                label="Timezone Offset"
                value={`UTC${user.timezoneOffset >= 0 ? "+" : ""}${user.timezoneOffset}`}
              />
              <DetailRow label="Gender" value={user.gender} />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Activity
            </h2>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <DetailRow
                label="Total Messages Sent"
                value={user.totalMessages}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
