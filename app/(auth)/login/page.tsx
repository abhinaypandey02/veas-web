import LoginForm from "@/app/(auth)/login/components/form";
import getCurrentUser from "@/app/api/(graphql)/User/resolvers/get-current-user";
import { Injector } from "naystack/graphql/server";
import { redirect, RedirectType } from "next/navigation";

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
          Component={LoginForm}
        />
      </div>
    </main>
  );
}
