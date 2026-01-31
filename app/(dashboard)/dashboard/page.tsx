import LogoutButton from "./components/logout-button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="grow min-h-0 bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Welcome to your dashboard
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/chat">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Start Chat with AI Astrologer
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                View your astrological charts and insights
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
