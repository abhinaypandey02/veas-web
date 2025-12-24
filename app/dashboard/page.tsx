import React from "react";
import LogoutButton from "./components/logout-button";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Welcome to your dashboard
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Chart Overview
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              View your astrological charts and insights
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Current Dasha
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your current planetary period
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Predictions
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Personalized astrological predictions
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

