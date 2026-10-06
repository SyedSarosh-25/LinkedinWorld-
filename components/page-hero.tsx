"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { DotField } from "./dot-field";

const Rings = dynamic(() => import("./rings"), {
  ssr: false,
  loading: () => <div className="aspect-square w-full max-w-[420px]" />,
});

type Crumb = { href: string; label: string };

export function PageHero({
  title,
  intro,
  crumbs,
  rings = true,
  children,
}: {
  title: string;
  intro?: string;
  crumbs?: Crumb[];
  rings?: boolean;
  children?: React.ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(".ph-title > span", { yPercent: 105, duration: 1, stagger: 0.08 })
          .from(".ph-rings", { scale: 0.8, opacity: 0, duration: 1.4, ease: "expo.out" }, 0.1);
      });
    },
    { scope: root },
  );

  const words = title.split(" ");

  return (
    <section ref={root} className="relative overflow-hidden pt-10 pb-16 sm:pt-16">
      <DotField className="fade-mask" />
      {rings && <div aria-hidden="true" className="spotlight top-0 right-[-10%] h-[700px] w-[700px]" />}
      <div className="container-x relative flex flex-wrap items-center gap-x-12 gap-y-6">
        <div className="min-w-0 flex-[1_1_520px]">
          {crumbs && (
            <nav aria-label="Breadcrumb" className="mb-6 text-[15px] text-faint">
              {crumbs.map((c, i) => (
                <span key={c.href}>
                  <Link href={c.href} className="text-faint no-underline hover:text-accent">
                    {c.label}
                  </Link>
                  {i < crumbs.length - 1 && <span className="px-2">/</span>}
                </span>
              ))}
            </nav>
          )}
          <h1 className="ph-title text-[clamp(40px,6vw,84px)] leading-[1.02] tracking-[-0.045em]" aria-label={title}>
            {words.map((w, i) => (
              <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.16em] -mb-[0.08em] align-bottom">
                <span className="inline-block">
                  {w}
                  {i < words.length - 1 ? " " : ""}
                </span>
              </span>
            ))}
          </h1>
          {intro && <p className="lede mt-6 text-[20px]">{intro}</p>}
          {children}
        </div>
        {rings && (
          <div className="ph-rings mx-auto w-full max-w-[260px] sm:max-w-[340px] flex-[0_1_380px] lg:max-w-[420px]">
            <Rings />
          </div>
        )}
      </div>
    </section>
  );
}
