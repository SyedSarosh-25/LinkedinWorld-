import { contactInfo } from "@/lib/content";
import { ContactForm } from "./contact-form";
import { OrbitLines } from "./orbit-lines";

export function Contact() {
  return (
    <section id="contact" className="pb-24">
      <div className="container-x">
        <div className="relative grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-12 overflow-hidden rounded-[28px] bg-accent p-[clamp(28px,5vw,72px)] text-accent-ink">
          <OrbitLines className="-bottom-[260px] -left-[220px]" />
          <div className="relative">
            <h2 className="h2 mb-[18px]">Tell us what you’re trying to solve.</h2>
            <p className="max-w-[34em] text-[19px] opacity-90">
              A free 20-minute call. We listen, ask a few focused questions and suggest a sensible next step. We reply within one
              business day.
            </p>
            <div className="mt-8 grid gap-1.5 text-lg">
              <a href={`mailto:${contactInfo.email}`} className="text-inherit">
                {contactInfo.email}
              </a>
              <a href={contactInfo.whatsapp} className="text-inherit" target="_blank" rel="noreferrer">
                WhatsApp {contactInfo.phone}
              </a>
              <span>{contactInfo.city}</span>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
