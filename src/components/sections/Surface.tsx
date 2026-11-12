"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { profile } from "@/data/cv";

/** The surface: where the little fish first drops into the water. */
export default function Surface() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".s-in", { y: 40, autoAlpha: 0, filter: "blur(10px)", stagger: 0.12, duration: 1.4, ease: "expo.out", delay: 0.3 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="top" data-depth="0" className="relative flex min-h-svh flex-col justify-end overflow-hidden px-5 pb-20 pt-28 md:px-10 md:pb-24 lg:px-16">
      {/* The water surface, seen from just below */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 overflow-hidden opacity-70">
        {[0, 1].map((i) => (
          <svg
            key={i}
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            className="absolute top-0 h-16 w-[200%]"
            style={{ animation: `surface-wave ${14 + i * 6}s linear infinite`, opacity: i ? 0.5 : 0.9, top: i * 10 }}
          >
            <path
              d="M0,30 C120,10 240,50 360,30 C480,10 600,50 720,30 C840,10 960,50 1080,30 C1200,10 1320,50 1440,30 V0 H0 Z"
              fill="rgba(255,255,255,0.28)"
              transform="scale(0.5 1)"
            />
            <path
              d="M1440,30 C1560,10 1680,50 1800,30 C1920,10 2040,50 2160,30 C2280,10 2400,50 2520,30 C2640,10 2760,50 2880,30 V0 H1440 Z"
              fill="rgba(255,255,255,0.28)"
              transform="scale(0.5 1)"
            />
          </svg>
        ))}
      </div>

      <div className="relative max-w-5xl">
        <p className="s-in label flex items-center gap-2 !text-white/80">
          <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-accent-2" />
          Depth 0 m · {profile.location}
        </p>
        <p className="s-in mt-6 font-mono text-sm text-white/85 md:text-base">Hi, I&apos;m</p>
        <h1 className="s-in font-display text-[16vw] font-bold leading-[0.85] tracking-[-0.05em] text-white drop-shadow-[0_4px_30px_rgba(0,40,70,0.35)] md:text-[10.5vw]">
          Doan Nguyen
          <br />
          Quoc Huy<span className="text-accent-2">.</span>
        </h1>
        <p className="s-in mt-8 max-w-xl text-xl leading-snug text-white/90 md:text-2xl">
          A small fish swimming toward the open ocean. Frontend engineer building React &amp; Next.js products people actually use.
        </p>
        <div className="s-in mt-10 flex flex-wrap items-center gap-3">
          <a href="#voyage" className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#0b4f74] transition hover:bg-accent-2 hover:text-bg">
            Follow the dive ↓
          </a>
          <a href="#work" className="rounded-full border border-white/40 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10">
            See my work
          </a>
          <a href={profile.cvUrl} download className="px-3 py-3.5 text-sm font-semibold text-white/85 underline-offset-4 hover:underline">
            Download CV
          </a>
        </div>
      </div>
    </section>
  );
}
