"use client";

import { useEffect, useRef, useState } from "react";
import DemoFrame from "./DemoFrame";

const BARS = 36;

type Note = { id: number; url?: string; peaks: number[]; duration: number; simulated: boolean };

/** Pick a MIME type the browser can record: iOS Safari only does audio/mp4. */
function pickMime() {
  if (typeof MediaRecorder === "undefined") return "";
  for (const t of ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/aac"]) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return "";
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

function Wave({ peaks, progress = 1, live = false }: { peaks: number[]; progress?: number; live?: boolean }) {
  return (
    <div className="flex h-8 flex-1 items-center gap-[2px]">
      {peaks.map((p, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full ${i / peaks.length <= progress ? (live ? "bg-warn" : "bg-white") : "bg-white/35"}`}
          style={{ height: `${Math.max(12, p * 100)}%` }}
        />
      ))}
    </div>
  );
}

function VoiceBubble({ note }: { note: Note }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(1);
  const audio = useRef<HTMLAudioElement | null>(null);
  const raf = useRef(0);

  const stop = () => { setPlaying(false); setProgress(1); cancelAnimationFrame(raf.current); };

  const toggle = () => {
    if (playing) { audio.current?.pause(); stop(); return; }
    setPlaying(true);
    const start = performance.now();
    if (note.url) {
      audio.current ??= new Audio(note.url);
      audio.current.currentTime = 0;
      audio.current.onended = stop;
      void audio.current.play();
    }
    const loop = () => {
      const t = note.url && audio.current ? audio.current.currentTime : (performance.now() - start) / 1000;
      const p = Math.min(1, t / note.duration);
      setProgress(p);
      if (p >= 1 && !note.url) { stop(); return; }
      raf.current = requestAnimationFrame(loop);
    };
    setProgress(0);
    raf.current = requestAnimationFrame(loop);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <div className="ml-auto flex w-[85%] items-center gap-3 rounded-2xl rounded-br-sm bg-accent px-3 py-2 animate-[fadein_.3s_ease]">
      <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-accent">
        {playing ? "❚❚" : "▶"}
      </button>
      <Wave peaks={note.peaks} progress={progress} />
      <span className="font-mono text-[11px] text-white/80">{fmt(note.duration)}</span>
    </div>
  );
}

export default function VoiceDemo() {
  const [recording, setRecording] = useState(false);
  const [live, setLive] = useState<number[]>(Array(BARS).fill(0.05));
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [info, setInfo] = useState("");
  const [pending, setPending] = useState(false);
  const rec = useRef<{ stop: () => void } | null>(null);

  useEffect(() => () => rec.current?.stop(), []);

  const start = async () => {
    const mime = pickMime();
    const peaks: number[] = [];
    let raf = 0;
    let simulated = false;
    let stream: MediaStream | null = null;
    let recorder: MediaRecorder | null = null;
    let ctx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    const chunks: Blob[] = [];

    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") throw new Error("unsupported");
      setInfo("Waiting for microphone permission…");
      setPending(true);
      // If the permission prompt is ignored, fall back to a simulated recording after a few seconds
      const req = navigator.mediaDevices.getUserMedia({ audio: true });
      const timeout = new Promise<null>((r) => setTimeout(() => r(null), 5000));
      stream = await Promise.race([req, timeout]);
      if (!stream) {
        void req.then((late) => late.getTracks().forEach((t) => t.stop())).catch(() => {});
        throw new Error("timeout");
      }
      recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      recorder.start();
      ctx = new AudioContext();
      analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      ctx.createMediaStreamSource(stream).connect(analyser);
      setInfo(`Recording real audio as ${recorder.mimeType || "default format"}`);
    } catch {
      simulated = true;
      setInfo("No mic access: showing a simulated waveform");
    }

    setPending(false);
    const t0 = performance.now();
    const buf = new Uint8Array(analyser?.fftSize ?? 0);
    const loop = () => {
      let level: number;
      if (analyser) {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (const v of buf) sum += ((v - 128) / 128) ** 2;
        level = Math.min(1, Math.sqrt(sum / buf.length) * 4);
      } else {
        const t = performance.now() / 1000;
        level = Math.abs(Math.sin(t * 7) * Math.sin(t * 2.3)) * 0.8 + Math.random() * 0.15;
      }
      peaks.push(level);
      setLive((l) => [...l.slice(1), level]);
      setElapsed((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    setRecording(true);

    rec.current = {
      stop: () => {
        cancelAnimationFrame(raf);
        const duration = Math.max(0.5, (performance.now() - t0) / 1000);
        // Downsample peaks to BARS
        const bucket = Math.max(1, Math.floor(peaks.length / BARS));
        const out: number[] = [];
        for (let i = 0; i < BARS; i++) {
          const slice = peaks.slice(i * bucket, (i + 1) * bucket);
          out.push(slice.length ? Math.max(...slice) : 0.08);
        }
        const finish = (url?: string) =>
          setNotes((n) => [...n.slice(-2), { id: Date.now(), url, peaks: out, duration, simulated }]);
        if (recorder && recorder.state !== "inactive") {
          recorder.onstop = () => finish(URL.createObjectURL(new Blob(chunks, { type: recorder!.mimeType })));
          recorder.stop();
        } else finish();
        stream?.getTracks().forEach((t) => t.stop());
        void ctx?.close();
        setRecording(false);
        setLive(Array(BARS).fill(0.05));
        setElapsed(0);
        rec.current = null;
      },
    };
  };

  const toggle = () => {
    if (pending) return;
    if (recording) rec.current?.stop();
    else void start();
  };

  return (
    <DemoFrame title="cxgenie / web-chat widget" hint={info || "Uses your mic if you allow it. Nothing leaves your browser."}>
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-xs font-bold text-bg">AI</span>
          <div className="text-sm">
            <p className="font-semibold">Support</p>
            <p className="text-[11px] text-fg-dim">Typically replies instantly</p>
          </div>
        </div>
        <div data-lenis-prevent className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          <p className="w-fit max-w-[80%] rounded-2xl rounded-bl-sm bg-bg-3 px-3 py-2 text-sm">
            Hi there 👋 Too long to type? Send us a voice message instead.
          </p>
          {notes.map((n) => <VoiceBubble key={n.id} note={n} />)}
        </div>
        <div className="flex items-center gap-3 border-t border-line p-3">
          {recording ? (
            <>
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-warn" />
              <span className="font-mono text-xs tabular-nums text-warn">{fmt(elapsed)}</span>
              <Wave peaks={live} live />
            </>
          ) : (
            <span className="flex-1 rounded-full border border-line px-4 py-2 text-sm text-fg-faint">
              {pending ? "Allow the microphone to record…" : "Tap the mic to record…"}
            </span>
          )}
          <button
            onClick={toggle}
            data-cursor={recording ? "stop" : "rec"}
            aria-label={recording ? "Stop and send voice message" : "Start recording a voice message"}
            className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-full transition ${recording ? "bg-warn text-bg" : "bg-fg text-bg hover:bg-accent-2"}`}
          >
            {recording && <span className="absolute inset-0 animate-ping rounded-full bg-warn/40" />}
            {recording ? (
              <svg width="14" height="14" viewBox="0 0 14 14"><rect width="14" height="14" rx="3" fill="currentColor" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
            )}
          </button>
        </div>
      </div>
      <style>{`@keyframes fadein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
    </DemoFrame>
  );
}
