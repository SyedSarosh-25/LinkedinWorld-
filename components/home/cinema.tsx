"use client";

/* eslint-disable @next/next/no-img-element -- remote stock photos, plain <img> keeps them simple until they move to /public */

import Link from "next/link";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { onPreloaderDone } from "@/lib/scene-store";
import { services } from "@/lib/services";
import { work } from "@/lib/work";
import { contactInfo, steps, whyUs } from "@/lib/content";
import { media } from "@/lib/media";
import { Magnetic } from "@/components/magnetic";

const platformNames = ["AWS", "Microsoft Azure", "Google Cloud", "Microsoft 365", "Cisco Meraki", "Docker", "Kubernetes", "Power BI", "Odoo", "HubSpot", "n8n", "Zapier", "Make"];
const capabilities = ["Cybersecurity", "Cloud", "Networks", "ISO 27001", "Automation", "AI agents", "RF systems", "Infrastructure"];

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

const metricText = (m: (typeof work)[number]["metrics"][number]) => (m.value != null ? `${m.value}${m.suffix ?? ""}` : m.display ?? "");

export function Cinema() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // ---------- hero: slow crossfading, slowly pushing-in photography
      const slides = gsap.utils.toArray<HTMLElement>(".hero-slide");
      if (!reduced && slides.length > 1) {
        gsap.set(slides, { opacity: 0 });
        gsap.set(slides[0], { opacity: 1 });
        const hold = 6;
        const fade = 1.8;
        const tl = gsap.timeline({ repeat: -1 });
        slides.forEach((s, i) => {
          const next = slides[(i + 1) % slides.length];
          const t = i * hold;
          tl.fromTo(s.querySelector("img"), { scale: 1.16 }, { scale: 1, duration: hold + fade, ease: "none" }, t === 0 ? 0 : t - fade);
          tl.to(s, { opacity: 0, duration: fade, ease: "power1.inOut" }, t + hold - fade);
          tl.to(next, { opacity: 1, duration: fade, ease: "power1.inOut" }, t + hold - fade);
        });
      }

      // ---------- hero text, after the preloader curtain
      let off = () => {};
      if (!reduced) {
        gsap.set(".hl-in", { yPercent: 110 });
        gsap.set(".hero-fade", { opacity: 0, y: 24 });
        off = onPreloaderDone(() => {
          gsap.to(".hl-in", { yPercent: 0, duration: 1.2, ease: "power4.out", stagger: 0.12 });
          gsap.to(".hero-fade", { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1, delay: 0.5 });
        });
        // the hero sinks away as you leave it
        gsap.to(".hero-inner", { yPercent: 18, opacity: 0, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });
      }

      // ---------- "IN THE FIELD": giant word, the photo opens out of it to full screen
      if (!reduced) {
        gsap
          .timeline({ scrollTrigger: { trigger: "#field", start: "top top", end: "bottom bottom", scrub: true } })
          .fromTo(".field-word", { scale: 1 }, { scale: 1.5, opacity: 0, duration: 0.5, ease: "power2.in" }, 0)
          .fromTo(".field-img", { clipPath: "inset(30% 34% 30% 34% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.6, ease: "power2.inOut" }, 0.05)
          .fromTo(".field-img img", { scale: 1.35 }, { scale: 1, duration: 0.6, ease: "power2.inOut" }, 0.05)
          .fromTo(".field-copy > *", { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.25 }, 0.62);
      }

      // ---------- generic reveals
      if (!reduced) {
        gsap.set(".rv", { opacity: 0, y: 48 });
        ScrollTrigger.batch(".rv", {
          start: "top 88%",
          onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.09, overwrite: true }),
        });
        gsap.utils.toArray<HTMLElement>(".parallax img").forEach((img) => {
          gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
        });
      }

      return () => off();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="bg-bg">
      {/* ================= HERO ================= */}
      <section id="hero" className="relative h-[100svh] min-h-[620px] overflow-hidden">
        {media.hero.map((s, i) => (
          <div key={s.src} className="hero-slide absolute inset-0" style={{ opacity: i === 0 ? 1 : 0, zIndex: 1 }}>
            <img src={s.src} alt={i === 0 ? s.alt : ""} className="h-full w-full object-cover" fetchPriority={i === 0 ? "high" : "low"} />
          </div>
        ))}
        <div aria-hidden="true" className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_50%_45%,rgba(5,7,10,0.35)_0%,rgba(5,7,10,0.82)_70%,rgba(5,7,10,0.95)_100%)]" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-b from-transparent to-bg" />

        <div className="hero-inner relative z-20 flex h-full flex-col items-center justify-center px-4 pt-16 text-center">
          <span className="hero-fade eyebrow mb-6">Technology consulting · Islamabad</span>
          <h1 className="max-w-[14em] text-[clamp(40px,6.6vw,108px)] leading-[1.02] font-bold tracking-[-0.045em]">
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="hl-in block">We speak business</span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="hl-in block bg-gradient-to-r from-fg via-fg to-fg/35 bg-clip-text text-transparent">&amp; technology.</span>
            </span>
          </h1>
          <p className="hero-fade mt-6 max-w-[34em] text-[clamp(16px,1.4vw,19px)] text-fg/75">
            Cybersecurity, cloud, networks and automation, planned around your business and delivered by one accountable team.
          </p>
          <div className="hero-fade mt-10 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <Link href="/contact" className="pill" data-cursor="Talk">
                Book a free 20-min call
              </Link>
            </Magnetic>
            <Link href="/work" className="pill-ghost">
              See our work <Arrow />
            </Link>
          </div>
        </div>

        <div className="hero-fade absolute inset-x-0 bottom-8 z-20">
          <div className="container-x flex items-end justify-between text-[13px] text-fg/55">
            <span>Serving clients worldwide</span>
            <span className="flex items-center gap-3">
              Scroll
              <span className="relative block h-9 w-px overflow-hidden bg-white/20">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.6s_ease-in-out_infinite] bg-accent" />
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* ================= PLATFORMS ================= */}
      <section aria-label="Platforms we deliver on" className="border-y border-line py-10">
        <p className="container-x mb-6 text-center text-[13px] font-semibold tracking-[0.18em] text-faint uppercase">Delivering on the platforms you already use</p>
        <div className="fade-x overflow-hidden">
          <div className="marquee flex w-max items-center gap-14 pr-14">
            {[...platformNames, ...platformNames].map((p, i) => (
              <span key={i} aria-hidden={i >= platformNames.length} className="text-[clamp(20px,2.2vw,30px)] font-semibold tracking-[-0.02em] whitespace-nowrap text-fg/45">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= IN THE FIELD (showreel moment) ================= */}
      <section id="field" className="relative h-[280vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div className="field-img absolute inset-0" style={{ clipPath: "inset(30% 34% 30% 34% round 28px)" }}>
            <img src={media.field.src} alt={media.field.alt} className="h-full w-full object-cover" loading="lazy" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/40 to-bg/10" />
          </div>
          <div aria-hidden="true" className="field-word pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="display text-[clamp(40px,9.6vw,180px)] whitespace-nowrap uppercase">In the field</span>
          </div>
          <div className="field-copy absolute inset-x-0 bottom-0 pb-[10vh]">
            <div className="container-x grid items-end gap-10 md:grid-cols-[1.3fr_1fr]">
              <h2 className="h2 max-w-[14em] font-semibold">15+ years hands-on across IT and telecom infrastructure.</h2>
              <div className="flex gap-10">
                <div>
                  <div className="text-[clamp(40px,4.4vw,64px)] leading-none font-bold tracking-[-0.04em] text-accent">80%</div>
                  <div className="mt-2 text-[15px] text-fg/70">infrastructure cost cut in a data-center-to-cloud move</div>
                </div>
                <div>
                  <div className="text-[clamp(40px,4.4vw,64px)] leading-none font-bold tracking-[-0.04em] text-accent">ISO</div>
                  <div className="mt-2 text-[15px] text-fg/70">27001 led through to independent external audit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="py-28 md:py-36">
        <div className="container-x">
          <div className="rv mx-auto max-w-[44rem] text-center">
            <span className="eyebrow">How we work</span>
            <h2 className="h2 mt-4 font-semibold">From first audit to go-live</h2>
            <p className="mx-auto mt-5 max-w-[34em] text-[18px] text-muted">One team that plans it, buys it right, builds it and stays after launch.</p>
          </div>
          <ol className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rv group rounded-[28px] border border-line bg-surface p-3">
                <div className="parallax relative aspect-[4/3] overflow-hidden rounded-[20px]">
                  <img src={media.steps[i].src} alt={media.steps[i].alt} loading="lazy" className="object-cover" />
                  <span className="absolute top-3 left-3 rounded-full bg-black/55 px-3 py-1 text-[13px] font-semibold backdrop-blur-md">0{i + 1}</span>
                </div>
                <div className="px-3 pt-5 pb-4">
                  <h3 className="text-[22px] font-semibold tracking-[-0.02em]">{s.title}</h3>
                  <p className="mt-2 text-[15.5px] leading-relaxed text-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="rv mt-14 flex justify-center">
            <Link href="/services" className="pill">
              Explore services <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="pb-28 md:pb-36">
        <div className="container-x">
          <div className="rv flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow">What we deliver</span>
              <h2 className="h2 mt-4 max-w-[12em] font-semibold">Four things, done properly</h2>
            </div>
            <Link href="/services" className="pill-ghost">
              All services <Arrow />
            </Link>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {services.map((s, i) => {
              const m = media.services[s.slug];
              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  data-cursor="Open"
                  className="rv group relative block aspect-[4/5] overflow-hidden rounded-[28px] no-underline md:aspect-[16/12]"
                >
                  <img src={m.src} alt={m.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]" />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5" />
                  <span className="absolute top-5 right-5 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-fg backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:bg-accent group-hover:text-accent-ink">
                    <Arrow />
                  </span>
                  <span className="absolute top-6 left-6 text-[13px] font-semibold text-fg/70">0{i + 1}</span>
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <h3 className="max-w-[14em] text-[clamp(24px,2.6vw,36px)] leading-[1.08] font-semibold tracking-[-0.03em] text-fg">{s.title}</h3>
                    <p className="mt-3 max-w-[28em] text-[16px] text-fg/75">{s.short}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= WORK ================= */}
      <section className="pb-28 md:pb-36">
        <div className="container-x rv flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow">Selected work</span>
            <h2 className="h2 mt-4 max-w-[14em] font-semibold">Projects that are running today</h2>
          </div>
          <Link href="/work" className="pill-ghost">
            All case studies <Arrow />
          </Link>
        </div>
        <div className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:px-8 lg:px-[max(2rem,calc((100vw-1240px)/2+2rem))]">
          {work.map((w) => {
            const m = media.work[w.slug];
            const lead = w.metrics[0];
            return (
              <Link
                key={w.slug}
                href={`/work/${w.slug}`}
                data-cursor="View"
                className="rv group relative block aspect-[3/4] w-[78vw] shrink-0 snap-start overflow-hidden rounded-[28px] no-underline sm:w-[380px]"
              >
                <img src={m.src} alt={m.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                <span className="absolute top-5 left-5 rounded-full bg-black/50 px-3 py-1.5 text-[12.5px] font-semibold text-fg/90 backdrop-blur-md">{w.domain}</span>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  {lead && (
                    <div className="mb-3">
                      <span className="text-[44px] leading-none font-bold tracking-[-0.04em] text-accent">{metricText(lead)}</span>
                      <span className="ml-2 text-[14px] text-fg/70">{lead.label}</span>
                    </div>
                  )}
                  <h3 className="text-[24px] leading-[1.12] font-semibold tracking-[-0.02em] text-fg">{w.title}</h3>
                  <p className="mt-2 line-clamp-2 text-[15px] text-fg/70">{w.summary}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="pb-28 md:pb-36">
        <div className="container-x grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <div className="rv relative aspect-[4/5] overflow-hidden rounded-[28px] bg-surface">
            <img src="/team/haleema.jpg" alt="Haleema Khan, Marketing Director at Linkin World" className="absolute inset-0 h-full w-full object-cover object-[50%_25%]" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-5 left-5 rounded-2xl bg-black/45 px-4 py-3 backdrop-blur-md">
              <div className="font-semibold">Haleema Khan</div>
              <div className="text-[14px] text-fg/70">Marketing Director</div>
            </div>
          </div>
          <div>
            <span className="rv eyebrow">About Linkin World</span>
            <h2 className="rv h2 mt-4 font-semibold">The business side and the technology side, in one room.</h2>
            <div className="mt-10 grid gap-7">
              {whyUs.slice(0, 3).map((w) => (
                <div key={w.title} className="rv border-t border-line pt-6">
                  <h3 className="text-[20px] font-semibold tracking-[-0.02em]">{w.title}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-muted">{w.text}</p>
                </div>
              ))}
            </div>
            <Link href="/about" className="rv pill mt-10">
              Know more about us <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CAPABILITIES ================= */}
      <section aria-label="Capabilities" className="overflow-hidden border-y border-line py-10">
        <div className="marquee flex w-max items-center gap-12 pr-12">
          {[...capabilities, ...capabilities].map((c, i) => (
            <span key={i} aria-hidden={i >= capabilities.length} className={`display text-[clamp(44px,7vw,110px)] whitespace-nowrap uppercase ${i % 2 ? "outline-text" : ""}`}>
              {c}
              <span className="ml-12 text-accent">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative overflow-hidden">
        <div className="parallax absolute inset-0">
          <img src={media.cta.src} alt="" loading="lazy" className="object-cover" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-bg via-bg/70 to-bg" />
        <div className="container-x relative py-36 text-center md:py-48">
          <span className="rv eyebrow">Free 20-minute discovery call</span>
          <h2 className="rv mx-auto mt-5 max-w-[12em] text-[clamp(44px,7vw,112px)] leading-[0.98] font-bold tracking-[-0.045em]">
            Let’s sort out your <span className="bg-gradient-to-r from-fg to-fg/35 bg-clip-text text-transparent">technology.</span>
          </h2>
          <p className="rv mx-auto mt-6 max-w-[32em] text-[18px] text-fg/70">No pitch, no commitment. Tell us what’s going on and we’ll tell you honestly what we’d do.</p>
          <div className="rv mt-10 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <Link href="/contact" className="pill" data-cursor="Talk">
                Book the call
              </Link>
            </Magnetic>
            <a href={contactInfo.whatsapp} className="pill-ghost" target="_blank" rel="noopener noreferrer">
              WhatsApp us
            </a>
            <a href={`mailto:${contactInfo.email}`} className="pill-ghost">
              {contactInfo.email}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
