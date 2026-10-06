"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { onPreloaderDone, scene } from "@/lib/scene-store";
import { services } from "@/lib/services";
import { work } from "@/lib/work";
import { contactInfo, steps } from "@/lib/content";
import { Magnetic } from "@/components/magnetic";

const Backdrop = dynamic(() => import("./backdrop"), { ssr: false });

const heroLines = ["We speak", "business &", "technology."];
const noiseLines = ["Too many tools.", "Too many vendors.", "Too many opinions."];
const connectWords = "We filter the noise and connect what actually fits your business.".split(" ");
const platforms = ["AWS", "Microsoft Azure", "Google Cloud", "Kubernetes", "Docker", "Microsoft 365", "Power BI", "Odoo", "HubSpot", "n8n", "Zapier", "Make", "ISO 27001", "SIEM"];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// The "noise": tools, vendors and buzzwords a business gets pitched. A few survive the filter.
// survivors get fixed spots around the rings, clear of the headline below
const KEEP_POS: Record<string, [number, number]> = {
  AWS: [9, 22],
  "Microsoft 365": [74, 15],
  Odoo: [86, 44],
  "ISO 27001": [40, 12],
  Fortinet: [14, 46],
};
const KEEP = new Set(Object.keys(KEEP_POS));
const tagNames = [
  "AWS", "Azure", "Google Cloud", "Oracle", "SAP", "Salesforce", "Microsoft 365", "Zoho", "HubSpot", "Odoo",
  "Fortinet", "Palo Alto", "Cisco", "Sophos", "CrowdStrike", "Okta", "Splunk", "SIEM", "Zero Trust", "ISO 27001",
  "Kubernetes", "Docker", "Terraform", "VMware", "Hyper-V", "Jira", "ServiceNow", "Slack", "Power BI", "Tableau",
  "n8n", "Zapier", "Make", "RPA", "GenAI", "Copilot", "SD-WAN", "Firewall", "VPN", "Backup", "DR", "SOC 2",
];
const tags = (() => {
  let s = 99;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return tagNames.map((name) => {
    const depth = r(); // 0 far, 1 near
    const left = 3 + r() * 90;
    const top = 8 + r() * 82;
    const fixed = KEEP_POS[name];
    return {
      name,
      keep: KEEP.has(name),
      left: fixed ? fixed[0] : left,
      top: fixed ? fixed[1] : top,
      size: 12 + depth * 14,
      blur: depth < 0.3 ? 2.5 - depth * 6 : 0,
      alpha: 0.25 + depth * 0.45,
      dur: 9 + r() * 10,
      delay: -r() * 12,
    };
  });
})();

export function Home() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      scene.target = 0;
      scene.progress = 0;
      scene.offsetX = 2.3;

      // ---- intro, after the preloader curtain lifts
      let off = () => {};
      if (reduced) {
        scene.intro = 1;
      } else {
        scene.intro = 0;
        gsap.set(".h-char", { yPercent: 115 });
        gsap.set(".h-fade", { opacity: 0, y: 20 });
        off = onPreloaderDone(() => {
          gsap.to(scene, { intro: 1, duration: 2.8, ease: "power3.out" });
          gsap.to(".h-char", { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.018, delay: 0.1 });
          gsap.to(".h-fade", { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.08, delay: 0.7 });
        });
      }

      // ---- scroll drives the particle story
      const map = (trigger: string, start: string, end: string, fn: (p: number) => void) =>
        ScrollTrigger.create({ trigger, start, end, scrub: true, onUpdate: (s) => fn(s.progress) });
      map("#s-noise", "top bottom", "center center", (p) => {
        scene.target = p;
        scene.offsetX = 2.3 * (1 - p);
      });
      map("#s-connect", "top bottom", "center center", (p) => (scene.target = 1 + p));
      map("#s-cases", "top bottom", "top top", (p) => (scene.target = 2 + p));
      map("#s-cta", "top bottom", "center center", (p) => (scene.target = 3 - p));

      // ---- backdrop dims under reading-heavy sections
      const dim = (trigger: string, from: number, to: number) =>
        gsap.fromTo("#backdrop", { opacity: from }, { opacity: to, ease: "none", immediateRender: false, scrollTrigger: { trigger, start: "top 85%", end: "top 25%", scrub: true } });
      dim("#s-services", 1, 0.22);
      dim("#s-cases", 0.22, 1);
      dim("#s-process", 1, 0.2);
      dim("#s-cta", 0.2, 1);

      // ---- noise lines light up one after another
      gsap.timeline({ scrollTrigger: { trigger: "#s-noise", start: "top top", end: "bottom bottom", scrub: true } })
        .fromTo(".n-line", { opacity: 0.12 }, { opacity: 1, stagger: 0.5, duration: 0.5 })
        .fromTo(".n-coda", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 });

      // ---- vendor noise: flood in, then get filtered down to what fits
      gsap.fromTo("#tags", { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: "#s-noise", start: "top 70%", end: "top top", scrub: true } });
      gsap.fromTo(".tag", { scale: 0.6 }, { scale: 1, ease: "power2.out", stagger: { each: 0.02, from: "random" }, scrollTrigger: { trigger: "#s-noise", start: "top 70%", end: "top top", scrub: true } });
      gsap.timeline({ scrollTrigger: { trigger: "#s-connect", start: "top 80%", end: "center center", scrub: true } })
        .to(".tag-drop", { opacity: 0, scale: 0.5, filter: "blur(10px)", stagger: { each: 0.015, from: "random" }, ease: "power1.in" })
        .to(".tag-keep", { opacity: 1, scale: 1.25, color: "var(--accent)", borderColor: "var(--accent)", filter: "blur(0px)", duration: 0.4 }, "-=0.2");
      gsap.fromTo("#tags", { opacity: 1 }, { opacity: 0, ease: "none", immediateRender: false, scrollTrigger: { trigger: "#s-connect", start: "center center", end: "bottom 70%", scrub: true } });

      // ---- connect sentence word by word
      gsap.fromTo(".c-word", { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: "#s-connect", start: "top top", end: "bottom bottom", scrub: true } });

      // ---- horizontal case studies on wide screens
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px)", () => {
        const track = document.querySelector<HTMLElement>(".cases-track");
        if (!track) return;
        const distance = () => track.scrollWidth - window.innerWidth + 64;
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: "#s-cases-pin", start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
        });
      });

      // ---- process numbers rise in
      gsap.fromTo(".p-step", { y: 60 }, { y: 0, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: "#s-process", start: "top 75%", end: "top 30%", scrub: true } });

      // ---- CTA headline scales up as it arrives
      gsap.fromTo(".cta-big", { scale: 0.85 }, { scale: 1, ease: "none", scrollTrigger: { trigger: "#s-cta", start: "top bottom", end: "center center", scrub: true } });

      return () => off();
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <div id="backdrop" aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <Backdrop />
      </div>

      {/* floating vendor names: appear with the noise, get filtered as the rings form */}
      <div id="tags" aria-hidden="true" className="pointer-events-none fixed inset-0 z-[5] overflow-hidden opacity-0">
        {tags.map((t, i) => (
          <span
            key={t.name}
            className={`tag absolute whitespace-nowrap ${i % 2 && !t.keep ? "max-md:hidden" : ""}`}
            style={{ left: `${t.left}%`, top: `${t.top}%` }}
          >
            <span className="tag-drift inline-block" style={{ animation: `tagdrift ${t.dur}s ease-in-out ${t.delay}s infinite alternate` }}>
              <span
                className={`${t.keep ? "tag-keep" : "tag-drop"} inline-block rounded-full border border-line px-3 py-1 font-medium tracking-tight text-fg`}
                style={{ fontSize: t.size, opacity: t.alpha, filter: t.blur ? `blur(${t.blur}px)` : undefined }}
              >
                {t.name}
              </span>
            </span>
          </span>
        ))}
      </div>

      <div className="relative z-10">
        {/* ---------------- HERO ---------------- */}
        <section className="relative flex min-h-[100svh] flex-col justify-end pt-32 pb-10">
          <div className="container-x">
            <p className="h-fade mb-10 max-w-[30em] text-lg text-muted md:absolute md:top-36 md:max-w-[22em]">
              Technology consulting and delivery across cybersecurity, cloud, networks and automation.
            </p>
            <h1 aria-label="We speak business and technology." className="display text-[clamp(32px,8.2vw,148px)] uppercase">
              {heroLines.map((line) => (
                <span key={line} aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
                  {line.split(" ").map((word, wi, arr) => (
                    <span key={wi} className="inline-block whitespace-nowrap">
                      {word.split("").map((ch, i) => (
                        <span key={i} className="h-char inline-block">
                          {ch}
                        </span>
                      ))}
                      {wi < arr.length - 1 ? "\u00a0" : ""}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6">
              <span className="h-fade text-faint">Islamabad, serving clients worldwide</span>
              <Magnetic className="h-fade">
                <Link href="/contact" className="btn" data-cursor="Talk">
                  Book a free 20-minute call
                </Link>
              </Magnetic>
              <span className="h-fade flex items-center gap-3 text-faint">
                Scroll
                <span className="relative block h-10 w-px overflow-hidden bg-line">
                  <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.6s_ease-in-out_infinite] bg-accent" />
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* ---------------- NOISE ---------------- */}
        <section id="s-noise" className="relative h-[260vh]">
          <div className="sticky top-0 flex h-[100svh] items-center">
            <div className="container-x">
              {noiseLines.map((l) => (
                <p key={l} className="n-line display text-[clamp(34px,6.4vw,116px)] uppercase">
                  {l}
                </p>
              ))}
              <p className="n-coda mt-10 max-w-[28em] text-[clamp(20px,2vw,26px)] text-muted">
                Most of it doesn’t apply to you. Choosing what actually fits is where technology money gets lost.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------- CONNECT ---------------- */}
        <section id="s-connect" className="relative h-[240vh]">
          <div className="sticky top-0 flex h-[100svh] items-end pb-[12vh]">
            <div className="container-x">
              <p className="max-w-[16em] text-[clamp(34px,5.4vw,88px)] leading-[1.02] font-semibold tracking-[-0.035em]">
                {connectWords.map((w, i) => (
                  <span key={i} className="c-word">
                    {w}{" "}
                  </span>
                ))}
              </p>
              <p className="mt-8 max-w-[34em] text-lg text-muted">
                15+ years of hands-on work across IT and telecom infrastructure, cloud, cybersecurity and automation, for government,
                startups and multinationals.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------- SERVICES ---------------- */}
        <section id="s-services" className="relative py-32">
          <div className="container-x">
            <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
              <h2 className="display text-[clamp(44px,7vw,120px)] uppercase">What we do</h2>
              <p className="max-w-[24em] text-lg text-muted">Platform-neutral advice, delivered end to end. We recommend what fits, not what pays a commission.</p>
            </div>
            <ul className="border-t border-line">
              {services.map((s) => (
                <li key={s.slug} className="border-b border-line">
                  <Link href={`/services/${s.slug}`} data-cursor="View" className="group grid gap-4 py-10 text-fg no-underline md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <h3 className="display text-[clamp(30px,4.6vw,76px)] uppercase transition-[color,transform] duration-500 group-hover:translate-x-4 group-hover:text-accent">
                        {cap(s.title)}
                      </h3>
                      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
                        <div className="overflow-hidden">
                          <p className="pt-5 text-lg text-muted md:pl-4">{s.short}</p>
                          <div className="flex flex-wrap gap-2 pt-4 md:pl-4">
                            {s.scope.slice(0, 5).map((x) => (
                              <span key={x} className="rounded-full border border-line px-3 py-1 text-sm text-muted">
                                {x}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <span
                      aria-hidden="true"
                      className="hidden h-20 w-20 items-center justify-center rounded-full border border-line text-3xl transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink md:flex"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- CASES (horizontal) ---------------- */}
        <section id="s-cases" className="relative">
          <div id="s-cases-pin" className="flex min-h-[100svh] flex-col justify-center overflow-hidden py-24">
            <div className="container-x mb-12 flex flex-wrap items-end justify-between gap-6">
              <h2 className="display text-[clamp(44px,7vw,120px)] uppercase">Proof</h2>
              <Link href="/work" className="text-lg font-semibold text-accent" data-cursor="All">
                All case studies
              </Link>
            </div>
            <div className="cases-track flex flex-col gap-6 px-4 sm:px-8 min-[900px]:w-max min-[900px]:flex-row min-[900px]:pl-[max(2rem,calc((100vw-1240px)/2+2rem))]">
              {work.map((w) => {
                const m = w.metrics[0];
                return (
                  <Link
                    key={w.slug}
                    href={`/work/${w.slug}`}
                    data-cursor="Read"
                    className="group relative flex min-h-[460px] flex-col justify-between overflow-hidden rounded-[28px] border border-line bg-[rgba(12,16,20,0.72)] p-9 text-fg no-underline backdrop-blur-md transition-colors duration-500 hover:border-accent min-[900px]:w-[min(560px,80vw)]"
                  >
                    <span className="text-faint">{w.domain}</span>
                    <div>
                      <div className="display text-[clamp(84px,10vw,150px)] text-accent">
                        {m.value === null ? m.display : `${m.value}${m.suffix ?? ""}`}
                      </div>
                      <p className="mt-2 text-muted">{m.label}</p>
                    </div>
                    <div>
                      <h3 className="text-[28px] leading-tight tracking-[-0.02em]">{w.title}</h3>
                      <p className="mt-2 text-muted">{w.summary}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------- PROCESS ---------------- */}
        <section id="s-process" className="relative py-32">
          <div className="container-x">
            <h2 className="display mb-16 max-w-[10em] text-[clamp(40px,6vw,104px)] uppercase">Decide first. Spend second.</h2>
            <ol className="grid list-none gap-10 p-0 md:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.title} className="p-step border-t border-line pt-6">
                  <span className="display outline-text block text-[clamp(64px,7vw,120px)]">0{i + 1}</span>
                  <h3 className="mt-4 text-2xl tracking-[-0.02em]">{s.title}</h3>
                  <p className="mt-2 text-muted">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- MARQUEE ---------------- */}
        <section aria-label="Platforms we work with" className="relative overflow-hidden border-y border-line py-10">
          <div className="marquee flex w-max gap-12 whitespace-nowrap">
            {[...platforms, ...platforms].map((p, i) => (
              <span key={i} className="display text-[clamp(40px,6vw,96px)] uppercase">
                {p} <span className="text-accent">•</span>
              </span>
            ))}
          </div>
          <div className="marquee-rev mt-4 flex w-max gap-12 whitespace-nowrap">
            {[...platforms.slice().reverse(), ...platforms.slice().reverse()].map((p, i) => (
              <span key={i} className="display outline-text text-[clamp(40px,6vw,96px)] uppercase">
                {p} •
              </span>
            ))}
          </div>
        </section>

        {/* ---------------- CTA ---------------- */}
        <section id="s-cta" className="relative flex min-h-[110svh] items-center py-32 text-center">
          <div className="container-x">
            <p className="text-lg text-muted">Free 20-minute discovery call. No obligation.</p>
            <h2 className="cta-big display mt-6 text-[clamp(72px,16vw,280px)] uppercase">Let’s talk.</h2>
            <div className="mt-12 flex flex-col items-center gap-8">
              <Magnetic strength={0.45}>
                <Link
                  href="/contact"
                  data-cursor="Go"
                  className="flex h-44 w-44 items-center justify-center rounded-full bg-accent p-6 text-center text-lg leading-tight font-semibold text-accent-ink no-underline transition-transform duration-300 hover:scale-105"
                >
                  Book a free call
                </Link>
              </Magnetic>
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-lg">
                <a href={`mailto:${contactInfo.email}`} className="text-fg">
                  {contactInfo.email}
                </a>
                <a href={contactInfo.whatsapp} target="_blank" rel="noreferrer" className="text-fg">
                  WhatsApp {contactInfo.phone}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
