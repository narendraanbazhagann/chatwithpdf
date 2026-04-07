"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

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

function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const restartTimeoutRef = useRef<number | null>(null);
  const opacityRef = useRef(0);
  const fadingOutRef = useRef(false);
  const [opacity, setOpacity] = useState(0);

  const cancelRunningFade = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const setImmediateOpacity = useCallback(
    (value: number) => {
      cancelRunningFade();
      opacityRef.current = value;
      setOpacity(value);
    },
    [cancelRunningFade],
  );

  const animateOpacity = useCallback(
    (target: number, duration: number, onDone?: () => void) => {
      cancelRunningFade();

      const startValue = opacityRef.current;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const nextValue = startValue + (target - startValue) * progress;

        opacityRef.current = nextValue;
        setOpacity(nextValue);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        rafRef.current = null;
        onDone?.();
      };

      rafRef.current = requestAnimationFrame(tick);
    },
    [cancelRunningFade],
  );

  const startFadeIn = useCallback(() => {
    fadingOutRef.current = false;
    animateOpacity(1, 250);
  }, [animateOpacity]);

  const triggerFadeOutIfNeeded = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.duration <= 0 || fadingOutRef.current) {
      return;
    }

    const remaining = video.duration - video.currentTime;
    if (remaining <= 0.55) {
      fadingOutRef.current = true;
      animateOpacity(0, 250);
    }
  }, [animateOpacity]);

  const restartLoop = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    setImmediateOpacity(0);

    restartTimeoutRef.current = window.setTimeout(() => {
      video.currentTime = 0;
      void video.play();
      startFadeIn();
    }, 100);
  }, [setImmediateOpacity, startFadeIn]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const handleLoaded = () => {
      if (fadeTimeoutRef.current !== null) {
        clearTimeout(fadeTimeoutRef.current);
      }

      fadeTimeoutRef.current = window.setTimeout(() => {
        startFadeIn();
      }, 30);
    };

    const handleTimeUpdate = () => {
      triggerFadeOutIfNeeded();
    };

    const handleEnded = () => {
      restartLoop();
    };

    video.addEventListener("loadeddata", handleLoaded);
    video.addEventListener("play", handleLoaded);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    void video.play().catch(() => {
      // Browser autoplay policies can block initial play if conditions change.
    });

    return () => {
      video.removeEventListener("loadeddata", handleLoaded);
      video.removeEventListener("play", handleLoaded);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);

      cancelRunningFade();

      if (fadeTimeoutRef.current !== null) {
        clearTimeout(fadeTimeoutRef.current);
      }

      if (restartTimeoutRef.current !== null) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, [cancelRunningFade, restartLoop, startFadeIn, triggerFadeOutIfNeeded]);

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden bg-[#f8f8f8]">
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        className="absolute left-1/2 top-0 h-[115%] w-[115%] -translate-x-1/2 object-cover object-top"
        style={{ opacity }}
      />
      <div className="absolute inset-0 bg-white/25" />
    </div>
  );
}

function CreditSearchPanel() {
  return (
    <div className="h-50 w-full max-w-182 rounded-[18px] bg-[rgba(0,0,0,0.24)] p-4 backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 text-xs font-medium text-white [font-family:var(--font-schibsted-grotesk)]">
        <div className="h-5 w-32" aria-hidden="true" />
        <div className="flex items-center gap-1.5 text-white/95">
          <SparkleAiIcon />
          <span>Powered by Delzo Technologies</span>
        </div>
      </div>

      <div className="rounded-xl bg-white p-3 shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
        <div className="flex items-center gap-3">
          <span className="text-[#555555]">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Ask your PDF a question..."
            className="h-11 flex-1 border-none bg-transparent px-1 text-base text-black placeholder:text-[rgba(0,0,0,0.6)] focus:outline-none [font-family:var(--font-noto-sans)]"
          />
            <SignUpButton mode="modal">
              <button
                type="button"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#262626] px-4 text-sm font-medium text-white [font-family:var(--font-schibsted-grotesk)]"
                aria-label="Get started"
              >
                Get Started
                <RightArrowIcon />
              </button>
            </SignUpButton>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs [font-family:var(--font-schibsted-grotesk)]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#f8f8f8] px-2.5 py-1.5 text-[#505050]"
            >
              <AttachIcon />
              Attach PDF
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#f8f8f8] px-2.5 py-1.5 text-[#505050]"
            >
              <VoiceIcon />
              Voice
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#f8f8f8] px-2.5 py-1.5 text-[#505050]"
            >
              <SearchIcon />
              Prompts
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
    <main className="relative min-h-screen overflow-hidden text-black">
      <VideoBackground />

      <div className="relative z-10 px-6 py-4 md:px-10 lg:px-30">
        <nav className="flex items-center justify-between py-4">
          <div className="text-2xl font-semibold tracking-[-1.44px] [font-family:var(--font-schibsted-grotesk)]">
            Chatwithpdf
          </div>

          <div className="hidden items-center md:flex">
            <Show when="signed-out">
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="inline-flex h-10 w-25.25 items-center justify-center rounded-lg border border-black/15 bg-white text-sm font-medium text-black [font-family:var(--font-schibsted-grotesk)]"
                  >
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    type="button"
                    className="inline-flex h-10 w-25.25 items-center justify-center rounded-lg bg-black text-sm font-medium text-white [font-family:var(--font-schibsted-grotesk)]"
                  >
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </nav>

        <div className="mt-15">
          <section className="-mt-12.5 flex min-h-[calc(100vh-140px)] flex-col items-center justify-center text-center">
          <div className="inline-flex items-center overflow-hidden rounded-full bg-white p-1 shadow-[0_8px_20px_rgba(0,0,0,0.09)] [font-family:var(--font-inter)]">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#0e1311] px-3 py-1.5 text-sm text-white">
              <StarIcon />
              New
            </span>
            <span className="px-3 py-1.5 text-sm text-black">
              Chat with your PDF files in seconds
            </span>
          </div>

          <h1 className="mt-8.5 max-w-275 text-5xl font-bold tracking-[-2.2px] text-black [font-family:var(--font-fustat)] sm:text-6xl lg:text-[80px] lg:leading-none lg:tracking-[-4.8px]">
            Transform Your PDFs into Interactive Conversations
          </h1>

          <p className="mt-8.5 w-full max-w-184 px-4 text-lg font-medium tracking-[-0.25px] text-[#505050] [font-family:var(--font-fustat)] lg:w-150 lg:text-[20px] lg:tracking-[-0.4px]">
            Upload your documents, ask questions naturally, and get clear answers powered by a
            streamlined PDF chat experience.
          </p>

          <div className="mt-11 flex w-full justify-center px-4">
            <CreditSearchPanel />
          </div>
          </section>
        </div>
      </div>
    </main>
  );
}
