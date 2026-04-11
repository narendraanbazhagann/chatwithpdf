"use client";

import { useEffect, useState } from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

export default function Background({ isHeroOnly = false }: { isHeroOnly?: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use absolute for hero to keep it contained, fixed for dashboard if needed
  const positionClass = isHeroOnly ? "absolute" : "fixed";

  return (
    <div className={`${positionClass} inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-[#f4f7ff]`}>
      {/* Vibrant Mesh Background - More Colorful, Less White */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-[-10%] left-[-5%] w-[80%] h-[80%] rounded-full blur-[100px] mix-blend-multiply animate-pulse" 
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(199,210,254,0) 70%)', animationDuration: '8s' }}
        />
        <div 
          className="absolute top-[5%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[90px] mix-blend-multiply animate-bounce" 
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(221,214,254,0) 70%)', animationDuration: '12s' }}
        />
        <div 
          className="absolute bottom-[-15%] left-[5%] w-[90%] h-[90%] rounded-full blur-[120px] mix-blend-multiply animate-pulse" 
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(209,250,229,0) 70%)', animationDuration: '10s' }}
        />
      </div>

      {/* Video Content with slightly higher opacity for better visibility */}
      {mounted && (
        <video
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-[0.25] transition-opacity duration-700"
        />
      )}

      {/* Subtle overlays to enhance depth without over-whitening */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20" />
      
      {/* Noise remains for texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    </div>
  );
}
