import React from "react";
import SignUpForm from "@/app/(auth)/signup/components/form";
import { Injector } from "naystack/graphql/server";
import { redirect, RedirectType } from "next/navigation";
import getCurrentUser from "@/app/api/(graphql)/User/resolvers/get-current-user";

export default function Page() {
  return (
    <main className="flex pt-16 items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <Injector
          fetch={async () => {
            const user = await getCurrentUser.authCall();
            if (user) {
              return redirect("/onboard", RedirectType.replace);
            }
            return true as const;
          }}
          Component={SignUpForm}
        />
      </div>
    </main>
  );
}
