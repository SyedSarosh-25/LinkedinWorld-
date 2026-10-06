"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useTilt } from "@/lib/hooks";
import { DotField } from "./dot-field";

const results = [
  { value: 80, suffix: "%", text: "lower infrastructure cost after moving from a physical data center to the cloud." },
  { value: 100, suffix: "%", text: "of required ISO 27001 controls met, from gap closure through to external audit." },
  { value: 500, suffix: "+", text: "network nodes under centralised monitoring, at 99.9% service uptime." },
  { value: 70, suffix: "%", text: "less manual effort after connecting CRM, ERP and daily workflows." },
];

function Result({ value, suffix, text, index }: { value: number; suffix: string; text: string; index: number }) {
  const tilt = useTilt<HTMLDivElement>(10);
  const num = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // markup already shows the final number; animate only once it scrolls into view
      ScrollTrigger.create({
        trigger: tilt.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(line.current, { scaleX: 0 }, { scaleX: 1, duration: 1.1, delay: index * 0.12, ease: "power3.out" });
          const o = { v: 0 };
          gsap.to(o, {
            v: value,
            duration: 1.6,
            delay: index * 0.12,
            ease: "power2.out",
            onUpdate: () => {
              if (num.current) num.current.textContent = `${Math.round(o.v)}${suffix}`;
            },
          });
        },
      });
    });
  });

  return (
    <div ref={tilt} className="relative pt-6 [transform-style:preserve-3d]">
      <span ref={line} aria-hidden="true" className="absolute top-0 right-0 left-0 h-0.5 origin-left bg-band-accent" />
      <div ref={num} className="text-[clamp(56px,6vw,76px)] leading-none font-semibold tracking-[-0.045em] tabular-nums">
        {value}
        {suffix}
      </div>
      <p className="mt-4 text-lg text-band-muted">{text}</p>
    </div>
  );
}

export function Results() {
  return (
    <section id="results" className="relative overflow-hidden bg-band py-28 text-band-fg">
      <DotField colorVar="--band-dot" activeVar="--band-accent" spacing={32} className="fade-mask" />
      <div className="container-x relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="h2">Results from recent projects</h2>
          <Link href="/work" className="text-[17px] font-semibold text-band-accent">
            See all case studies
          </Link>
        </div>
        <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-10 [perspective:900px]">
          {results.map((r, i) => (
            <Result key={r.text} {...r} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
