"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Re-mounts on every navigation: a short fade-up between pages. */
export default function Template({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // opacity only: a transform here would trap the fixed WebGL canvas and break pinning
      gsap.from(root.current, { opacity: 0, duration: 0.6, ease: "power2.out", clearProps: "opacity" });
    });
    // new page, new layout: recompute trigger positions once fonts and images settle
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(t);
  });
  return <div ref={root}>{children}</div>;
}
