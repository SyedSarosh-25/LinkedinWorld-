import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { CaseCard } from "@/components/case-card";
import { getService, services } from "@/lib/services";
import { work } from "@/lib/work";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return { title: s.title.charAt(0).toUpperCase() + s.title.slice(1), description: s.intro, alternates: { canonical: `/services/${s.slug}` } };
}

export default async function ServicePage({ params }: Props) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const title = s.title.charAt(0).toUpperCase() + s.title.slice(1);
  const related = work.filter((w) => s.work.includes(w.slug));
  const others = services.filter((o) => o.slug !== s.slug);

  return (
    <>
      <PageHero title={title} intro={s.intro} crumbs={[{ href: "/services", label: "Services" }, { href: `/services/${s.slug}`, label: title }]}>
        <p className="mt-8 border-l-2 border-accent pl-5 text-lg">
          Sounds like you? <span className="text-muted">“{s.problem}”</span>
        </p>
      </PageHero>

      <section className="bg-surface py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <h2 className="h2">What’s included</h2>
          <ul className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            {s.scope.map((item) => (
              <li key={item} className="flex items-baseline gap-3 border-b border-line py-4 text-lg">
                <span aria-hidden="true" className="h-2 w-2 flex-none translate-y-[-2px] rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-24">
        <div className="container-x">
          <p className="text-[15px] text-faint">What you end up with</p>
          <p className="mt-3 max-w-[18em] text-[clamp(32px,4.4vw,60px)] leading-[1.08] font-semibold tracking-[-0.035em]">{s.outcome}</p>
          <div className="mt-10 flex flex-wrap gap-2">
            {s.tech.map((t) => (
              <span key={t} className="rounded-full border border-line px-4 py-2 text-[15px] text-muted">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="pb-24">
          <div className="container-x">
            <h2 className="h2 mb-10">Related work</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-6">
              {related.map((w, i) => (
                <CaseCard key={w.slug} item={w} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pb-24">
        <div className="container-x">
          <h2 className="mb-6 text-xl">Other services</h2>
          <div className="flex flex-wrap gap-3">
            {others.map((o) => (
              <Link key={o.slug} href={`/services/${o.slug}`} className="rounded-full bg-surface px-5 py-3 text-fg no-underline shadow-[inset_0_0_0_1px_var(--line)] hover:text-accent">
                {o.title.charAt(0).toUpperCase() + o.title.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Not sure this is the right fit?" text="Book a free 20-minute call. We’ll tell you honestly whether this service is what you need." />
    </>
  );
}
