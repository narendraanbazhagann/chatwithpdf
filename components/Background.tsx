"use client";

import { useEffect, useState } from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

export default function Background() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none select-none bg-[#fdfdfd]">
      {/* Dynamic Mesh Background */}
      <div className="absolute inset-0 opacity-40">
        <div 
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[120px] mix-blend-multiply animate-pulse" 
          style={{ background: 'radial-gradient(circle, rgba(238,242,255,1) 0%, rgba(199,210,254,0.5) 100%)', animationDuration: '10s' }}
        />
        <div 
          className="absolute top-[10%] right-[-20%] w-[60%] h-[60%] rounded-full blur-[100px] mix-blend-multiply animate-bounce" 
          style={{ background: 'radial-gradient(circle, rgba(245,243,255,1) 0%, rgba(221,214,254,0.4) 100%)', animationDuration: '15s' }}
        />
        <div 
          className="absolute bottom-[-20%] left-[10%] w-[80%] h-[80%] rounded-full blur-[140px] mix-blend-multiply animate-pulse" 
          style={{ background: 'radial-gradient(circle, rgba(236,253,245,1) 0%, rgba(209,250,229,0.3) 100%)', animationDuration: '12s' }}
        />
      </div>

      {/* Video Content */}
      {mounted && (
        <video
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-[0.18] transition-opacity duration-1000"
          onCanPlay={(e) => (e.currentTarget.style.opacity = "0.18")}
        />
      )}

      {/* Surface Overlays */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5" />
      <div className="absolute inset-0 backdrop-blur-[1px]" />
      
      {/* Subtle Grain/Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    </div>
  );
}
