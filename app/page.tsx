import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold">Clerk Auth Demo</h1>
        <div className="flex items-center gap-3">
          <SignInButton />
          <SignUpButton />
          <UserButton />
        </div>
      </div>
    </main>
  );
}
