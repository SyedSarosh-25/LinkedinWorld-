import type { Metadata, Viewport } from "next";
import "@fontsource-variable/onest";
import "@fontsource-variable/archivo/wdth.css";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Cursor } from "@/components/cursor";
import { Preloader } from "@/components/preloader";

export const metadata: Metadata = {
  metadataBase: new URL("https://linkinworldtech.com"),
  title: {
    default: "Linkin World | Technology consulting, cybersecurity and cloud",
    template: "%s | Linkin World",
  },
  description:
    "Linkin World helps organisations choose the right technology and deliver it, across cybersecurity, cloud, networks and automation. Based in Islamabad, serving clients worldwide.",
  openGraph: {
    type: "website",
    siteName: "Linkin World",
    title: "Linkin World | We speak business and technology",
    description: "Technology consulting and delivery across cybersecurity, cloud, networks and automation.",
    url: "https://linkinworldtech.com/",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#05070a",
  colorScheme: "dark",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Linkin World",
  url: "https://linkinworldtech.com/",
  email: "contact@linkinworldtech.com",
  telephone: "+92 303 585 9255",
  address: { "@type": "PostalAddress", addressLocality: "Islamabad", addressCountry: "PK" },
  areaServed: "Worldwide",
  knowsAbout: ["Technology consulting", "Cybersecurity", "Cloud infrastructure", "Network infrastructure", "Automation", "Artificial intelligence"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll />
        <Cursor />
        <Preloader />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
