"use client";

import Link from "next/link";
import { useTilt } from "@/lib/hooks";
import type { CaseStudy } from "@/lib/work";
import { CountUp } from "./count-up";

export function CaseCard({ item, index = 0 }: { item: CaseStudy; index?: number }) {
  const tilt = useTilt<HTMLAnchorElement>(6);
  const lead = item.metrics[0];
  return (
    <div className="[perspective:1000px]">
      <Link
        ref={tilt}
        href={`/work/${item.slug}`}
        className="group flex h-full flex-col rounded-[22px] border border-line bg-surface p-7 text-fg no-underline transition-colors duration-300 [transform-style:preserve-3d] hover:border-accent"
      >
        <span className="text-[15px] text-faint">{item.domain}</span>
        <CountUp metric={lead} delay={index * 0.08} className="mt-6 block text-[clamp(52px,5vw,72px)] leading-none font-semibold tracking-[-0.045em] text-accent" />
        <span className="mt-2 text-[15px] text-muted">{lead.label}</span>
        <h3 className="mt-8 text-2xl leading-tight tracking-[-0.02em]">{item.title}</h3>
        <p className="mt-2 flex-1 text-muted">{item.summary}</p>
        <span className="mt-6 text-[15px] font-semibold text-accent">
          Read the case study <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">›</span>
        </span>
      </Link>
    </div>
  );
}
