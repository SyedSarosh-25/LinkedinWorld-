import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Process } from "@/components/process";
import { Team } from "@/components/team";
import { CtaBand } from "@/components/cta-band";
import { techGroups, whyUs } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "Linkin World helps organisations cut through the noise, make informed technology decisions and turn them into practical solutions.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="We speak business and technology."
        intro="Technology decisions get expensive fast when the best way forward isn’t clear. With so many tools, vendors and opinions, choosing what actually fits is hard. That’s where we come in."
      />

      <section className="bg-surface py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <h2 className="h2">Who we are</h2>
          <div className="grid max-w-[38em] gap-5 text-[19px] text-muted">
            <p>
              We help organisations cut through the noise, make informed technology decisions and turn those decisions into practical
              solutions, with less wasted time, cost and effort.
            </p>
            <p>
              Our technical delivery is backed by 15+ years of hands-on experience across IT and telecom infrastructure, cloud,
              cybersecurity and automation, for government, startups and established multinational organisations.
            </p>
          </div>
        </div>
      </section>

      <section className="py-28">
        <div className="container-x">
          <h2 className="h2 mb-14 max-w-[14em]">Why clients choose us</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-x-12 gap-y-12">
            {whyUs.map((w) => (
              <div key={w.title}>
                <h3 className="text-2xl tracking-[-0.02em]">{w.title}</h3>
                <p className="mt-3 text-muted">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-surface">
        <Process />
      </div>

      <section className="py-28">
        <div className="container-x">
          <h2 className="h2 max-w-[16em]">Platforms we deliver on</h2>
          <p className="lede mt-4 mb-12">We are platform-neutral. We recommend what fits your business and budget, not what pays the highest commission.</p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(230px,100%),1fr))] gap-10">
            {techGroups.map((g) => (
              <div key={g.title}>
                <h3 className="mb-4 border-b border-line pb-3 text-lg">{g.title}</h3>
                <ul className="grid gap-2 text-muted">
                  {g.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Team />
      <CtaBand />
    </>
  );
}
