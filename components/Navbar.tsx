import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Share2, Star } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-100 px-4 h-15 flex items-center justify-between z-50 shadow-sm">
      <div className="flex items-center gap-4">
        <Link 
           href="/dashboard"
           className="text-xl font-bold tracking-tight text-black [font-family:var(--font-schibsted-grotesk)] sm:text-2xl sm:tracking-[-0.04em]"
        >
          Chat To PDF
        </Link>
      </div>

      <div className="flex items-center gap-3 [font-family:var(--font-schibsted-grotesk)]">
        <Link href="/pricing" className="text-sm font-medium text-black/60 hover:text-black hidden md:block">
          Pricing
        </Link>
        <Link 
           href="/dashboard" 
           className="px-3.5 py-2 text-sm font-semibold border border-black/5 rounded-xl hover:bg-gray-50 flex items-center gap-2 transition-colors"
        >
          My Documents
        </Link>
        
        <button className="p-2 border border-blue-100 rounded-lg bg-blue-50/50 text-blue-600 hover:bg-blue-100 transition-colors">
          <Share2 className="h-4 w-4" />
        </button>

        <Link 
          href="/pricing"
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Star className="h-4 w-4 fill-white text-white" />
          <span>PRO Account</span>
        </Link>
        
        <div className="ml-1">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
