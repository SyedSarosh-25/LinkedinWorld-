"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { GlobeControl } from "./globe/globe-scene";
import { DotField } from "./dot-field";

const Globe = dynamic(() => import("./globe/globe"), {
  ssr: false,
  loading: () => (
    <div className="relative mx-auto aspect-[1/0.86] w-full max-w-[760px]">
      <div className="absolute inset-[12%] rounded-full bg-surface shadow-[inset_0_0_0_1px_var(--line)]" />
    </div>
  ),
});

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const control = useRef<GlobeControl>({
    scrollSpin: 0,
    userSpin: 0,
    userTilt: 0,
    velocity: 0,
    dragging: false,
    px: 0,
    py: 0,
  });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // one orchestrated entrance
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(".hero-line > span", { yPercent: 110, duration: 1.1, stagger: 0.1 })
          .from(".hero-globe", { scale: 0.82, opacity: 0, duration: 1.6, ease: "expo.out" }, 0.15)
          .from(".hero-side-l", { x: -24, opacity: 0, duration: 0.9 }, 0.7)
          .from(".hero-side-r", { x: 24, opacity: 0, duration: 0.9 }, 0.8);

        // the globe drifts up and keeps turning as the hero scrolls away
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".hero-globe", { yPercent: -10, scale: 0.92, ease: "none", scrollTrigger: st });
        gsap.to(control.current, { scrollSpin: 1.4, ease: "none", scrollTrigger: st });
      });
    },
    { scope: root },
  );

  return (
    <section id="hero" ref={root} className="relative overflow-hidden pt-12 pb-[72px] text-center">
      <DotField className="fade-mask" />
      <div aria-hidden="true" className="spotlight top-[18%] left-1/2 h-[900px] w-[900px] -translate-x-1/2" />
      <div className="container-x relative">
        <h1
          aria-label="We speak business and technology."
          className="mx-auto max-w-[11em] text-[clamp(42px,7vw,96px)] leading-none tracking-[-0.045em]"
        >
          <span aria-hidden="true" className="hero-line block overflow-hidden pb-[0.16em] -mb-[0.1em]">
            <span className="inline-block">We speak business</span>
          </span>
          <span aria-hidden="true" className="hero-line block overflow-hidden pb-[0.16em] -mb-[0.1em]">
            <span className="inline-block">and technology.</span>
          </span>
        </h1>

        <div className="relative mx-auto -mt-7 max-w-[1180px]">
          <div className="hero-globe">
            <Globe control={control} />
          </div>
          <p className="hero-side-l mx-auto mt-3 max-w-[34em] text-[17px] leading-[1.55] text-muted lg:absolute lg:top-[30%] lg:left-0 lg:mt-0 lg:max-w-[250px] lg:text-left">
            Owners and managers get clear options and honest costs.
          </p>
          <p className="hero-side-r mx-auto mt-3 max-w-[34em] text-[17px] leading-[1.55] text-muted lg:absolute lg:top-[56%] lg:right-0 lg:mt-0 lg:max-w-[250px] lg:text-right">
            Engineers and vendors get a precise scope and one point of contact.
          </p>
        </div>

        <p className="lede mx-auto mt-2 mb-[34px] text-[20px]">
          Linkin World turns what you need to achieve into technology that works, across security, cloud,
          networks and automation. From Islamabad, for clients anywhere.
        </p>
        <a href="#contact" className="btn">
          Book a free 20-minute call
        </a>
        <span className="mt-4 block text-sm text-faint">Drag the globe to spin it</span>
      </div>
    </section>
  );
}
