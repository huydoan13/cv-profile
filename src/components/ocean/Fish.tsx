"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { fish, subscribeDepth } from "@/lib/depth";
import { FishDefs, FORMS, STAGES } from "./FishForms";

const VB_W = 168;
const VB_H = 96;
const W = 124; // rendered width at scale 1
const H = (W * VB_H) / VB_W;
const THRESHOLDS = [150, 600, 1800]; // metres where the fish evolves
const HYST = 12;

type Part = { el: SVGGElement; cx: number; cy: number };

function stageFor(depth: number, current: number) {
  let s = current;
  while (s < THRESHOLDS.length && depth > THRESHOLDS[s] + HYST) s++;
  while (s > 0 && depth < THRESHOLDS[s - 1] - HYST) s--;
  return s;
}

/**
 * The fish. It follows the pointer (or wanders on touch), grows with the scroll and evolves
 * through four life stages as it dives: fry → juvenile → adult → luminous deep-sea form.
 */
export default function Fish() {
  const root = useRef<HTMLDivElement>(null);
  const flip = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const toast = useRef<HTMLDivElement>(null);
  const toastName = useRef<HTMLSpanElement>(null);
  const toastLine = useRef<HTMLSpanElement>(null);
  const forms = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const pointer = { x: 0, y: 0, active: false, last: 0 };
    const onMove = (e: PointerEvent) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; pointer.last = performance.now(); };
    if (fine) window.addEventListener("pointermove", onMove);

    const parts = (sel: string) =>
      forms.current.flatMap((f) =>
        Array.from(f!.querySelectorAll<SVGGElement>(`[${sel}]`)).map((el) => {
          const [cx, cy] = el.getAttribute(sel)!.split(" ").map(Number);
          return { el, cx, cy } as Part;
        }),
      );
    const tails = parts("data-tail");
    const fins = parts("data-fin");
    const lures = parts("data-lure");
    const eyes = parts("data-eye");

    // Start above the surface and drop in
    fish.x = window.innerWidth * 0.7;
    fish.y = -120;
    let rot = 0;
    let tailPhase = 0;
    let stage = -1;
    let blinkUntil = 0;
    let nextBlink = performance.now() + 2500;
    let toastTl: gsap.core.Timeline | null = null;

    const evolve = (next: number, animate: boolean) => {
      const prev = stage;
      stage = next;
      fish.stage = next;
      forms.current.forEach((f, i) => {
        if (i !== next && i !== prev) gsap.set(f, { autoAlpha: 0 });
      });
      gsap.to(glow.current, { opacity: next === 3 ? 1 : next === 2 ? 0.35 : 0, duration: 1.2 });
      if (!animate || prev < 0 || reduce) {
        if (prev >= 0) gsap.set(forms.current[prev], { autoAlpha: 0 });
        gsap.set(forms.current[next], { autoAlpha: 1, scale: 1, filter: "blur(0px)" });
        return;
      }
      const deeper = next > prev;
      gsap.to(forms.current[prev], { autoAlpha: 0, scale: deeper ? 0.55 : 1.3, filter: "blur(6px)", duration: 0.45, ease: "power2.in" });
      gsap.fromTo(
        forms.current[next],
        { autoAlpha: 0, scale: deeper ? 1.7 : 0.6, filter: "blur(10px)" },
        { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.1, delay: 0.2, ease: "elastic.out(1, 0.5)" },
      );
      if (!deeper) return;
      fish.burstAt = performance.now();
      gsap.fromTo(ring.current, { scale: 0.2, opacity: 1 }, { scale: 3.4, opacity: 0, duration: 1.2, ease: "expo.out", delay: 0.15 });
      toastName.current!.textContent = STAGES[next].name;
      toastLine.current!.textContent = STAGES[next].line;
      toastTl?.kill();
      toastTl = gsap.timeline()
        .fromTo(toast.current, { autoAlpha: 0, y: 14, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(2)", delay: 0.25 })
        .to(toast.current, { autoAlpha: 0, y: -10, duration: 0.5, ease: "power2.in" }, "+=2.2");
    };

    const unsub = subscribeDepth((s) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = vw < 768;
      const idle = !pointer.active || performance.now() - pointer.last > 4000;

      const nextStage = stageFor(s.depth, Math.max(0, stage));
      if (nextStage !== stage) evolve(nextStage, stage >= 0);

      // Grows steadily for the whole dive
      fish.scale = mobile ? 0.42 + s.scroll * 1.0 : 0.45 + s.scroll * 1.75;
      const half = (W / 2) * fish.scale;
      fish.halfWidth = half;

      // Where the fish wants to be
      let tx: number, ty: number;
      if (!idle && !reduce) {
        tx = pointer.x - 60 - half * 0.3;
        ty = pointer.y + 40 + half * 0.2;
      } else {
        tx = vw * (mobile ? 0.7 : 0.76) + Math.sin(s.t * 0.35) * vw * (mobile ? 0.1 : 0.09);
        ty = vh * (mobile ? 0.8 : 0.6) + Math.sin(s.t * 0.8) * 22;
      }
      ty += Math.max(-80, Math.min(80, s.velocity * 2)); // pushed by the dive
      tx = Math.max(half, Math.min(vw - half, tx));
      ty = Math.max(80 + half * 0.4, Math.min(vh - 30 - half * 0.5, ty));

      const k = reduce ? 1 : 0.035;
      const dx = (tx - fish.x) * k;
      const dy = (ty - fish.y) * k;
      fish.x += dx;
      fish.y += dy;
      if (Math.abs(dx) > 0.35) fish.facing = dx > 0 ? 1 : -1;

      const speed = Math.hypot(dx, dy) + Math.abs(s.velocity) * 0.2;
      const targetRot = Math.max(-35, Math.min(35, (dy * 3 + s.velocity * 0.6) * fish.facing));
      rot += (targetRot - rot) * 0.08;

      // Swimming motion for every form's moving parts
      tailPhase += reduce ? 0 : 0.12 + Math.min(0.5, speed * 0.04);
      const tailA = Math.sin(tailPhase) * 22;
      const finA = Math.sin(tailPhase + 1) * 14;
      const lureA = Math.sin(s.t * 1.6) * 9;
      const now = performance.now();
      if (now > nextBlink) { blinkUntil = now + 130; nextBlink = now + 2500 + Math.random() * 3000; }
      const eyeS = now < blinkUntil ? 0.1 : 1;
      for (const p of tails) p.el.setAttribute("transform", `rotate(${tailA} ${p.cx} ${p.cy})`);
      for (const p of fins) p.el.setAttribute("transform", `rotate(${finA} ${p.cx} ${p.cy})`);
      for (const p of lures) p.el.setAttribute("transform", `rotate(${lureA} ${p.cx} ${p.cy})`);
      for (const p of eyes) p.el.setAttribute("transform", `translate(${p.cx} ${p.cy}) scale(1 ${eyeS}) translate(${-p.cx} ${-p.cy})`);

      root.current!.style.transform = `translate(${fish.x - W / 2}px, ${fish.y - H / 2}px) rotate(${rot}deg) scale(${fish.scale})`;
      flip.current!.style.transform = `scaleX(${fish.facing})`;
      toast.current!.style.left = `${fish.x}px`;
      toast.current!.style.top = `${fish.y - H * fish.scale * 0.5 - 34}px`;
    });

    return () => { unsub(); toastTl?.kill(); window.removeEventListener("pointermove", onMove); };
  }, []);

  return (
    <>
      <div ref={root} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[5] will-change-transform" style={{ width: W, height: H, transform: "translate(-300px,-300px)" }}>
        <div ref={glow} className="absolute -inset-[60%] rounded-full opacity-0" style={{ background: "radial-gradient(circle, rgba(127,246,255,0.35) 0%, rgba(95,212,244,0.12) 35%, transparent 65%)" }} />
        <div ref={ring} className="absolute left-1/2 top-1/2 -ml-[60px] -mt-[60px] h-[120px] w-[120px] rounded-full border-2 border-white/80 opacity-0 shadow-[0_0_30px_rgba(255,255,255,0.8),inset_0_0_20px_rgba(127,246,255,0.6)]" />
        <div ref={flip} className="relative h-full w-full transition-transform duration-300">
          {FORMS.map((Form, i) => (
            <div key={i} ref={(el) => { forms.current[i] = el; }} className="absolute inset-0 opacity-0" style={{ visibility: "hidden" }}>
              <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" overflow="visible" className={i < 3 ? "drop-shadow-[0_6px_14px_rgba(0,20,40,0.35)]" : ""}>
                {i === 0 && <FishDefs />}
                <Form />
              </svg>
            </div>
          ))}
        </div>
      </div>
      <div
        ref={toast}
        aria-hidden
        className="pointer-events-none fixed z-30 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full px-4 py-2 text-center opacity-0 glass"
        style={{ left: -999, top: -999, visibility: "hidden" }}
      >
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-accent-2">✦ Evolved · <span ref={toastName} /></span>
        <span ref={toastLine} className="block text-xs text-fg/85" />
      </div>
    </>
  );
}
