import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { contactInfo, expectations } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a free 20-minute discovery call with Linkin World. We reply within one business day.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Tell us what’s happening."
        intro="Have a question, a project in mind, or want to see whether we can help? Send a note. We reply within one business day."
        rings={false}
      />
      <section className="pb-28">
        <div className="container-x grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-[28px] bg-accent p-[clamp(24px,4vw,56px)] text-accent-ink">
            <ContactForm />
          </div>
          <aside className="grid content-start gap-10">
            <div>
              <h2 className="mb-4 text-xl">What to expect from the call</h2>
              <ul className="grid gap-3">
                {expectations.map((e) => (
                  <li key={e} className="flex items-baseline gap-3 text-muted">
                    <span aria-hidden="true" className="h-2 w-2 flex-none translate-y-[-2px] rounded-full bg-accent" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-xl">Prefer to reach us directly?</h2>
              <div className="grid gap-2 text-lg">
                <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                <a href={contactInfo.whatsapp} target="_blank" rel="noreferrer">
                  WhatsApp {contactInfo.phone}
                </a>
                <span className="text-muted">{contactInfo.city}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
