"use client";

import { useMemo, useState } from "react";
import DemoFrame from "./DemoFrame";

const CAPACITY = 4;
const OPEN = 9;
const CLOSE = 18; // last slot starts at 17:00
const NOW = 9.25; // "now" is 09:15 today
const NOTICE = 2; // hours

const days = [
  { key: "today", label: "Today", sub: "Fri 14", closed: false },
  { key: "sat", label: "Sat", sub: "15", closed: false },
  { key: "sun", label: "Sun", sub: "16", closed: true },
  { key: "mon", label: "Mon", sub: "17", closed: false },
];

// Seats already taken (online bookings + walk-ins) per day/hour
const taken: Record<string, Record<number, { online: number; walkIn: number }>> = {
  today: { 12: { online: 2, walkIn: 2 }, 14: { online: 3, walkIn: 0 }, 15: { online: 1, walkIn: 1 } },
  sat: { 9: { online: 4, walkIn: 0 }, 10: { online: 3, walkIn: 0 }, 11: { online: 2, walkIn: 1 }, 15: { online: 2, walkIn: 2 } },
  mon: { 9: { online: 1, walkIn: 0 }, 13: { online: 3, walkIn: 1 } },
};

type SlotState = { hour: number; left: number; reason?: "notice" | "full" | "seats" };

export default function BookingDemo() {
  const [day, setDay] = useState("today");
  const [kids, setKids] = useState(1);
  const [picked, setPicked] = useState<number | null>(null);
  const [sessions, setSessions] = useState(7);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const current = days.find((d) => d.key === day)!;

  const slots = useMemo<SlotState[]>(() => {
    const out: SlotState[] = [];
    for (let h = OPEN; h < CLOSE; h++) {
      const t = taken[day]?.[h];
      const left = CAPACITY - (t ? t.online + t.walkIn : 0);
      let reason: SlotState["reason"];
      if (day === "today" && h < NOW + NOTICE) reason = "notice";
      else if (left <= 0) reason = "full";
      else if (left < kids) reason = "seats";
      out.push({ hour: h, left, reason });
    }
    return out;
  }, [day, kids]);

  const pickedSlot = slots.find((s) => s.hour === picked && !s.reason);

  const book = () => {
    if (!pickedSlot || sessions < kids) return;
    setSessions((s) => s - kids);
    setConfirmed(`${current.label} ${current.sub} · ${String(pickedSlot.hour).padStart(2, "0")}:00 · ${kids} child${kids > 1 ? "ren" : ""}`);
    setPicked(null);
  };

  return (
    <DemoFrame title="pebbles / book — Little Explorers" hint="Open 09–18 · 2h notice · 4 seats per slot, shared with walk-ins">
      <div className="flex h-full flex-col gap-4 p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-1.5">
            {days.map((d) => (
              <button
                key={d.key}
                disabled={d.closed}
                onClick={() => { setDay(d.key); setPicked(null); setConfirmed(null); }}
                className={`rounded-lg border px-2.5 py-1.5 text-left text-xs transition ${
                  day === d.key ? "border-accent-2 bg-accent-2 text-bg" : "border-line text-fg hover:border-fg-dim"
                } disabled:cursor-not-allowed disabled:opacity-35`}
              >
                <span className="block font-semibold">{d.label}</span>
                <span className="block font-mono text-[10px] opacity-70">{d.closed ? "Closed" : d.sub}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-line px-2 py-1">
            <button aria-label="Fewer children" onClick={() => setKids((k) => Math.max(1, k - 1))} className="px-1 text-fg-dim hover:text-fg">−</button>
            <span className="whitespace-nowrap font-mono text-xs tabular-nums">{kids} 🧒</span>
            <button aria-label="More children" onClick={() => setKids((k) => Math.min(3, k + 1))} className="px-1 text-fg-dim hover:text-fg">+</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {slots.map((s) => {
            const active = picked === s.hour && !s.reason;
            return (
              <button
                key={s.hour}
                disabled={!!s.reason}
                onClick={() => { setPicked(s.hour); setConfirmed(null); }}
                className={`relative rounded-lg border px-2 py-2 text-left transition ${
                  active ? "border-accent bg-accent/20" : "border-line hover:border-fg-dim"
                } disabled:cursor-not-allowed`}
              >
                <span className={`block font-mono text-sm ${s.reason ? "text-fg-faint line-through" : ""}`}>
                  {String(s.hour).padStart(2, "0")}:00
                </span>
                <span className={`block text-[10px] ${s.reason ? "text-warn/80" : "text-fg-dim"}`}>
                  {s.reason === "notice" ? "Too soon" : s.reason === "full" ? "Full" : s.reason === "seats" ? `Only ${s.left} left` : `${s.left} seat${s.left > 1 ? "s" : ""}`}
                </span>
                {taken[day]?.[s.hour]?.walkIn ? (
                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-warn" title="Includes walk-ins" />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 rounded-xl border border-line bg-bg-3/60 p-3">
          <div className="min-w-0 text-xs">
            {confirmed ? (
              <p className="text-accent-2">✓ Booked {confirmed}</p>
            ) : pickedSlot ? (
              <p>{current.label} {String(pickedSlot.hour).padStart(2, "0")}:00 · uses {kids} of your package sessions</p>
            ) : (
              <p className="text-fg-dim">Pick a slot. Greyed ones break a rule.</p>
            )}
            <p className="mt-0.5 font-mono text-[10px] text-fg-dim">10-session package · {sessions} left</p>
          </div>
          <button
            onClick={book}
            disabled={!pickedSlot || sessions < kids}
            className="shrink-0 rounded-full bg-fg px-4 py-2 text-xs font-semibold text-bg transition hover:bg-accent-2 disabled:opacity-30"
          >
            Book
          </button>
        </div>
      </div>
    </DemoFrame>
  );
}
