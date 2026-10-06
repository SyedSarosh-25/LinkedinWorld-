import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { services, engagements } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description: "Solution delivery, cybersecurity and compliance, cloud and infrastructure, and automation and AI. Platform-neutral advice, delivered end to end.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Choose the right approach. Get it delivered."
        intro="Whether you need a new system, stronger security, resilient infrastructure or smarter automation, we help you decide what fits and then see it through."
      />

      <section className="pb-24">
        <div className="container-x border-t border-line">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group grid grid-cols-1 gap-4 border-b border-line py-10 text-fg no-underline md:grid-cols-[1.1fr_1.4fr_auto] md:items-baseline md:gap-10"
            >
              <h2 className="text-[clamp(26px,3vw,38px)] leading-tight tracking-[-0.03em] transition-colors duration-300 group-hover:text-accent">{s.title}</h2>
              <div>
                <p className="text-lg text-muted">{s.short}</p>
                <p className="mt-3 text-[15px] text-faint">{s.scope.slice(0, 4).join(", ")} and more</p>
              </div>
              <span
                aria-hidden="true"
                className="hidden h-12 w-12 items-center justify-center rounded-full border border-line text-xl transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink md:flex"
              >
                ›
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="engagements" className="bg-surface py-28">
        <div className="container-x">
          <h2 className="h2 max-w-[16em]">Ways to work with us</h2>
          <p className="lede mt-4 mb-12">Most clients start with a call or an audit, then grow into a project or ongoing advice.</p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-x-8 gap-y-10">
            {engagements.map((e) => (
              <div key={e.title} className="border-t-2 border-accent pt-5">
                <h3 className="text-xl tracking-[-0.01em]">{e.title}</h3>
                <p className="mt-2 text-muted">{e.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="pt-24">
        <CtaBand />
      </div>
    </>
  );
}
