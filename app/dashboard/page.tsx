import { auth } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import { ArrowDown, FilePlus2, Star } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

import FileUploader from '@/components/FileUploader';
import DocumentList from '@/components/DocumentList';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-black [font-family:var(--font-schibsted-grotesk)]">
      {/* ... existing BG video and header ... */}
      <div className="absolute inset-0 -z-20 overflow-hidden bg-[#f8f8f8]">
        <video
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          className="absolute left-1/2 top-0 h-[115%] w-[115%] -translate-x-1/2 object-cover object-top"
        />
        <div className="absolute inset-0 bg-white/25" />
      </div>

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 md:px-10 lg:px-30">
        <div className="text-xl font-semibold tracking-tight [font-family:var(--font-schibsted-grotesk)] sm:text-2xl sm:tracking-[-1.44px]">
          Chat To PDF
        </div>

        <div className="flex items-center gap-1.5 [font-family:var(--font-schibsted-grotesk)] sm:gap-3">
          <Link href="/" className="text-sm font-medium hover:opacity-70">
            Home
          </Link>
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
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 rounded-lg bg-black px-2 py-1.5 text-xs font-medium text-white sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
          >
            <Star className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Upgrade</span>
          </Link>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white/90 sm:h-10 sm:w-10">
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto min-h-screen w-full max-w-7xl p-4 sm:p-6 md:px-10 lg:px-30 overflow-y-auto space-y-12">
        {/* Prioritized: Your Files on top */}
        <DocumentList userId={userId} />

        {/* Upload area below your files */}
        <div className="flex flex-col items-center justify-center py-10">
           <FileUploader userId={userId} />
        </div>
      </main>
    </div>
  );
}
