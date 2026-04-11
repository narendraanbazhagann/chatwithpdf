"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import Background from "@/components/Background";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

function UpArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3.25L8 12.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4.75 6.5L8 3.25L11.25 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RightArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.25 7H11.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.75 4L11.75 7L8.75 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1.25L8.52 4.33L11.92 4.82L9.46 7.22L10.04 10.6L7 9L3.96 10.6L4.54 7.22L2.08 4.82L5.48 4.33L7 1.25Z" fill="currentColor" />
    </svg>
  );
}

function SparkleAiIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1.25L7.92 4.08L10.75 5L7.92 5.92L7 8.75L6.08 5.92L3.25 5L6.08 4.08L7 1.25Z" fill="currentColor" />
      <path d="M10.75 7.75L11.27 9.23L12.75 9.75L11.27 10.27L10.75 11.75L10.23 10.27L8.75 9.75L10.23 9.23L10.75 7.75Z" fill="currentColor" />
    </svg>
  );
}

function AttachIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M9.75 4.08L5.12 8.71C4.48 9.35 3.44 9.35 2.8 8.71C2.16 8.07 2.16 7.04 2.8 6.4L7.43 1.77C8.5 0.7 10.24 0.7 11.31 1.77C12.38 2.84 12.38 4.58 11.31 5.65L6.2 10.76C4.71 12.25 2.29 12.25 0.8 10.76" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VoiceIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1.75C5.9 1.75 5 2.65 5 3.75V7C5 8.1 5.9 9 7 9C8.1 9 9 8.1 9 7V3.75C9 2.65 8.1 1.75 7 1.75Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.75 6.75V7C3.75 8.79 5.21 10.25 7 10.25C8.79 10.25 10.25 8.79 10.25 7V6.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M7 10.25V12.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M6.33 10.5C8.63 10.5 10.5 8.63 10.5 6.33C10.5 4.03 8.63 2.17 6.33 2.17C4.03 2.17 2.17 4.03 2.17 6.33C2.17 8.63 4.03 10.5 6.33 10.5Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9.3 9.3L11.83 11.83" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// VideoBackground logic removed and replaced by shared Background component


function CreditSearchPanel() {
  return (
    <div className="w-full max-w-182 rounded-[18px] bg-[rgba(0,0,0,0.24)] p-4 backdrop-blur-md transition-all duration-300">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 text-xs font-medium text-white [font-family:var(--font-schibsted-grotesk)]">
        <div className="hidden h-5 w-32 md:block" aria-hidden="true" />
        <div className="flex items-center gap-1.5 text-white/95">
          <SparkleAiIcon />
          <span>Powered by Delzo Technologies</span>
        </div>
      </div>

      <div className="rounded-xl bg-white p-3 shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
        <div className="flex items-center gap-2 md:gap-3">
          <span className="shrink-0 text-[#555555]">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Ask your PDF..."
            className="h-10 flex-1 border-none bg-transparent px-1 text-sm text-black placeholder:text-[rgba(0,0,0,0.6)] focus:outline-none [font-family:var(--font-noto-sans)] md:h-11 md:text-base"
          />
          <Show when="signed-out">
            <SignUpButton mode="modal">
              <button
                type="button"
                className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full bg-[#262626] px-3 text-xs font-medium text-white [font-family:var(--font-schibsted-grotesk)] transition-transform active:scale-95 md:gap-1.5 md:px-4 md:text-sm"
                aria-label="Get started"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
                <RightArrowIcon />
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link href="/dashboard">
              <button
                type="button"
                className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full bg-[#262626] px-3 text-xs font-medium text-white [font-family:var(--font-schibsted-grotesk)] transition-transform active:scale-95 md:gap-1.5 md:px-4 md:text-sm"
                aria-label="Go to dashboard"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
                <RightArrowIcon />
              </button>
            </Link>
          </Show>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs [font-family:var(--font-schibsted-grotesk)]">
          <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md bg-[#f8f8f8] px-2 py-1.5 text-[#505050] transition-colors hover:bg-black/5 md:gap-1.5 md:px-2.5"
            >
              <AttachIcon />
              <span className="hidden xs:inline">Attach PDF</span>
              <span className="xs:hidden">PDF</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md bg-[#f8f8f8] px-2 py-1.5 text-[#505050] transition-colors hover:bg-black/5 md:gap-1.5 md:px-2.5"
            >
              <VoiceIcon />
              <span className="hidden xs:inline">Voice</span>
              <span className="xs:hidden">Mic</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md bg-[#f8f8f8] px-2 py-1.5 text-[#505050] transition-colors hover:bg-black/5 md:gap-1.5 md:px-2.5"
            >
              <SearchIcon />
              <span>Prompts</span>
            </button>
          </div>
          <span className="text-[#707070]">0/3,000</span>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <main className="min-h-screen overflow-y-auto text-black">
      {/* 1. Hero Section with Video Background */}
      <div className="relative isolate min-h-screen">
        <Background />
        
        <div className="relative z-10 px-4 py-4 md:px-10 lg:px-30">
          <nav className="flex items-center justify-between py-4">
            <div className="text-xl font-semibold tracking-[-0.8px] [font-family:var(--font-schibsted-grotesk)] sm:text-2xl sm:tracking-[-1.44px]">
              Chatwithpdf
            </div>

            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm font-medium hover:opacity-70 [font-family:var(--font-schibsted-grotesk)]">
                Home
              </Link>
              <Show when="signed-in">
                <Link href="/dashboard" className="text-sm font-medium hover:opacity-70 [font-family:var(--font-schibsted-grotesk)]">
                  Dashboard
                </Link>
              </Show>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="inline-flex h-9 w-20 items-center justify-center rounded-lg border border-black/15 bg-white text-xs font-medium text-black [font-family:var(--font-schibsted-grotesk)] transition-colors hover:bg-black/5 sm:h-10 sm:w-25.25 sm:text-sm"
                  >
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    type="button"
                    className="inline-flex h-9 w-20 items-center justify-center rounded-lg bg-black text-xs font-medium text-white [font-family:var(--font-schibsted-grotesk)] transition-transform active:scale-95 sm:h-10 sm:w-25.25 sm:text-sm"
                  >
                    Sign Up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </nav>

          <div className="mt-8 sm:mt-15">
            <section className="-mt-12.5 flex min-h-[calc(100vh-140px)] flex-col items-center justify-center text-center">
              <div className="inline-flex max-w-full items-center overflow-hidden rounded-full bg-white p-1 shadow-[0_8px_20px_rgba(0,0,0,0.09)] [font-family:var(--font-inter)]">
                <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[#0e1311] px-2 py-1 text-xs text-white sm:px-3 sm:py-1.5 sm:text-sm">
                  <StarIcon />
                  New
                </span>
                <span className="truncate px-2 py-1 text-[10px] text-black sm:px-3 sm:py-1.5 sm:text-sm">
                  Chat with your PDF files in seconds
                </span>
              </div>

              <h1 className="mt-6 max-w-275 px-2 text-4xl font-bold tracking-tight text-black [font-family:var(--font-fustat)] sm:mt-8.5 sm:text-6xl lg:text-[80px] lg:leading-none lg:tracking-[-4.8px]">
                Transform Your PDFs into Interactive Conversations
              </h1>

              <p className="mt-6 w-full max-w-184 px-6 text-base font-medium tracking-[-0.2px] text-[#505050] [font-family:var(--font-fustat)] sm:mt-8.5 sm:text-lg lg:w-150 lg:text-[20px] lg:tracking-[-0.4px]">
                Upload your documents, ask questions naturally, and get clear answers powered by a
                streamlined PDF chat experience.
              </p>

              <div className="mt-10 flex w-full justify-center px-4 sm:mt-11 pb-20">
                <CreditSearchPanel />
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* 2. Trust Banner (Social Proof) - No Video Background here */}
      <div className="w-full bg-[#fafafa] py-12 border-y border-black/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-[40px] font-bold text-[#262626] [font-family:var(--font-fustat)]">10,000+</div>
            <div className="text-sm font-medium text-[#505050] [font-family:var(--font-inter)]">Pages Processed</div>
          </div>
          <div className="space-y-1 border-y md:border-y-0 md:border-x border-black/5 py-8 md:py-0">
            <div className="text-[40px] font-bold text-[#262626] [font-family:var(--font-fustat)]">5,000+</div>
            <div className="text-sm font-medium text-[#505050] [font-family:var(--font-inter)]">Active Students & Professionals</div>
          </div>
          <div className="space-y-1">
            <div className="text-[40px] font-bold text-[#262626] [font-family:var(--font-fustat)]">100x</div>
            <div className="text-sm font-medium text-[#505050] [font-family:var(--font-inter)]">Faster Research</div>
          </div>
        </div>
      </div>

      {/* 3. How It Works (3-Step Process) */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[14px] font-bold text-purple-600 uppercase tracking-widest [font-family:var(--font-inter)]">Simple Process</span>
            <h2 className="text-4xl md:text-[48px] font-bold text-black [font-family:var(--font-fustat)] leading-tight">From PDF to Conversation in Seconds</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center gap-6">
              <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <AttachIcon />
              </div>
              <div className="space-y-3 px-4">
                <h3 className="text-xl font-bold text-black [font-family:var(--font-fustat)]">1. Drop your PDF</h3>
                <p className="text-[#505050] text-sm leading-relaxed [font-family:var(--font-inter)]">Securely upload any textbook, research paper, or financial report. We support files up to 50MB.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center gap-6">
              <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <SparkleAiIcon />
              </div>
              <div className="space-y-3 px-4">
                <h3 className="text-xl font-bold text-black [font-family:var(--font-fustat)]">2. AI Processing</h3>
                <p className="text-[#505050] text-sm leading-relaxed [font-family:var(--font-inter)]">Powered by Delzo Technologies, our system instantly reads and indexes your entire document.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center gap-6">
              <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <VoiceIcon />
              </div>
              <div className="space-y-3 px-4">
                <h3 className="text-xl font-bold text-black [font-family:var(--font-fustat)]">3. Ask Anything</h3>
                <p className="text-[#505050] text-sm leading-relaxed [font-family:var(--font-inter)]">Start chatting. Ask for summaries, specific data points, or explanations of complex topics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Feature Highlights (Bento Box) */}
      <section className="py-24 px-6 bg-[#f8f8f8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-[48px] font-bold text-black [font-family:var(--font-fustat)]">Everything you need to study smarter.</h2>
            <p className="text-[#505050] text-lg font-medium [font-family:var(--font-inter)]">Built for speed, accuracy, and memory retention.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Large Top Card */}
            <div className="md:col-span-2 bg-white rounded-[16px] p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 flex flex-col gap-4">
              <h3 className="text-2xl md:text-3xl font-bold text-black [font-family:var(--font-fustat)]">Flawless Memory Recall</h3>
              <p className="text-[#505050] text-sm md:text-base leading-relaxed [font-family:var(--font-inter)] max-w-2xl">Our AI doesn't just read; it remembers. Jump back into past conversations weeks later and pick up right where you left off. Every document is securely stored in your personal library.</p>
            </div>

            {/* Bottom Left Card */}
            <div className="bg-white rounded-[16px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 flex flex-col gap-4 text-left">
              <h3 className="text-xl font-bold text-black [font-family:var(--font-fustat)]">Pinpoint Citations</h3>
              <p className="text-[#505050] text-sm leading-relaxed [font-family:var(--font-inter)]">Never guess where an answer came from. Every AI response includes direct references to the exact page in your uploaded PDF.</p>
            </div>

            {/* Bottom Right Card */}
            <div className="bg-white rounded-[16px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 flex flex-col gap-4 text-left">
              <h3 className="text-xl font-bold text-black [font-family:var(--font-fustat)]">Export & Share</h3>
              <p className="text-[#505050] text-sm leading-relaxed [font-family:var(--font-inter)]">Summarized a 100-page report into 5 key points? Export your chat logs to text or Notion with a single click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-black/10 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-black/60">
          <div className="flex flex-col gap-4">
            <div className="text-xl font-semibold text-black">Chatwithpdf</div>
            <p className="text-sm leading-relaxed">
              The world's most intuitive way to talk to your documents. Powered by next-gen AI to save you hours of reading.
            </p>
            <div className="flex gap-4 mt-2">
              <div className="h-5 w-5 bg-black/10 rounded-full" />
              <div className="h-5 w-5 bg-black/10 rounded-full" />
              <div className="h-5 w-5 bg-black/10 rounded-full" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">Product</h3>
            <ul className="flex flex-col gap-2 text-sm font-medium">
              <li className="hover:text-black cursor-pointer">AI PDF Chat</li>
              <li className="hover:text-black cursor-pointer">Data Extraction</li>
              <li className="hover:text-black cursor-pointer">Multi-language</li>
              <li className="hover:text-black cursor-pointer">Pricing</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">Resources</h3>
            <ul className="flex flex-col gap-2 text-sm font-medium">
              <li className="hover:text-black cursor-pointer">Documentation</li>
              <li className="hover:text-black cursor-pointer">Help Center</li>
              <li className="hover:text-black cursor-pointer">API Reference</li>
              <li className="hover:text-black cursor-pointer">Community</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">Legal</h3>
            <ul className="flex flex-col gap-2 text-sm font-medium">
              <li className="hover:text-black cursor-pointer">Privacy Policy</li>
              <li className="hover:text-black cursor-pointer">Terms of Service</li>
              <li className="hover:text-black cursor-pointer">Cookie Policy</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium uppercase tracking-[0.8px]">
          <span>© 2024 Chatwithpdf. All rights reserved.</span>
          <span className="text-black/30">Built by Delzo Technologies</span>
        </div>
      </footer>
    </main>
  );
}
