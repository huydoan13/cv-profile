"use client";

import { useRef, useState } from "react";
import { profile } from "@/data/cv";
import { useReveal } from "@/lib/useReveal";

/** The abyss: the bottom of the dive, lit only by bioluminescence. */
export default function Abyss() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  useReveal(root);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section ref={root} id="contact" data-depth="4200" className="relative flex min-h-svh flex-col justify-between px-5 pb-6 pt-32 md:px-10 md:pb-8 lg:px-16">
      <p className="reveal label !text-white/60">05 · The abyss · 4,200 m</p>

      <div className="max-w-5xl">
        <h2 className="reveal font-display text-[13vw] font-bold leading-[0.88] tracking-[-0.05em] md:text-[8vw]">
          Still swimming.
          <br />
          <span className="text-glow text-accent">Let&apos;s go deeper</span>
          <br />
          together.
        </h2>
        <p className="reveal mt-8 max-w-xl text-lg text-fg/75">
          Looking for a frontend engineer who owns features end to end? Say hi.
        </p>

        <div className="reveal mt-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <button onClick={copy} className="group w-fit text-left">
            <span className="label block">{copied ? "Copied to clipboard ✓" : "Email · click to copy"}</span>
            <span className="relative mt-2 block font-display text-[4.9vw] font-medium tracking-tight [overflow-wrap:anywhere] sm:text-3xl lg:text-4xl">
              {profile.email}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
            </span>
          </button>
          <div className="flex flex-wrap gap-3">
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="glass rounded-full px-6 py-3.5 text-sm font-medium transition hover:bg-white/10">
              LinkedIn ↗
            </a>
            <a href={profile.cvUrl} download className="rounded-full bg-accent-2 px-6 py-3.5 text-sm font-semibold text-bg shadow-[0_0_40px_rgba(255,176,107,0.45)] transition hover:bg-white">
              Download CV ↓
            </a>
          </div>
        </div>
      </div>

      <footer className="mt-24 flex flex-col gap-2 border-t border-line pt-5 font-mono text-[11px] uppercase tracking-wider text-fg/50 md:flex-row md:justify-between">
        <span>© 2026 {profile.fullName}</span>
        <span>{profile.location}</span>
        <a href="#top" className="hover:text-fg">Back to the surface ↑</a>
      </footer>
    </section>
  );
}
