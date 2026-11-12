import type { ReactNode } from "react";

export default function DemoFrame({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg-2/80 shadow-[0_40px_120px_-40px_rgba(91,124,255,0.35)] backdrop-blur">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-fg-faint" />
          <span className="h-2.5 w-2.5 rounded-full bg-fg-faint" />
          <span className="h-2.5 w-2.5 rounded-full bg-fg-faint" />
        </div>
        <span className="font-mono text-[11px] text-fg-dim">{title}</span>
        <span className="flex items-center gap-1.5 rounded-full bg-accent-2/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent-2">
          <span className="h-1 w-1 rounded-full bg-accent-2" /> Live
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden">{children}</div>
      <div className="border-t border-line px-4 py-2.5 font-mono text-[11px] text-fg-dim">↳ {hint}</div>
    </div>
  );
}
