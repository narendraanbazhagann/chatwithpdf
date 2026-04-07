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
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 md:px-10 lg:px-30">
        <div className="text-xl font-semibold tracking-tight [font-family:var(--font-schibsted-grotesk)] sm:text-2xl sm:tracking-[-1.44px]">
          Chat To PDF
        </div>

        <div className="flex items-center gap-1.5 [font-family:var(--font-schibsted-grotesk)] sm:gap-3">
          <Link href="/pricing" className="hidden text-sm font-medium md:block">
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-black/15 bg-white/90 px-2 py-1.5 text-xs font-medium sm:px-3 sm:py-2 sm:text-sm"
          >
            <span className="hidden xs:inline">My Documents</span>
            <span className="xs:hidden">Files</span>
          </Link>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/15 bg-white/90 sm:h-10 sm:w-10"
            aria-label="Add document"
          >
            <FilePlus2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-black px-2 py-1.5 text-xs font-medium text-white sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
          >
            <Star className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Upgrade</span>
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white/90 sm:h-10 sm:w-10">
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-4 pb-12 pt-8 text-center sm:px-6 md:px-10 md:pt-10">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-black/60 sm:text-sm">Pricing Plans</p>
          <h1 className="text-3xl font-bold tracking-tight [font-family:var(--font-fustat)] sm:text-4xl md:text-5xl">
            Supercharge your <br className="sm:hidden" /> Document Companion
          </h1>
          <p className="max-w-2xl px-2 text-sm text-black/70 [font-family:var(--font-fustat)] sm:text-base md:max-w-4xl">
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
