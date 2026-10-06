import Link from "next/link";
import { Logo } from "./site-header";
import { contactInfo } from "@/lib/content";
import { services } from "@/lib/services";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-line bg-bg pt-16 pb-10">
      <div className="container-x grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10">
        <div>
          <Logo />
          <p className="mt-4 max-w-[22em] text-[15px] text-muted">Technology consulting and delivery. Islamabad, serving clients worldwide.</p>
        </div>
        <div>
          <h2 className="mb-3 text-[15px] font-semibold">Services</h2>
          <ul className="grid gap-2 text-[15px]">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-muted no-underline hover:text-accent">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-[15px] font-semibold">Company</h2>
          <ul className="grid gap-2 text-[15px]">
            {[
              ["/work", "Work"],
              ["/about", "About"],
              ["/contact", "Contact"],
              ["/privacy", "Privacy"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-muted no-underline hover:text-accent">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-[15px] font-semibold">Get in touch</h2>
          <ul className="grid gap-2 text-[15px] text-muted">
            <li>
              <a href={`mailto:${contactInfo.email}`} className="text-muted no-underline hover:text-accent">
                {contactInfo.email}
              </a>
            </li>
            <li>
              <a href={contactInfo.whatsapp} target="_blank" rel="noreferrer" className="text-muted no-underline hover:text-accent">
                WhatsApp {contactInfo.phone}
              </a>
            </li>
            <li>{contactInfo.city}</li>
          </ul>
        </div>
      </div>
      <div className="container-x mt-14 flex flex-wrap justify-between gap-4 text-sm text-faint">
        <span>© {new Date().getFullYear()} Linkin World</span>
        <span>Serving clients worldwide</span>
      </div>
    </footer>
  );
}
