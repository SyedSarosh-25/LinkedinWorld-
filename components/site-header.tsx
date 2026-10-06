"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { nav } from "@/lib/content";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-[21px] font-bold tracking-[-0.01em] text-fg no-underline" aria-label="Linkin World home">
      <svg width="30" height="20" viewBox="0 0 30 20" fill="none" strokeWidth="2.4" aria-hidden="true">
        <circle cx="10" cy="10" r="7" stroke="var(--faint)" />
        <circle cx="20" cy="10" r="7" stroke="var(--accent)" />
      </svg>
      Linkin World
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu on navigation
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    document.body.style.overflow = open ? "hidden" : "";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (open) {
      el.hidden = false;
      if (!reduced) {
        gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.5, ease: "power3.out" });
        gsap.fromTo(el.querySelectorAll("a"), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.05, delay: 0.1, ease: "power3.out" });
      }
    } else if (!el.hidden) {
      if (reduced) el.hidden = true;
      else gsap.to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.35, ease: "power2.in", onComplete: () => void (el.hidden = true) });
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        button.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={`mx-auto flex max-w-[1240px] items-center justify-between gap-6 rounded-full border py-2.5 pr-2.5 pl-5 backdrop-blur-xl transition-colors duration-500 sm:pl-7 ${scrolled || open ? "border-white/12 bg-black/55" : "border-white/8 bg-black/25"}`}
      >
        <Logo />
        <nav aria-label="Main" className="hidden gap-[34px] md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`relative text-base no-underline hover:text-accent ${isActive(n.href) ? "text-accent" : "text-fg"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/contact" className="hidden min-h-[44px] items-center rounded-full bg-accent px-5 text-[15px] font-semibold text-accent-ink no-underline transition-transform hover:-translate-y-0.5 sm:inline-flex">
            Book a free call
          </Link>
          <button
            ref={button}
            type="button"
            className="relative h-11 w-11 cursor-pointer md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={`absolute left-2.5 h-0.5 w-6 rounded bg-fg transition-transform duration-300 ${open ? "top-[21px] rotate-45" : "top-4"}`} />
            <span className={`absolute left-2.5 h-0.5 w-6 rounded bg-fg transition-transform duration-300 ${open ? "top-[21px] -rotate-45" : "top-[26px]"}`} />
          </button>
        </div>
      </div>
    </header>

      {/* inner pages start below the floating bar; the home hero runs underneath it */}
      {pathname !== "/" && <div aria-hidden="true" className="h-[84px]" />}

      {/* outside the header: its backdrop-filter would trap a fixed child */}
      <div id="mobile-menu" ref={panel} hidden className="fixed inset-0 z-30 pt-24 overflow-y-auto bg-bg md:hidden">
        <nav aria-label="Mobile" className="container-x flex flex-col gap-2 pt-8">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={`py-2 text-[40px] leading-tight font-semibold tracking-[-0.03em] no-underline ${isActive(n.href) ? "text-accent" : "text-fg"}`}>
              {n.label}
            </Link>
          ))}
          <Link href="/contact" className="btn mt-8 self-start">
            Book a free 20-minute call
          </Link>
        </nav>
      </div>
    </>
  );
}
