"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { impact, profile } from "@/data/cv";
import { useReveal } from "@/lib/useReveal";

gsap.registerPlugin(ScrollTrigger);

/** The shallows: who I am, in a bento of glass panels. */
export default function Shallows() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".count").forEach((el) => {
        const end = Number(el.dataset.value);
        if (reduce) { el.textContent = String(end); return; }
        const o = { v: 0 };
        ScrollTrigger.create({
          trigger: el, start: "top 90%", once: true,
          onEnter: () => gsap.to(o, { v: end, duration: 1.8, ease: "power3.out", onUpdate: () => { el.textContent = String(Math.round(o.v)); } }),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="about" data-depth="20" className="relative px-5 py-28 md:px-10 md:py-40 lg:px-16">
      <div className="max-w-6xl">
        <p className="reveal label !text-white/75">01 · The shallows · who&apos;s swimming</p>
        <h2 className="reveal mt-5 max-w-4xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-6xl">
          I turn messy business rules into interfaces that feel <span className="text-accent-2">simple</span>.
        </h2>
        <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-fg/85">{profile.summary}</p>

        <div className="mt-14 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {impact.map((it, i) => (
            <div key={i} className="reveal glass flex flex-col justify-between rounded-3xl p-5 md:p-6" data-delay={i * 0.08}>
              <p className="font-display text-4xl font-bold tracking-[-0.04em] md:text-5xl xl:text-6xl">
                <span className="text-[0.55em] font-medium text-fg/70">{it.prefix}</span>
                <span className="count tabular-nums" data-value={it.value}>0</span>
                <span className="text-accent-2">{it.suffix}</span>
              </p>
              <p className="mt-4 text-sm leading-snug text-fg/75">{it.label}</p>
            </div>
          ))}
          <div className="reveal glass col-span-2 rounded-3xl p-5 md:p-6">
            <p className="label">Currently</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Founding developer at Pebbles</p>
            <p className="mt-1 text-fg/70">Software Engineer at Eastplayers · Ho Chi Minh City</p>
          </div>
          <div className="reveal glass col-span-2 rounded-3xl p-5 md:p-6" data-delay="0.08">
            <p className="label">How I work</p>
            <p className="mt-2 text-lg leading-snug text-fg/85">
              Own features end to end, from the API to every app that uses it. Use Cursor and Claude Code daily to ship faster.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
