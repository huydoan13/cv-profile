/**
 * The depth engine. Elements marked with `data-depth="<metres>"` act as anchors:
 * depth is interpolated between the anchors the middle of the viewport sits between.
 * One rAF loop feeds every subscriber (backdrop, fish, meter) so they always agree.
 */

export type DepthState = {
  depth: number; // metres, smoothed
  progress: number; // 0..1 of the whole dive, by depth
  scroll: number; // 0..1 of the page, by scroll position (smoothed)
  velocity: number; // px per frame of scroll, smoothed (positive = diving)
  t: number; // seconds since start
};

type Listener = (s: DepthState) => void;

const listeners = new Set<Listener>();
const state: DepthState = { depth: 0, progress: 0, scroll: 0, velocity: 0, t: 0 };
let anchors: { top: number; depth: number }[] = [];
let maxDepth = 1;
let running = false;
let lastY = 0;
let raf = 0;

// Shared so the particle canvas can follow the fish: its position, life stage and evolution bursts
export const fish = { x: -200, y: -200, scale: 1, facing: 1, stage: 0, burstAt: 0, halfWidth: 40 };

export function zoneFor(depth: number) {
  if (depth < 200) return "Sunlight zone";
  if (depth < 1000) return "Twilight zone";
  if (depth < 4000) return "Midnight zone";
  return "The abyss";
}

function measure() {
  anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-depth]"))
    .map((el) => ({ top: el.getBoundingClientRect().top + window.scrollY, depth: Number(el.dataset.depth) }))
    .sort((a, b) => a.top - b.top);
  maxDepth = anchors.length ? anchors[anchors.length - 1].depth : 1;
}

function targetDepth(y: number) {
  if (!anchors.length) return 0;
  const half = window.innerHeight * 0.5;
  const ref = y + half * Math.min(1, y / half); // the reading line eases from the top edge to mid-screen, so the surface reads 0 m
  if (ref <= anchors[0].top) return anchors[0].depth;
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (ref < b.top) return a.depth + ((ref - a.top) / Math.max(1, b.top - a.top)) * (b.depth - a.depth);
  }
  return anchors[anchors.length - 1].depth;
}

function tick(now: number) {
  const y = window.scrollY;
  state.t = now / 1000;
  state.velocity += (y - lastY - state.velocity) * 0.15;
  lastY = y;
  state.depth += (targetDepth(y) - state.depth) * 0.12;
  state.progress = Math.min(1, Math.max(0, state.depth / maxDepth));
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  state.scroll += (Math.min(1, y / max) - state.scroll) * 0.08;
  listeners.forEach((l) => l(state));
  raf = requestAnimationFrame(tick);
}

let ro: ResizeObserver | null = null;

export function subscribeDepth(l: Listener) {
  listeners.add(l);
  if (!running) {
    running = true;
    measure();
    lastY = window.scrollY;
    state.depth = targetDepth(lastY);
    ro = new ResizeObserver(measure);
    ro.observe(document.body);
    raf = requestAnimationFrame(tick);
  }
  return () => {
    listeners.delete(l);
    if (!listeners.size) {
      running = false;
      cancelAnimationFrame(raf);
      ro?.disconnect();
    }
  };
}

export function formatDepth(d: number) {
  return `${Math.round(d).toLocaleString("en-US")} m`;
}
