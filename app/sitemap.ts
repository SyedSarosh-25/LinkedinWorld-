import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { work } from "@/lib/work";

const base = "https://linkinworldtech.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/services", "/work", "/about", "/contact", "/privacy"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, lastModified: now, priority: p === "" ? 1 : 0.8 })),
    ...services.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: now, priority: 0.7 })),
    ...work.map((w) => ({ url: `${base}/work/${w.slug}`, lastModified: now, priority: 0.6 })),
  ];
}
