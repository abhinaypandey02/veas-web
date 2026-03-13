import LoginForm from "@/app/(auth)/login/components/form";

export default function Page() {
  return (
    <main className="flex pt-16 items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <LoginForm />
      </div>
    </main>
  );
}
