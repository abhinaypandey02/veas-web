import OnboardForm from "@/app/onboard/components/form";
import { query } from "@/app/lib/gql-server";
import { GET_CURRENT_USER } from "@/constants/graphql/queries";
import { redirect } from "next/navigation";

export default async function Page() {
  const data = await query(GET_CURRENT_USER, {
    revalidate: 0,
  });

  if (data?.getCurrentUser?.isOnboarded) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Complete Your Profile
          </h2>
          <p className="mt-1 text-3xl font-semibold text-gray-900">
            Onboarding
          </p>
        </div>
        <OnboardForm />
      </div>
    </main>
  );
}
