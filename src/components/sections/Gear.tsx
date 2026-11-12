"use client";

import { useRef } from "react";
import { certifications, education, languages, skills } from "@/data/cv";
import { useReveal } from "@/lib/useReveal";

/** What the fish carries: skills, education and certificates. */
export default function Gear() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} id="gear" data-depth="3500" className="relative px-5 py-32 md:px-10 md:py-40 lg:px-16">
      <p className="reveal label !text-white/75">04 · What I carry</p>
      <h2 className="reveal mt-5 max-w-4xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-6xl">
        The gear for <span className="text-accent-2">deep water</span>.
      </h2>

      <div className="mt-14 grid gap-3 md:grid-cols-2 md:gap-4">
        {skills.map((g, i) => (
          <div key={g.group} className={`reveal glass rounded-3xl p-6 ${i === 0 ? "md:col-span-2" : ""}`} data-delay={(i % 2) * 0.08}>
            <h3 className="text-xl font-semibold tracking-tight">{g.group}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {g.items.map((it) => (
                <li key={it} className="rounded-full border border-line bg-white/5 px-3.5 py-1.5 text-sm transition hover:-translate-y-0.5 hover:border-accent-2 hover:bg-accent-2 hover:text-bg">
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="reveal glass rounded-3xl p-6" data-delay="0.08">
          <h3 className="text-xl font-semibold tracking-tight">Languages</h3>
          <ul className="mt-4 space-y-1.5 text-fg/80">{languages.map((l) => <li key={l}>{l}</li>)}</ul>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-4">
        <div className="reveal glass rounded-3xl p-6">
          <h3 className="text-xl font-semibold tracking-tight">Education</h3>
          {education.map((e) => (
            <div key={e.school} className="mt-4 border-t border-line pt-4">
              <p className="font-mono text-xs text-fg/60">{e.period}</p>
              <p className="mt-1 font-medium">{e.school}</p>
              <p className="text-sm text-fg/70">{e.detail}</p>
            </div>
          ))}
        </div>
        <div className="reveal glass rounded-3xl p-6" data-delay="0.08">
          <h3 className="text-xl font-semibold tracking-tight">Certifications</h3>
          <ul className="mt-2">
            {certifications.map((c) => (
              <li key={c.name} className="flex items-baseline justify-between gap-4 border-t border-line py-3 first:border-0">
                <span className="font-medium">{c.name}</span>
                <span className="shrink-0 font-mono text-xs text-fg/60">{c.issuer}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
