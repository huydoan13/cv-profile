"use client";

import { profile } from "@/data/cv";

const links = [
  { href: "#about", label: "About" },
  { href: "#voyage", label: "Journey" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between gap-4 px-5 py-4 md:px-10 md:py-5 lg:px-16">
        <a href="#top" className="flex items-center gap-2 font-display text-base font-bold tracking-tight text-white">
          <svg viewBox="-6 0 30 16" className="w-6" aria-hidden>
            <path d="M2,8 C7,1 17,1 22,8 C17,15 7,15 2,8 Z M2,8 L-5,2 L-5,14 Z" fill="var(--accent-2)" />
          </svg>
          quochuy<span className="text-accent-2">.</span>
        </a>
        <div className="glass hidden items-center gap-1 rounded-full p-1 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-4 py-1.5 text-sm text-white/85 transition hover:bg-white/10 hover:text-white">
              {l.label}
            </a>
          ))}
        </div>
        <a href={profile.cvUrl} download className="glass rounded-full px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15">
          Download CV ↓
        </a>
      </nav>
    </header>
  );
}
