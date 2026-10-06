// Site-wide copy. Service and case-study copy lives in services.ts and work.ts.

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const contactInfo = {
  email: "contact@linkinworldtech.com",
  phone: "+92 303 585 9255",
  whatsapp: "https://wa.me/923035859255",
  city: "Islamabad, Pakistan",
} as const;

export const platforms =
  "We work across AWS, Microsoft Azure, Google Cloud, Docker, Kubernetes, Microsoft 365, Power BI, Odoo, HubSpot, n8n, Zapier and Make.";
export const platformsCoda = "And we’ll tell you when you don’t need any of them.";

export const advisoryProblem = {
  q: "We need someone senior on technology, but not full-time.",
  service: "Monthly tech advisor or fractional tech lead",
  detail:
    "A senior technical lead who joins your planning, reviews vendor proposals, keeps projects on scope and is there when a decision needs a second opinion.",
  outcome: "Senior judgement without a full-time hire.",
} as const;

export const steps = [
  { title: "Audit", text: "Review your systems, tools, security and costs." },
  { title: "Roadmap", text: "Priorities, scope, costs and timelines, without jargon." },
  { title: "Implement", text: "Vendor selection, setup, coordination, testing and documentation." },
  { title: "Support", text: "Training, handover and ongoing advice after go-live." },
] as const;

export const whyUs = [
  {
    title: "We speak both languages",
    text: "We understand business goals and technical execution. Owners, managers and implementers stay aligned, so nothing gets lost in translation.",
  },
  {
    title: "We protect your interests",
    text: "We help you avoid overbuying, weak scope, the wrong vendor and unclear pricing. Our advice serves your business, not a vendor commission.",
  },
  {
    title: "We stay through delivery",
    text: "Planning, vendor coordination, implementation, documentation and handover, until the work is completed properly.",
  },
  {
    title: "Deep industry and global experience",
    text: "Our technical leadership brings 15+ years of hands-on IT and telecom experience across technologies, industries and international markets.",
  },
] as const;

export const techGroups = [
  { title: "Cloud and infrastructure", items: ["AWS", "Microsoft Azure", "Google Cloud", "Docker", "Kubernetes", "Linux / VPS"] },
  { title: "Security and compliance", items: ["ISO 27001", "SIEM", "Firewalls and VPN", "Access control", "Penetration testing", "Server hardening"] },
  { title: "Business systems", items: ["Microsoft 365", "CRM", "ERP", "Power BI", "WordPress", "Jotform"] },
  { title: "Automation and AI", items: ["n8n", "Zapier", "Make", "HubSpot", "GoHighLevel", "LLM / AI agents"] },
] as const;

export const team = [
  {
    name: "Haleema Khan",
    role: "Marketing Director, the business side",
    bio: "A growth-focused marketing and business strategist with more than nine years in brand expansion, market positioning and strategic business development.",
  },
  {
    // TODO(client): technical lead's name, photo and bio
    name: "[Technical lead name]",
    role: "Technical Director, the technology side",
    bio: "[15+ years in IT and telecom infrastructure, cloud, cybersecurity and automation. Photo and bio to add.]",
  },
] as const;

export const expectations = [
  "A relaxed introduction to your situation",
  "A few focused technical questions",
  "An initial view of possible next steps",
  "Clarity on whether we’re the right fit",
  "No commitment required",
] as const;

export const needs = [
  "Free 20-minute discovery call",
  "Tech operations audit",
  "New system implementation",
  "Cybersecurity and compliance",
  "Cloud, network and infrastructure",
  "Automation, AI and business systems",
  "Monthly tech advisor",
  "Fractional tech lead",
  "General enquiry",
] as const;
