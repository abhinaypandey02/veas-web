import OnboardForm from "@/app/onboard/components/form";
import { Injector } from "naystack/graphql/server";
import getCurrentUser from "../api/(graphql)/User/resolvers/get-current-user";
import { redirect, RedirectType } from "next/navigation";

export default function Page() {
  return (
    <main className="flex pt-16 items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <Injector
          fetch={async () => {
            const user = await getCurrentUser.authCall();
            if (user) {
              return redirect("/dashboard", RedirectType.replace);
            }
            return true as const;
          }}
          Component={OnboardForm}
        />
      </div>
    </main>
  );
}
