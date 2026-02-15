"use client";

import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UsersList({
  data: users,
  loading,
}: {
  data?: User[];
  loading: boolean;
}) {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">
            &larr; Dashboard
          </Link>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-500">
            {loading ? "Loading..." : `${users?.length ?? 0} total users`}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          {loading || !users ? (
            <div className="divide-y divide-gray-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-4 animate-pulse flex gap-4">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-4 w-48 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className="p-6 text-sm text-gray-400">No users yet</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="font-medium text-gray-900 hover:text-cosmic-purple"
                      >
                        {user.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
