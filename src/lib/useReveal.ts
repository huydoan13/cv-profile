"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Fades and floats up every `.reveal` inside `root` as it scrolls into view, like something surfacing out of murky water. */
export function useReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 50, autoAlpha: 0, filter: "blur(8px)" },
          {
            y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1.1, ease: "expo.out",
            delay: Number(el.dataset.delay ?? 0),
            scrollTrigger: { trigger: el, start: "top 88%" },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, [root]);
}
