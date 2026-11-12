"use client";

import { useEffect, useRef } from "react";
import { formatDepth, subscribeDepth, zoneFor } from "@/lib/depth";

/** Fixed depth gauge on the right edge: current depth, zone name and a progress needle. */
export default function DepthMeter() {
  const value = useRef<HTMLSpanElement>(null);
  const zone = useRef<HTMLSpanElement>(null);
  const needle = useRef<HTMLDivElement>(null);
  const mobileValue = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let lastZone = "";
    return subscribeDepth((s) => {
      const text = formatDepth(s.depth);
      value.current!.textContent = text;
      mobileValue.current!.textContent = text;
      needle.current!.style.top = `${s.progress * 100}%`;
      const z = zoneFor(s.depth);
      if (z !== lastZone) { lastZone = z; zone.current!.textContent = z; }
    });
  }, []);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 items-center gap-3 md:flex lg:right-8">
        <div className="text-right">
          <span ref={zone} className="label block">Sunlight zone</span>
          <span ref={value} className="block font-mono text-sm tabular-nums text-fg">0 m</span>
        </div>
        <div className="relative h-[42vh] w-3">
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-fg/25" />
          {Array.from({ length: 21 }).map((_, i) => (
            <div key={i} className={`absolute left-1/2 h-px -translate-x-1/2 bg-fg/40 ${i % 5 ? "w-1.5" : "w-3"}`} style={{ top: `${i * 5}%` }} />
          ))}
          <div ref={needle} className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-2 shadow-[0_0_12px_rgba(255,176,107,0.9)]" style={{ top: 0 }} />
        </div>
      </div>
      <div aria-hidden className="pointer-events-none fixed bottom-4 right-4 z-30 rounded-full px-3 py-1.5 glass md:hidden">
        <span ref={mobileValue} className="font-mono text-xs tabular-nums">0 m</span>
      </div>
    </>
  );
}
