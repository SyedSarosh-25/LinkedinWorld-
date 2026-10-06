"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { steps } from "@/lib/content";

export function Process() {
  const track = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 700px)", () => {
        const cs = getComputedStyle(document.documentElement);
        gsap.fromTo(
          ".track-fill",
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: track.current, start: "top 80%", end: "bottom 55%", scrub: true } },
        );
        gsap.utils.toArray<HTMLElement>(".track-dot").forEach((dot, i) => {
          gsap.fromTo(
            dot,
            { backgroundColor: cs.getPropertyValue("--bg").trim() },
            {
              backgroundColor: cs.getPropertyValue("--accent").trim(),
              ease: "none",
              scrollTrigger: { trigger: track.current, start: `top ${80 - i * 7}%`, end: `top ${74 - i * 7}%`, scrub: true },
            },
          );
        });
      });
    },
    { scope: track },
  );

  return (
    <section id="process" className="py-28">
      <div className="container-x">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <h2 className="h2">Decide first. Spend second.</h2>
          <p className="lede max-w-[24em]">We start small, prove the value, then expand. Most clients begin with an audit.</p>
        </div>
        <ol ref={track} className="relative grid list-none grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-8 p-0">
          <span aria-hidden="true" className="absolute top-[11px] right-0 left-0 hidden h-0.5 bg-line min-[700px]:block" />
          <span aria-hidden="true" className="track-fill absolute top-[11px] right-0 left-0 hidden h-0.5 origin-left bg-accent min-[700px]:block" />
          {steps.map((s, i) => (
            <li key={s.title} className="relative">
              <div className="track-dot mb-[22px] h-6 w-6 rounded-full border-2 border-accent bg-bg" />
              <small className="block text-[15px] text-faint">Step {i + 1}</small>
              <h3 className="mt-1 mb-2 text-[26px] tracking-[-0.02em]">{s.title}</h3>
              <p className="text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
