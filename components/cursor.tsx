"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Dot + trailing ring cursor for fine pointers. Grows over links and buttons;
 * elements with data-cursor="View" show that word inside the ring.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    return () => document.documentElement.classList.remove("has-cursor");
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });

    const move = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button, [data-cursor], input, select, textarea");
      const text = t?.dataset.cursor ?? "";
      setLabel(text);
      const big = !!t && !t.matches("input, select, textarea");
      gsap.to(ring.current, { scale: text ? 2.6 : big ? 1.7 : 1, duration: 0.35, ease: "power3.out" });
      gsap.to(dot.current, { scale: big ? 0 : 1, duration: 0.25 });
    };
    const down = () => gsap.to(ring.current, { scale: 0.8, duration: 0.15 });
    const up = () => gsap.to(ring.current, { scale: 1, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={ring}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[90] -mt-5 -ml-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/50 mix-blend-difference"
      >
        <span className="text-[6px] font-semibold tracking-wide text-white uppercase">{label}</span>
      </div>
      <div ref={dot} aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-[90] -mt-[3px] -ml-[3px] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference" />
    </>
  );
}
