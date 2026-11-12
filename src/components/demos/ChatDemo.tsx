"use client";

import { useEffect, useRef, useState } from "react";
import DemoFrame from "./DemoFrame";

type Msg = { id: number; from: "me" | "them" | "system"; text: string; masked?: boolean };

const CONTACT_PATTERNS = [
  /(?:\+?84|0)[\s.-]?\d{2,3}[\s.-]?\d{3}[\s.-]?\d{3,4}/g, // VN-style phone numbers
  /\b\d[\d\s.-]{7,}\d\b/g, // any long digit run
  /[\w.+-]+@[\w-]+\.[\w.]+/g, // email
  /\b(zalo|whats\s?app|telegram|viber|facebook|fb|insta(gram)?|ig)\b/gi, // off-platform channels
];

function findContacts(text: string) {
  const hits: string[] = [];
  for (const re of CONTACT_PATTERNS) {
    for (const m of text.matchAll(re)) hits.push(m[0]);
  }
  return hits;
}

function mask(text: string) {
  let out = text;
  for (const re of CONTACT_PATTERNS) {
    out = out.replace(re, (m) => m.replace(/[A-Za-z0-9]/g, "•"));
  }
  return out;
}

const statuses = [
  { label: "Pending", color: "bg-warn" },
  { label: "Confirmed", color: "bg-accent" },
  { label: "Checked in", color: "bg-accent-2" },
];

const suggestions = ["Call me at 0909 123 456", "Add me on Zalo?", "See you Saturday!"];

export default function ChatDemo() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 1, from: "them", text: "Hi! Your Saturday 10:00 trial class is confirmed 🎨" },
    { id: 2, from: "me", text: "Great, does Bi need to bring anything?" },
    { id: 3, from: "them", text: "Just comfy clothes. We provide all the paints." },
  ]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [status, setStatus] = useState(1);
  const list = useRef<HTMLDivElement>(null);
  const hits = findContacts(text);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  // Booking status ticks along to show it is live in the thread
  useEffect(() => {
    const id = setInterval(() => setStatus((s) => (s + 1) % statuses.length), 3500);
    return () => clearInterval(id);
  }, []);

  const send = (value = text) => {
    const v = value.trim();
    if (!v) return;
    const flagged = findContacts(v).length > 0;
    const id = Date.now();
    setMsgs((m) => [
      ...m,
      { id, from: "me", text: flagged ? mask(v) : v, masked: flagged },
      ...(flagged
        ? [{ id: id + 1, from: "system" as const, text: "Contact details hidden. Bookings, refunds and support only cover chats on Pebbles." }]
        : []),
    ]);
    setText("");
    if (!flagged) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMsgs((m) => [...m, { id: Date.now(), from: "them", text: "Sounds good, see you then! 👋" }]);
      }, 1400);
    }
  };

  const st = statuses[status];

  return (
    <DemoFrame title="pebbles / chat — Ms. Linh, Little Explorers" hint="Phone numbers, emails and off-platform apps are detected as you type">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5 text-xs">
          <span className="font-mono text-fg-dim">Booking #PB-2041 · Sat 10:00</span>
          <span className="flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5">
            <span className={`h-1.5 w-1.5 rounded-full ${st.color} transition-colors`} />
            <span key={st.label} className="animate-[fadein_.4s_ease]">{st.label}</span>
          </span>
        </div>

        <div ref={list} data-lenis-prevent className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
          {msgs.map((m) =>
            m.from === "system" ? (
              <p key={m.id} className="mx-auto max-w-[90%] rounded-lg border border-warn/40 bg-warn/10 px-3 py-2 text-center text-[11px] text-warn">
                🛡 {m.text}
              </p>
            ) : (
              <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : ""}`}>
                <p
                  className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm animate-[fadein_.3s_ease] ${
                    m.from === "me" ? "rounded-br-sm bg-accent text-white" : "rounded-bl-sm bg-bg-3"
                  } ${m.masked ? "font-mono tracking-wider" : ""}`}
                >
                  {m.text}
                </p>
              </div>
            ),
          )}
          {typing && (
            <div className="flex gap-1 rounded-2xl bg-bg-3 px-3 py-3 w-fit">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-fg-dim" style={{ animationDelay: `${i * 120}ms` }} />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-line p-3">
          {hits.length > 0 ? (
            <p className="mb-2 rounded-lg bg-warn/15 px-3 py-1.5 text-[11px] text-warn">
              ⚠ Looks like contact info ({hits[0]}). Keep the deal on Pebbles to stay protected.
            </p>
          ) : (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button key={s} onClick={() => setText(s)} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-fg-dim transition hover:border-accent-2 hover:text-accent-2">
                  {s}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message…"
              aria-label="Message"
              className={`min-w-0 flex-1 rounded-full border bg-bg px-4 py-2 text-sm outline-none transition ${hits.length ? "border-warn" : "border-line focus:border-fg-dim"}`}
            />
            <button type="submit" className="rounded-full bg-fg px-4 text-sm font-semibold text-bg transition hover:bg-accent-2">Send</button>
          </form>
        </div>
      </div>
      <style>{`@keyframes fadein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
    </DemoFrame>
  );
}
