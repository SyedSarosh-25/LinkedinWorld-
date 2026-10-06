"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { platforms, platformsCoda } from "@/lib/content";

export function Platforms() {
  const root = useRef<HTMLParagraphElement>(null);
  const words = platforms.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cs = getComputedStyle(document.documentElement);
        gsap.fromTo(
          ".pw",
          { color: cs.getPropertyValue("--faint").trim() },
          {
            color: cs.getPropertyValue("--fg").trim(),
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section className="py-[104px]">
      <div className="container-x max-w-[1080px]">
        <p ref={root} className="text-[clamp(24px,2.9vw,38px)] leading-[1.4] tracking-[-0.015em]">
          {words.map((w, i) => (
            <span key={i} className="pw">
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}{" "}
          <span className="text-faint">{platformsCoda}</span>
        </p>
      </div>
    </section>
  );
}
