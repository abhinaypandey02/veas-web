import ProfileClient from "./profile-client";
import { Injector } from "naystack/graphql/server";
import getPlanets from "@/app/api/(graphql)/User/resolvers/get-planets";
import getCurrentUser from "@/app/api/(graphql)/User/resolvers/get-current-user";

export default function ProfilePage() {
  return (
    <main className="grow min-h-0">
      <Injector
        fetch={async () => ({
          planetsData: await getPlanets.authCall(),
          userData: await getCurrentUser.authCall(),
        })}
        Component={ProfileClient}
      />
    </main>
  );
}
