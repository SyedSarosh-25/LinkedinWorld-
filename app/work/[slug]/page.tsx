import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { CountUp } from "@/components/count-up";
import { CtaBand } from "@/components/cta-band";
import { getCase, work } from "@/lib/work";
import { getService } from "@/lib/services";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const w = getCase((await params).slug);
  if (!w) return {};
  return { title: w.title, description: w.summary, alternates: { canonical: `/work/${w.slug}` } };
}

export default async function CasePage({ params }: Props) {
  const w = getCase((await params).slug);
  if (!w) notFound();
  const idx = work.findIndex((x) => x.slug === w.slug);
  const next = work[(idx + 1) % work.length];
  const svc = w.services.map(getService).filter((s) => s !== undefined);

  return (
    <>
      <PageHero title={w.title} intro={w.summary} rings={false} crumbs={[{ href: "/work", label: "Work" }, { href: `/work/${w.slug}`, label: w.domain }]} />

      <section className="bg-band py-20 text-band-fg">
        <div className="container-x grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-10">
          {w.metrics.map((m, i) => (
            <div key={m.label} className="border-t-2 border-band-accent pt-6">
              <CountUp metric={m} delay={i * 0.12} className="block text-[clamp(60px,8vw,112px)] leading-none font-semibold tracking-[-0.05em]" />
              <p className="mt-4 text-lg text-band-muted">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="max-w-[38em]">
            <h2 className="mb-6 text-2xl tracking-[-0.02em]">What we did</h2>
            {w.body.map((p) => (
              <p key={p} className="mb-5 text-[20px] leading-[1.65] text-muted">
                {p}
              </p>
            ))}
          </div>
          <aside className="grid content-start gap-10">
            <div>
              <h2 className="mb-3 text-[15px] font-semibold text-faint">Services</h2>
              <ul className="grid gap-2">
                {svc.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="text-lg">
                      {s.title.charAt(0).toUpperCase() + s.title.slice(1)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-3 text-[15px] font-semibold text-faint">Technology</h2>
              <div className="flex flex-wrap gap-2">
                {w.tech.map((t) => (
                  <span key={t} className="rounded-full border border-line px-3.5 py-1.5 text-[15px] text-muted">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-x">
          <Link href={`/work/${next.slug}`} className="group block border-t border-line pt-8 text-fg no-underline">
            <span className="text-[15px] text-faint">Next case study</span>
            <span className="mt-2 block text-[clamp(30px,4vw,54px)] leading-tight font-semibold tracking-[-0.035em] transition-colors duration-300 group-hover:text-accent">
              {next.title} <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">›</span>
            </span>
          </Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
