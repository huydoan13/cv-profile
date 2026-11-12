"use client";

import { useState } from "react";
import DemoFrame from "./DemoFrame";

const palettes = [
  { name: "Blush", bg: "#f6d9d0", fg: "#3a1f1a", btn: "#3a1f1a" },
  { name: "Sage", bg: "#d5e0cf", fg: "#1f2b1c", btn: "#1f2b1c" },
  { name: "Night", bg: "#1b1d2b", fg: "#f2efe8", btn: "#c6ff3d" },
  { name: "Sand", bg: "#ece3d2", fg: "#2b241a", btn: "#b5562d" },
];

export default function SectionsDemo() {
  const [heading, setHeading] = useState("Gentle care, every day");
  const [cta, setCta] = useState("Shop the sale");
  const [palette, setPalette] = useState(0);
  const [align, setAlign] = useState<"left" | "center">("left");
  const [badge, setBadge] = useState(true);
  const p = palettes[palette];

  return (
    <DemoFrame title="shopify / theme editor — Hero banner" hint="Merchants edit sections like this without a developer">
      <div className="flex h-full flex-col md:flex-row">
        <div className="space-y-3 border-b border-line p-4 text-xs md:w-[44%] md:border-b-0 md:border-r">
          <p className="label">Section settings</p>
          <label className="block space-y-1">
            <span className="text-fg-dim">Heading</span>
            <input value={heading} maxLength={40} onChange={(e) => setHeading(e.target.value)} className="w-full rounded-md border border-line bg-bg px-2 py-1.5 outline-none focus:border-fg-dim" />
          </label>
          <label className="block space-y-1">
            <span className="text-fg-dim">Button label</span>
            <input value={cta} maxLength={20} onChange={(e) => setCta(e.target.value)} className="w-full rounded-md border border-line bg-bg px-2 py-1.5 outline-none focus:border-fg-dim" />
          </label>
          <div className="space-y-1">
            <span className="text-fg-dim">Color scheme</span>
            <div className="flex gap-1.5">
              {palettes.map((pl, i) => (
                <button
                  key={pl.name}
                  aria-label={pl.name}
                  onClick={() => setPalette(i)}
                  className={`h-7 w-7 rounded-full border-2 transition ${palette === i ? "scale-110 border-accent-2" : "border-transparent"}`}
                  style={{ background: `linear-gradient(135deg, ${pl.bg} 50%, ${pl.btn} 50%)` }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-fg-dim">Alignment</span>
            <div className="flex rounded-md border border-line p-0.5">
              {(["left", "center"] as const).map((a) => (
                <button key={a} onClick={() => setAlign(a)} className={`rounded px-2 py-1 capitalize ${align === a ? "bg-fg text-bg" : "text-fg-dim"}`}>{a}</button>
              ))}
            </div>
          </div>
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-fg-dim">Show sale badge</span>
            <span className={`relative h-5 w-9 rounded-full transition ${badge ? "bg-accent-2" : "bg-fg-faint"}`}>
              <input type="checkbox" checked={badge} onChange={(e) => setBadge(e.target.checked)} className="sr-only" />
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-bg transition-all ${badge ? "left-[18px]" : "left-0.5"}`} />
            </span>
          </label>
        </div>

        <div className="flex flex-1 p-3">
          <div
            className={`relative flex flex-1 flex-col justify-center gap-3 overflow-hidden rounded-xl p-6 transition-colors duration-500 ${align === "center" ? "items-center text-center" : "items-start"}`}
            style={{ background: p.bg, color: p.fg }}
          >
            <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-2xl transition-colors duration-500" style={{ background: p.btn }} />
            {badge && (
              <span className="relative rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider" style={{ background: p.btn, color: p.bg }}>
                −20% this week
              </span>
            )}
            <p className="relative font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">Nice Care · New season</p>
            <h3 className="relative max-w-[14ch] font-serif text-3xl leading-[1.02] md:text-4xl">{heading || "Your heading"}</h3>
            <span className="relative rounded-full px-4 py-2 text-xs font-semibold" style={{ background: p.btn, color: p.bg }}>
              {cta || "Button"} →
            </span>
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}
