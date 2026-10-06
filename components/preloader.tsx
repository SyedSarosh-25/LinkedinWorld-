"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { PRELOADER_DONE } from "@/lib/scene-store";

const KEY = "lw-preloaded";

function finish() {
  (window as unknown as { __lwReady?: boolean }).__lwReady = true;
  window.dispatchEvent(new Event(PRELOADER_DONE));
}

/** Counter + curtain on the first visit of a session; skipped afterwards and with reduced motion. */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      setShow(false);
      finish();
      return;
    }
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    window.__lenis?.stop();
    const o = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setShow(false);
        window.__lenis?.start();
      },
    });
    tl.to(o, {
      v: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => {
        if (count.current) count.current.textContent = String(Math.round(o.v)).padStart(3, "0");
      },
    })
      .to(".pl-line", { scaleX: 1, duration: 1.8, ease: "power2.inOut" }, 0)
      .to(".pl-inner", { yPercent: -30, opacity: 0, duration: 0.6, ease: "power3.in" }, "+=0.15")
      .add(finish, "-=0.1")
      .to(root.current, { yPercent: -100, duration: 1, ease: "expo.inOut" }, "-=0.2");
    return () => {
      tl.kill();
    };
  }, []);

  if (!show) return null;
  return (
    <div ref={root} aria-hidden="true" className="fixed inset-0 z-[80] flex items-end bg-[#05070a] text-fg">
      <div className="pl-inner container-x flex w-full flex-wrap items-end justify-between gap-6 pb-12">
        <div>
          <p className="display text-[clamp(28px,4vw,48px)]">Linkin World</p>
          <p className="mt-3 text-faint">Connecting the right technology</p>
        </div>
        <span ref={count} className="display text-[clamp(80px,16vw,220px)] leading-none tabular-nums">
          000
        </span>
        <span className="pl-line absolute right-0 bottom-0 left-0 h-px origin-left scale-x-0 bg-accent" />
      </div>
    </div>
  );
}
