"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { advisoryProblem } from "@/lib/content";
import { services } from "@/lib/services";

const problems = [
  ...services.map((s) => ({ q: s.problem, service: s.title, detail: s.intro, outcome: s.outcome, href: `/services/${s.slug}` })),
  { ...advisoryProblem, href: "/services#engagements" },
];

const INITIAL_OPEN = 0;

export function Problems() {
  const [open, setOpen] = useState<number | null>(INITIAL_OPEN);
  const panels = useRef<(HTMLDivElement | null)[]>([]);

  const animate = (idx: number, show: boolean) => {
    const el = panels.current[idx];
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(el, { height: show ? "auto" : 0 });
      return;
    }
    if (show) {
      gsap.to(el, { height: "auto", duration: 0.55, ease: "power3.out" });
      gsap.fromTo(el.firstElementChild, { y: 14 }, { y: 0, duration: 0.55, ease: "power3.out" });
    } else {
      gsap.to(el, { height: 0, duration: 0.45, ease: "power3.inOut" });
    }
  };

  const toggle = (i: number) => {
    const closing = open === i;
    if (open !== null) animate(open, false);
    if (!closing) animate(i, true);
    setOpen(closing ? null : i);
  };

  return (
    <section id="problems" className="bg-surface py-28">
      <div className="container-x max-w-[1080px]">
        <h2 className="h2">What’s going wrong?</h2>
        <p className="lede mt-4 mb-12">Pick the one that sounds like you. That’s usually where we start.</p>

        <div className="border-t border-line">
          {problems.map((p, i) => {
            const isOpen = open === i;
            return (
              <div key={p.q} className="border-b border-line">
                <button
                  id={`q-${i}`}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`p-${i}`}
                  onClick={() => toggle(i)}
                  className="flex w-full cursor-pointer items-baseline justify-between gap-6 py-7 text-left"
                >
                  <span className="text-[clamp(21px,2.4vw,30px)] leading-[1.3] font-medium tracking-[-0.01em] text-fg">
                    {p.q}
                    <span className="mt-1.5 block text-[15px] font-normal tracking-normal text-faint">{p.service}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`relative h-[26px] w-[26px] flex-none transition-colors duration-300 ${isOpen ? "text-accent" : "text-faint"}`}
                  >
                    <span className="absolute top-3 right-[3px] left-[3px] h-0.5 rounded bg-current" />
                    <span
                      className={`absolute top-3 right-[3px] left-[3px] h-0.5 rounded bg-current transition-transform duration-300 ${isOpen ? "rotate-0" : "rotate-90"}`}
                    />
                  </span>
                </button>
                {/* height is owned by GSAP after first render; the style prop never changes */}
                <div
                  id={`p-${i}`}
                  role="region"
                  aria-labelledby={`q-${i}`}
                  inert={!isOpen}
                  ref={(el) => {
                    panels.current[i] = el;
                  }}
                  style={i === INITIAL_OPEN ? undefined : { height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-x-12 gap-y-4 pb-[30px]">
                    <p className="min-w-0 flex-[2_1_420px] text-lg text-muted">{p.detail}</p>
                    <div className="min-w-0 flex-[1_1_220px]">
                      <p className="text-lg leading-normal font-semibold text-accent">{p.outcome}</p>
                      <Link href={p.href} className="mt-3 inline-block text-[15px] font-semibold text-fg">
                        See the full scope
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
