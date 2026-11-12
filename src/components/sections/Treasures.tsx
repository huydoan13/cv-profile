"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { projects, type DemoKind, type Project } from "@/data/cv";
import { useReveal } from "@/lib/useReveal";
import BookingDemo from "../demos/BookingDemo";
import ChatDemo from "../demos/ChatDemo";
import VoiceDemo from "../demos/VoiceDemo";
import SectionsDemo from "../demos/SectionsDemo";

const demos: Record<DemoKind, () => React.JSX.Element> = {
  booking: BookingDemo,
  chat: ChatDemo,
  voice: VoiceDemo,
  sections: SectionsDemo,
};

type Lenisish = { stop: () => void; start: () => void };

function DemoModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const Demo = demos[project.demo];
  const close = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenisish }).__lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} live demo`}
      data-lenis-prevent
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#010812]/70 p-3 backdrop-blur-md md:p-8"
      onClick={onClose}
    >
      <div className="flex h-[min(680px,90svh)] w-full max-w-3xl flex-col gap-3 animate-[pop_.35s_cubic-bezier(.2,.9,.3,1.2)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="label">{project.name} · live demo</p>
            <p className="text-lg font-semibold">{project.demoLabel}</p>
          </div>
          <button ref={close} onClick={onClose} className="glass rounded-full px-4 py-2 text-sm hover:bg-white/10" aria-label="Close demo">
            Close ✕
          </button>
        </div>
        <div className="min-h-0 flex-1">
          <Demo />
        </div>
      </div>
      <style>{`@keyframes pop{from{opacity:0;transform:translateY(30px) scale(.96)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

/** Work: the treasures found on the way down. Each card can open a working replica of a feature I built. */
export default function Treasures() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<Project | null>(null);
  const closeDemo = useCallback(() => setOpen(null), []);
  useReveal(root);

  return (
    <section ref={root} id="work" data-depth="3000" className="relative px-5 py-32 md:px-10 md:py-40 lg:px-16">
      <p className="reveal label !text-white/75">03 · Treasures from the dive</p>
      <h2 className="reveal mt-5 max-w-4xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-6xl">
        Things I built down here. <span className="text-accent-2">Try them.</span>
      </h2>
      <p className="reveal mt-5 max-w-xl text-lg text-fg/75">
        Each project comes with a small working replica of a feature I shipped.
      </p>

      <div className="mt-16 grid gap-5 lg:grid-cols-2">
        {projects.map((p, i) => {
          const Demo = demos[p.demo];
          return (
            <article key={p.id} className="reveal glass group flex flex-col overflow-hidden rounded-[28px]" data-delay={(i % 2) * 0.1}>
              <div className="relative h-60 overflow-hidden border-b border-line md:h-72">
                <div inert aria-hidden className="pointer-events-none absolute left-6 top-6 h-[170%] w-[150%] origin-top-left scale-[0.6] transition-transform duration-700 group-hover:scale-[0.63]">
                  <Demo />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/10 to-transparent" />
                <button
                  onClick={() => setOpen(p)}
                  aria-label={`Open ${p.name} live demo`}
                  className="absolute inset-0 flex items-end p-5"
                >
                  <span className="flex items-center gap-2 rounded-full bg-accent-2 px-4 py-2 text-sm font-semibold text-bg shadow-lg transition group-hover:translate-x-1">
                    ▶ Try it live
                  </span>
                </button>
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="label">{p.role}</span>
                  <span className="label">{p.period}</span>
                </div>
                <h3 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em] md:text-4xl">{p.name}</h3>
                <p className="mt-1 text-accent">{p.tagline}</p>
                <ul className="mt-4 space-y-2 text-sm text-fg/85">
                  {p.points.map((pt) => (
                    <li key={pt.title} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2" />
                      <span><span className="font-semibold text-fg">{pt.title}.</span> {pt.body}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-6">
                  {p.stack.slice(0, 5).map((s) => (
                    <span key={s} className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-fg/75">{s}</span>
                  ))}
                  {p.link && (
                    <a href={p.link.href} target="_blank" rel="noreferrer" className="ml-auto font-mono text-xs text-accent-2 underline-offset-4 hover:underline">
                      {p.link.label} ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {open && <DemoModal project={open} onClose={closeDemo} />}
    </section>
  );
}
