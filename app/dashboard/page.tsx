import { auth } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import { ArrowDown, FilePlus2, Star } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-black [font-family:var(--font-schibsted-grotesk)]">
      <div className="absolute inset-0 -z-20 overflow-hidden bg-[#f8f8f8]">
        <video
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute left-1/2 top-0 h-[115%] w-[115%] -translate-x-1/2 object-cover object-top"
        />
        <div className="absolute inset-0 bg-white/25" />
      </div>

      <header className="mx-auto flex w-full max-w-350 items-center justify-between px-6 py-4 md:px-10 lg:px-30">
        <div className="text-2xl font-semibold tracking-[-1.44px] [font-family:var(--font-schibsted-grotesk)]">
          Chat To PDF
        </div>

        <div className="flex items-center gap-3 [font-family:var(--font-schibsted-grotesk)]">
          <Link href="/pricing" className="text-sm font-medium">
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-black/15 bg-white/90 px-3 py-2 text-sm font-medium"
          >
            My Documents
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black/15 bg-white/90"
            aria-label="Add document"
          >
            <FilePlus2 className="h-4 w-4" />
          </button>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white"
          >
            <Star className="h-4 w-4" />
            Upgrade
          </Link>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 bg-white/90">
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-350 items-center justify-center p-6 md:px-10 lg:px-30">
        <div className="flex h-[62vh] w-full max-w-6xl cursor-pointer flex-col items-center justify-center gap-5 rounded-3xl border-2 border-dashed border-black/25 bg-[rgba(255,255,255,0.72)] p-6 text-center shadow-[0_20px_45px_rgba(0,0,0,0.12)] backdrop-blur-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-black/30 bg-white/85">
            <ArrowDown className="h-7 w-7" />
          </div>
          <p className="text-base [font-family:var(--font-fustat)]">
            Drag n drop some files here, or click to select files
          </p>
        </div>
      </main>
    </div>
  );
}
