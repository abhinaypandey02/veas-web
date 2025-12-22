import React from "react";
import LoginForm from "@/app/(auth)/login/components/form";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Welcome back
          </h2>
          <p className="mt-1 text-3xl font-semibold text-gray-900">
            Log in to Veas
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}



