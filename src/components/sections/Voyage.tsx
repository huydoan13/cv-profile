"use client";

import { useRef } from "react";
import { journey } from "@/data/cv";
import { formatDepth } from "@/lib/depth";
import { useReveal } from "@/lib/useReveal";
import Scenery from "./Scenery";

/** The dive itself: each stage of the career is a deeper layer of the ocean. */
export default function Voyage() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} id="voyage" className="relative">
      <div className="px-5 pt-24 md:px-10 lg:px-16">
        <p className="reveal label !text-white/75">02 · The dive</p>
        <h2 className="reveal mt-5 max-w-4xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-6xl">
          Every stage of my career took me a little <span className="text-accent-2">deeper</span>.
        </h2>
      </div>

      {journey.map((c, i) => (
        <article key={i} data-depth={c.depth} className="relative flex min-h-[95svh] items-center overflow-hidden px-5 pb-[42svh] pt-24 md:px-10 lg:px-16 lg:pb-24">
          <Scenery kind={c.scenery} />
          <div className="relative max-w-xl md:max-w-2xl">
            <p className="reveal flex items-center gap-3 font-mono text-sm">
              <span className="rounded-full bg-accent-2 px-2.5 py-1 font-semibold text-bg">−{formatDepth(c.depth)}</span>
              <span className="uppercase tracking-wider text-fg/80">{c.zone}</span>
            </p>
            <h3 className="reveal mt-6 font-display text-5xl font-bold leading-[0.95] tracking-[-0.04em] md:text-7xl">
              {c.title}
              <br />
              <span className="text-accent-2">{c.accent}</span>
            </h3>
            <p className="reveal mt-6 font-mono text-xs uppercase tracking-wider text-accent">
              {c.kicker} · {c.period}
            </p>
            <p className="reveal mt-3 text-lg leading-relaxed text-fg/85 md:text-xl">{c.body}</p>
            <div className="reveal mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-2 text-sm font-medium">{c.place}</span>
              {c.tags.map((t) => (
                <span key={t} className="glass rounded-full px-3 py-1 text-xs text-fg/85">{t}</span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
