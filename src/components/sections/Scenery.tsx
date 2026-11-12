"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Scenery as Kind } from "@/data/cv";

gsap.registerPlugin(ScrollTrigger);

const tinyFish = "M2,8 C7,1 17,1 22,8 C17,15 7,15 2,8 Z M2,8 L-5,2 L-5,14 Z";

function Pebbles() {
  return (
    <svg viewBox="0 0 400 120" className="absolute bottom-0 right-0 w-[min(560px,90%)] opacity-60">
      {[[40, 100, 38, 16], [100, 104, 28, 12], [160, 98, 46, 20], [230, 106, 30, 12], [300, 100, 52, 20], [360, 108, 24, 10]].map(([cx, cy, rx, ry], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={i % 2 ? "#3c6f86" : "#2b5970"} />
      ))}
      {[70, 130, 210, 280, 340].map((x, i) => (
        <path
          key={x}
          d={`M${x},110 C${x - 10},80 ${x + 10},50 ${x},${20 + (i % 3) * 10}`}
          stroke="#3fa58a"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          style={{ transformOrigin: `${x}px 110px`, animation: `sway ${3 + i * 0.6}s ease-in-out infinite` }}
        />
      ))}
    </svg>
  );
}

function Flow({ strong }: { strong?: boolean }) {
  const lines = strong ? 9 : 6;
  return (
    <svg viewBox="0 0 600 400" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-50">
      {Array.from({ length: lines }).map((_, i) => {
        const y = 40 + i * (320 / lines);
        const tilt = strong ? 60 : 20;
        return (
          <path
            key={i}
            d={`M-20,${y} C150,${y - tilt} 300,${y + tilt} 620,${y - tilt / 2}`}
            stroke="rgba(210,240,255,0.55)"
            strokeWidth={strong ? 1.6 : 1}
            fill="none"
            strokeDasharray={strong ? "60 40" : "30 50"}
            style={{ animation: `flow ${strong ? 3 + (i % 3) : 7 + (i % 4)}s linear infinite` }}
          />
        );
      })}
    </svg>
  );
}

function Reef() {
  const corals = [
    { x: 60, h: 180, c: "#ff7a6b" },
    { x: 150, h: 240, c: "#ffb06b" },
    { x: 250, h: 150, c: "#c77dff" },
    { x: 330, h: 210, c: "#ff7a6b" },
    { x: 420, h: 170, c: "#5fd4f4" },
  ];
  return (
    <svg viewBox="0 0 480 300" className="absolute bottom-0 right-0 w-[min(640px,100%)] opacity-70">
      {corals.map(({ x, h, c }, i) => (
        <g key={i} style={{ transformOrigin: `${x}px 300px`, animation: `sway ${4 + i * 0.7}s ease-in-out infinite` }}>
          <path d={`M${x},300 L${x},${300 - h}`} stroke={c} strokeWidth="9" strokeLinecap="round" />
          <path d={`M${x},${300 - h * 0.45} C${x - 30},${300 - h * 0.6} ${x - 34},${300 - h * 0.8} ${x - 28},${300 - h * 0.9}`} stroke={c} strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d={`M${x},${300 - h * 0.6} C${x + 26},${300 - h * 0.7} ${x + 30},${300 - h * 0.85} ${x + 24},${300 - h}`} stroke={c} strokeWidth="6" fill="none" strokeLinecap="round" />
          <circle cx={x} cy={300 - h} r="7" fill={c} />
        </g>
      ))}
      <ellipse cx="240" cy="300" rx="260" ry="26" fill="#123a52" />
    </svg>
  );
}

function School() {
  // 24 fish; the visitor's little fish is the 25th
  const fishes = Array.from({ length: 24 }, (_, i) => ({ row: i % 6, col: Math.floor(i / 6) }));
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-[58%] h-[34%] w-[40vw] opacity-60" style={{ animation: "swim-across 22s linear infinite" }}>
        {fishes.map(({ row, col }, i) => (
          <svg
            key={i}
            viewBox="-6 0 30 16"
            className="absolute w-7 opacity-80"
            style={{ left: `${col * 22 + (row % 2) * 10}%`, top: `${row * 16}%`, animation: `sway ${1.2 + (i % 5) * 0.2}s ease-in-out infinite` }}
          >
            <path d={tinyFish} fill="#cfe9f5" />
          </svg>
        ))}
      </div>
    </div>
  );
}

function Seas() {
  const seas = [
    { label: "HK · Nice Care", y: 70, c: "#ffb06b" },
    { label: "VN · Insane Clo", y: 160, c: "#5fd4f4" },
    { label: "AU · Cedora", y: 250, c: "#c77dff" },
  ];
  return (
    <svg viewBox="0 0 600 320" className="absolute bottom-[4%] right-0 h-[42%] w-[min(720px,100%)] opacity-90 lg:w-[55%]">
      {seas.map(({ label, y, c }, i) => (
        <g key={label}>
          <path id={`sea-${i}`} d={`M20,${y + 30} C180,${y - 30} 380,${y + 60} 580,${y}`} stroke={c} strokeOpacity="0.5" strokeWidth="1.5" fill="none" strokeDasharray="6 8" style={{ animation: `flow ${6 + i}s linear infinite` }} />
          <circle r="5" fill={c}>
            <animateMotion dur={`${5 + i * 1.5}s`} repeatCount="indefinite">
              <mpath href={`#sea-${i}`} />
            </animateMotion>
          </circle>
          <text x="580" y={y - 14} textAnchor="end" fill={c} fontSize="13" fontFamily="var(--font-jetbrains), monospace">{label}</text>
        </g>
      ))}
    </svg>
  );
}

function Build() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".stone", {
        y: -260, autoAlpha: 0, rotate: () => gsap.utils.random(-40, 40),
        duration: 0.9, ease: "bounce.out",
        stagger: { each: 0.045, from: "random" },
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={root} className="absolute bottom-[5%] right-[6%] w-[min(380px,70%)]">
      <div className="grid grid-cols-8 gap-1.5">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="stone block aspect-[5/4] rounded-[45%]"
            style={{ background: ["#ffb06b", "#ff9a7a", "#ffd58a", "#9fe3f5"][i % 4], opacity: 0.85 }}
          />
        ))}
      </div>
      <p className="label mt-3 text-right !text-fg/80">40+ storefronts live on day one</p>
    </div>
  );
}

export default function Scenery({ kind }: { kind: Kind }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {kind === "stream" && <Pebbles />}
      {kind === "river" && <Flow />}
      {kind === "current" && <Flow strong />}
      {kind === "reef" && <Reef />}
      {kind === "school" && <School />}
      {kind === "seas" && <Seas />}
      {kind === "build" && <Build />}
    </div>
  );
}
