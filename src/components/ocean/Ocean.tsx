"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { fish, subscribeDepth } from "@/lib/depth";

// Water colour by depth: [metres, top colour, bottom colour]
const STOPS: [number, string, string][] = [
  [0, "#2aa8c6", "#0f6f96"],
  [150, "#16829f", "#0a4d72"],
  [600, "#0b3e62", "#072a47"],
  [1500, "#06203b", "#04142b"],
  [3000, "#030b1a", "#020812"],
  [4200, "#01040b", "#000206"],
];

function waterAt(d: number) {
  let i = 0;
  while (i < STOPS.length - 2 && d > STOPS[i + 1][0]) i++;
  const [d0, t0, b0] = STOPS[i];
  const [d1, t1, b1] = STOPS[i + 1];
  const k = Math.min(1, Math.max(0, (d - d0) / (d1 - d0)));
  return [gsap.utils.interpolate(t0, t1, k), gsap.utils.interpolate(b0, b1, k)] as const;
}

type Particle = { x: number; y: number; r: number; vy: number; vx: number; phase: number; kind: "bubble" | "snow" | "glow"; life: number };

/** Fixed backdrop: water gradient, sun rays near the surface and a canvas of bubbles, marine snow and bioluminescence. */
export default function Ocean() {
  const water = useRef<HTMLDivElement>(null);
  const rays = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth; h = window.innerHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const parts: Particle[] = [];
    const spawn = (kind: Particle["kind"], x?: number, y?: number): Particle => ({
      kind,
      x: x ?? Math.random() * w,
      y: y ?? (kind === "bubble" ? h + 10 : Math.random() * h),
      r: kind === "bubble" ? 1.5 + Math.random() * 4 : kind === "snow" ? 0.6 + Math.random() * 1.4 : 1 + Math.random() * 2,
      vy: kind === "bubble" ? -(0.4 + Math.random() * 1.1) : kind === "snow" ? 0.15 + Math.random() * 0.3 : -0.05 + Math.random() * 0.1,
      vx: (Math.random() - 0.5) * 0.2,
      phase: Math.random() * Math.PI * 2,
      life: 1,
    });

    let lastScroll = window.scrollY;
    let fishBubbleAt = 0;

    // Short-lived sparks: evolution bursts and the glowing wake of the deep-sea form
    type Spark = { x: number; y: number; vx: number; vy: number; life: number; decay: number; r: number; rgb: string };
    const sparks: Spark[] = [];
    let lastBurst = 0;

    const unsub = subscribeDepth((s) => {
      const [top, bottom] = waterAt(s.depth);
      water.current!.style.background = `linear-gradient(180deg, ${top} 0%, ${bottom} 100%)`;
      document.documentElement.style.background = bottom;
      rays.current!.style.opacity = String(Math.max(0, 1 - s.depth / 260));

      // Population mix changes with depth
      const want = {
        bubble: Math.round(28 * Math.max(0.15, 1 - s.depth / 1500)),
        snow: Math.round(70 * Math.min(1, s.depth / 400)),
        glow: Math.round(45 * Math.min(1, Math.max(0, (s.depth - 900) / 1500))),
      };
      const count = { bubble: 0, snow: 0, glow: 0 };
      for (const p of parts) count[p.kind]++;
      (Object.keys(want) as Particle["kind"][]).forEach((k) => {
        for (let i = count[k]; i < want[k]; i++) parts.push(spawn(k, undefined, k === "bubble" ? Math.random() * h : undefined));
      });

      // The fish exhales a bubble now and then
      if (fish.x > 0 && s.t - fishBubbleAt > 0.9 + Math.random()) {
        fishBubbleAt = s.t;
        const b = spawn("bubble", fish.x + fish.halfWidth * 0.85 * fish.facing, fish.y - 6);
        b.r = 1.5 + Math.random() * 2.5;
        parts.push(b);
      }

      // Evolution burst: a ring of sparks and a puff of bubbles
      if (fish.burstAt !== lastBurst) {
        lastBurst = fish.burstAt;
        const rgb = fish.stage >= 3 ? "127,246,255" : fish.stage === 2 ? "255,190,120" : "255,236,200";
        for (let i = 0; i < 46; i++) {
          const a = (i / 46) * Math.PI * 2 + Math.random() * 0.2;
          const v = 2.5 + Math.random() * 5;
          sparks.push({ x: fish.x, y: fish.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, decay: 0.012 + Math.random() * 0.012, r: 1.5 + Math.random() * 2.5, rgb });
        }
        for (let i = 0; i < 14; i++) {
          const b = spawn("bubble", fish.x + (Math.random() - 0.5) * fish.halfWidth, fish.y + (Math.random() - 0.5) * 30);
          b.vy = -(1 + Math.random() * 2);
          parts.push(b);
        }
      }
      // Luminous form leaves a glowing wake behind its tail
      if (fish.stage >= 3 && !reduce && fish.x > 0) {
        sparks.push({
          x: fish.x - fish.facing * fish.halfWidth * 0.8 + (Math.random() - 0.5) * 6,
          y: fish.y + (Math.random() - 0.5) * 10,
          vx: -fish.facing * (0.3 + Math.random() * 0.5), vy: (Math.random() - 0.5) * 0.4,
          life: 1, decay: 0.018 + Math.random() * 0.01, r: 1 + Math.random() * 1.8, rgb: Math.random() < 0.2 ? "255,233,168" : "127,246,255",
        });
      }

      const dy = Math.max(-60, Math.min(60, window.scrollY - lastScroll)); // clamp so jumps (anchor links) don't smear particles
      lastScroll = window.scrollY;

      ctx.clearRect(0, 0, w, h);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        if (!reduce) {
          p.phase += 0.03;
          p.x += p.vx + Math.sin(p.phase) * (p.kind === "bubble" ? 0.35 : 0.15);
          p.y += p.vy - dy * (p.kind === "bubble" ? 0.25 : 0.6); // parallax against the scroll
        }
        const off = p.y < -h * 0.35 - 20 || p.y > h * 1.35 + 20 || p.x < -20 || p.x > w + 20; // wide bounds include the respawn band
        const over = count[p.kind] > want[p.kind];
        if (off) {
          if (over) { parts.splice(i, 1); count[p.kind]--; continue; }
          // Respawn just off-screen on the side the water is coming from, spread out so they don't form lines
          const spread = Math.random() * h * 0.3;
          const y = p.kind === "bubble" ? h + 10 + spread : dy > 0 ? h + 10 + spread : -10 - spread;
          Object.assign(p, spawn(p.kind, undefined, y));
        }
        if (p.kind === "bubble") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(220,245,255,0.55)";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(p.x - p.r * 0.35, p.y - p.r * 0.35, p.r * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.7)";
          ctx.fill();
        } else if (p.kind === "snow") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(200,225,240,0.35)";
          ctx.fill();
        } else {
          const tw = 0.4 + 0.6 * Math.abs(Math.sin(p.phase * 0.7));
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
          g.addColorStop(0, `rgba(120,240,255,${0.9 * tw})`);
          g.addColorStop(1, "rgba(120,240,255,0)");
          ctx.fillStyle = g;
          ctx.fillRect(p.x - p.r * 6, p.y - p.r * 6, p.r * 12, p.r * 12);
        }
      }

      ctx.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.x += sp.vx; sp.y += sp.vy - dy * 0.6;
        sp.vx *= 0.94; sp.vy *= 0.94;
        sp.life -= sp.decay;
        if (sp.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r * 3.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${sp.rgb},${0.18 * sp.life})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${sp.rgb},${0.95 * sp.life})`;
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    });

    return () => { unsub(); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div ref={water} className="absolute inset-0" style={{ background: "linear-gradient(180deg,#2aa8c6,#0f6f96)" }} />
      <div ref={rays} className="absolute inset-0 overflow-hidden mix-blend-screen">
        {[8, 26, 44, 63, 80].map((left, i) => (
          <div
            key={left}
            className="absolute -top-20 h-[120vh] origin-top"
            style={{
              left: `${left}%`,
              width: `${60 + (i % 3) * 50}px`,
              background: "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 75%)",
              filter: "blur(14px)",
              animation: `rays ${7 + i * 1.3}s ease-in-out ${i * -1.7}s infinite`,
            }}
          />
        ))}
      </div>
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
