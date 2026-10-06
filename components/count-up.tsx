"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { Metric } from "@/lib/work";

const fmt = (v: number, target: number) => (Number.isInteger(target) ? Math.round(v).toString() : v.toFixed(1));

/** Shows the final value in markup; counts up once when scrolled into view. */
export function CountUp({ metric, className, delay = 0 }: { metric: Metric; className?: string; delay?: number }) {
  const el = useRef<HTMLSpanElement>(null);
  const target = metric.value;

  useGSAP(() => {
    if (target === null) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.create({
        trigger: el.current,
        start: "top 88%",
        once: true,
        onEnter: () => {
          const o = { v: 0 };
          gsap.to(o, {
            v: target,
            duration: 1.6,
            delay,
            ease: "power2.out",
            onUpdate: () => {
              if (el.current) el.current.textContent = `${fmt(o.v, target)}${metric.suffix ?? ""}`;
            },
          });
        },
      });
    });
  });

  return (
    <span ref={el} className={`tabular-nums ${className ?? ""}`}>
      {target === null ? metric.display : `${target}${metric.suffix ?? ""}`}
    </span>
  );
}
