"use client";

import { useEffect, useRef } from "react";
import { fish, subscribeDepth } from "@/lib/depth";

const W = 96; // rendered width at scale 1

/** The little fish. It follows the pointer (or wanders on touch), dives with the scroll and grows as it goes deeper. */
export default function Fish() {
  const root = useRef<HTMLDivElement>(null);
  const flip = useRef<HTMLDivElement>(null);
  const tail = useRef<SVGGElement>(null);
  const fin = useRef<SVGPathElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const pointer = { x: 0, y: 0, active: false, last: 0 };
    const onMove = (e: PointerEvent) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; pointer.last = performance.now(); };
    if (fine) window.addEventListener("pointermove", onMove);

    // Start above the surface and drop in
    fish.x = window.innerWidth * 0.7;
    fish.y = -120;
    let rot = 0;
    let tailPhase = 0;

    const unsub = subscribeDepth((s) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = vw < 768;
      const idle = !pointer.active || performance.now() - pointer.last > 4000;

      // Where the fish wants to be
      let tx: number, ty: number;
      if (!idle && !reduce) {
        tx = pointer.x - 60;
        ty = pointer.y + 40;
      } else {
        tx = vw * (mobile ? 0.72 : 0.78) + Math.sin(s.t * 0.35) * vw * (mobile ? 0.12 : 0.1);
        ty = vh * (mobile ? 0.8 : 0.58) + Math.sin(s.t * 0.8) * 22;
      }
      ty += Math.max(-80, Math.min(80, s.velocity * 2)); // pushed by the dive
      const half = (W / 2) * fish.scale; // keep the whole fish on screen as it grows
      tx = Math.max(half, Math.min(vw - half, tx));
      ty = Math.max(70 + half * 0.4, Math.min(vh - 30 - half * 0.6, ty));

      const k = reduce ? 1 : 0.035;
      const dx = (tx - fish.x) * k;
      const dy = (ty - fish.y) * k;
      fish.x += dx;
      fish.y += dy;
      if (Math.abs(dx) > 0.35) fish.facing = dx > 0 ? 1 : -1;

      const speed = Math.hypot(dx, dy) + Math.abs(s.velocity) * 0.2;
      const targetRot = Math.max(-35, Math.min(35, (dy * 3 + s.velocity * 0.6) * fish.facing));
      rot += (targetRot - rot) * 0.08;
      // Grows steadily for the whole dive: a tiny fry at the surface, a big fish in the abyss
      const growth = s.scroll; // tied to scroll position so it grows a little with every section
      fish.scale = mobile ? 0.45 + growth * 1.15 : 0.5 + growth * 2.1;

      tailPhase += reduce ? 0 : 0.12 + Math.min(0.5, speed * 0.04);
      tail.current!.setAttribute("transform", `rotate(${Math.sin(tailPhase) * 22} 26 36)`);
      fin.current!.setAttribute("transform", `rotate(${Math.sin(tailPhase + 1) * 14} 66 44)`);

      root.current!.style.transform = `translate(${fish.x - W / 2}px, ${fish.y - 30}px) rotate(${rot}deg) scale(${fish.scale})`;
      flip.current!.style.transform = `scaleX(${fish.facing})`;
      glow.current!.style.opacity = String(Math.min(1, Math.max(0, (s.depth - 1200) / 1500)));
    });

    return () => { unsub(); window.removeEventListener("pointermove", onMove); };
  }, []);

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[5] will-change-transform" style={{ width: W, transform: "translate(-200px,-200px)" }}>
      <div ref={glow} className="absolute -inset-16 rounded-full opacity-0" style={{ background: "radial-gradient(circle, rgba(255,190,120,0.45) 0%, rgba(95,212,244,0.12) 40%, transparent 70%)" }} />
      <div ref={flip} className="relative transition-transform duration-300">
        <svg viewBox="0 0 120 72" width={W} className="drop-shadow-[0_6px_14px_rgba(0,20,40,0.35)]">
          <defs>
            <linearGradient id="fish-body" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#ff9a5a" />
              <stop offset="0.6" stopColor="#ffb86b" />
              <stop offset="1" stopColor="#ffd58a" />
            </linearGradient>
            <linearGradient id="fish-fin" x1="0" x2="1">
              <stop offset="0" stopColor="#ff7a4d" />
              <stop offset="1" stopColor="#ffa86a" />
            </linearGradient>
          </defs>
          <g ref={tail}>
            <path d="M28,36 C18,26 10,16 2,12 C7,26 7,46 2,60 C10,56 18,46 28,36 Z" fill="url(#fish-fin)" />
          </g>
          <path d="M48,16 C56,2 74,2 82,16 Z" fill="url(#fish-fin)" />
          <path d="M22,36 C32,12 74,6 100,26 C110,33 110,41 100,48 C74,66 32,60 22,36 Z" fill="url(#fish-body)" />
          <path d="M52,13 C46,24 46,48 52,59" stroke="#fff6ea" strokeWidth="5" fill="none" opacity="0.9" strokeLinecap="round" />
          <path d="M36,40 C50,52 78,54 98,46" stroke="#ffe7c2" strokeWidth="3" fill="none" opacity="0.7" strokeLinecap="round" />
          <path ref={fin} d="M66,44 C62,54 54,58 48,58 C54,50 58,46 66,44 Z" fill="url(#fish-fin)" />
          <circle cx="88" cy="31" r="6.5" fill="#fff" />
          <circle cx="89.5" cy="31.5" r="3.6" fill="#0b1a2b" />
          <circle cx="91" cy="29.8" r="1.3" fill="#fff" />
          <ellipse cx="86" cy="42" rx="4" ry="2.2" fill="#ff8a7a" opacity="0.55" />
          <path d="M101,38 C103,39 103,41 101,42" stroke="#7a3a1e" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
