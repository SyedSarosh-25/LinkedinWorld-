"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "./gsap";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** Reads design tokens from :root and re-reads them when the colour scheme changes. */
export function useTokens<K extends string>(names: readonly K[]): Record<K, string> | null {
  const [tokens, setTokens] = useState<Record<K, string> | null>(null);
  const key = names.join("|");
  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      const next = {} as Record<K, string>;
      for (const n of names) next[n] = cs.getPropertyValue(`--${n}`).trim();
      setTokens(next);
    };
    read();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return tokens;
}

/** Pointer-follow 3D tilt for fine pointers. Returns a ref for the element. */
export function useTilt<T extends HTMLElement>(strength = 10) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * strength * 1.2);
      rx(-((e.clientY - r.top) / r.height - 0.5) * strength);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);
  return ref;
}
