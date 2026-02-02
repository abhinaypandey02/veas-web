import LogoutButton from "../dashboard/components/logout-button";
import ProfileInfo from "./profile-info";

export default function ProfilePage() {
  return (
    <main className="grow min-h-0 bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your account settings
            </p>
          </div>
          <LogoutButton />
        </div>
        <ProfileInfo />
      </div>
    </main>
  );
}
