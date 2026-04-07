import { auth } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import { FilePlus2, Star } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function PricingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="flex min-h-screen flex-col [font-family:var(--font-schibsted-grotesk)]">
      <header className="flex w-full items-center justify-between px-6 py-4 md:px-10 lg:px-30">
        <div className="text-2xl font-semibold tracking-[-1.44px]">Chat To PDF</div>

        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm font-medium">
            Pricing
          </Link>
          <Link href="/dashboard" className="rounded-lg border px-3 py-2 text-sm font-medium">
            My Documents
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border"
            aria-label="Add document"
          >
            <FilePlus2 className="h-4 w-4" />
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium">
            <Star className="h-4 w-4" />
            Upgrade
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border">
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-6 pb-12 pt-10 text-center md:px-10">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm font-medium">Pricing</p>
          <h1 className="text-4xl font-bold [font-family:var(--font-fustat)] md:text-5xl">
            Supercharge your Document Companion
          </h1>
          <p className="max-w-4xl text-base [font-family:var(--font-fustat)]">
            Choose an affordable plan packed with the best features for interacting with your PDFs,
            enhancing productivity, and streamlining your workflow.
          </p>
        </div>

        <section className="mt-10 grid w-full max-w-5xl gap-6 md:grid-cols-2">
          <article className="flex h-full flex-col rounded-2xl border p-6 text-left">
            <div>
              <h2 className="text-xl font-semibold [font-family:var(--font-fustat)]">Starter Plan</h2>
              <p className="mt-1 text-sm">Explore Core Features at No Cost</p>
            </div>
            <p className="mt-6 text-3xl font-semibold [font-family:var(--font-fustat)]">Free</p>
            <ul className="mt-6 space-y-3">
              <li>2 Documents</li>
              <li>Up to 3 messages per document</li>
              <li>Try out the AI Chat Functionality</li>
            </ul>
          </article>

          <article className="flex h-full flex-col rounded-2xl border-2 p-6 text-left">
            <div>
              <h2 className="text-xl font-semibold [font-family:var(--font-fustat)]">Pro Plan</h2>
              <p className="mt-1 text-sm">Maximize Productivity with PRO Features</p>
            </div>

            <p className="mt-6 text-3xl font-semibold [font-family:var(--font-fustat)]">
              ₹299 <span className="text-base font-normal">Lifetime access</span>
            </p>

            <button type="button" className="mt-6 w-full rounded-lg border px-4 py-2 text-sm font-medium">
              Upgrade to Pro
            </button>

            <ul className="mt-6 space-y-3">
              <li>Store upto 20 Documents</li>
              <li>Ability to Delete Documents</li>
              <li>Up to 100 messages per document</li>
              <li>Full Power AI Chat Functionality with Memory Recall</li>
              <li>Advanced analytics</li>
              <li>24-hour support response time</li>
              <li>One-time payment, no hidden costs</li>
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}
