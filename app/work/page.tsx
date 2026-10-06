import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CaseCard } from "@/components/case-card";
import { CtaBand } from "@/components/cta-band";
import { work } from "@/lib/work";

export const metadata: Metadata = {
  title: "Work",
  description: "Case studies across cloud migration, ISO 27001, enterprise networks, business automation and RF communications.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        title="Informed direction. Clear outcomes."
        intro="Practical experience across technology domains, turning business objectives into technical results you can measure. Client names are withheld; the numbers are real."
      />
      <section className="pb-28">
        <div className="container-x grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-6">
          {work.map((w, i) => (
            <CaseCard key={w.slug} item={w} index={i} />
          ))}
        </div>
      </section>
      <CtaBand title="Have a problem like these?" />
    </>
  );
}
