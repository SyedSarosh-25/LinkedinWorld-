// Case studies. Client names are withheld; every figure comes from Linkin World's own project records.

export type Metric = { value: number | null; suffix?: string; display?: string; label: string };

export type CaseStudy = {
  slug: string;
  title: string;
  domain: string;
  summary: string;
  body: string[];
  metrics: Metric[];
  services: string[]; // service slugs
  tech: string[];
};

export const work: CaseStudy[] = [
  {
    slug: "data-center-to-cloud",
    title: "Data center to cloud migration",
    domain: "Cloud and migration",
    summary: "Services moved off physical hardware and redesigned around what the business actually needed.",
    body: [
      "Services were migrated from physical data-center infrastructure to cloud-hosted environments.",
      "Compute, connectivity, security and application hosting were redesigned around real business needs rather than copied one to one, reducing dependence on dedicated hardware.",
    ],
    metrics: [
      { value: 80, suffix: "%", label: "infrastructure cost reduction" },
      { value: null, display: "Cloud", label: "scalable operating environment" },
    ],
    services: ["cloud-infrastructure", "solution-delivery"],
    tech: ["Cloud hosting", "Network security", "Application hosting"],
  },
  {
    slug: "iso-27001",
    title: "Cybersecurity and ISO 27001",
    domain: "Cybersecurity and compliance",
    summary: "ISO 27001 led from technical gap closure through to independent external audit.",
    body: [
      "The ISO 27001 implementation was led from technical gap closure through audit readiness.",
      "Access controls, VPNs, SSL, server security, vulnerability management and log monitoring were strengthened, while documentation, staff readiness and the independent external audits were coordinated alongside.",
    ],
    metrics: [
      { value: 100, suffix: "%", label: "compliance against required controls" },
      { value: null, display: "Stronger", label: "confidence in security and governance" },
    ],
    services: ["cybersecurity"],
    tech: ["ISO 27001", "VPN", "SSL", "Vulnerability management", "Log monitoring"],
  },
  {
    slug: "secure-networks",
    title: "Secure networks and remote monitoring",
    domain: "Networks and monitoring",
    summary: "Enterprise networks on Cisco and Meraki with centralised monitoring.",
    body: [
      "Enterprise networks were designed and implemented on Cisco and Meraki infrastructure, covering IP planning, routing, switching, VLANs and VPNs.",
      "Centralised monitoring was set up with LibreNMS, Cacti and SolarWinds.",
    ],
    metrics: [
      { value: 500, suffix: "+", label: "network nodes monitored" },
      { value: 99.9, suffix: "%", label: "service uptime" },
    ],
    services: ["cloud-infrastructure", "cybersecurity"],
    tech: ["Cisco", "Meraki", "LibreNMS", "Cacti", "SolarWinds"],
  },
  {
    slug: "crm-erp-automation",
    title: "CRM, ERP and workflow automation",
    domain: "Business systems and automation",
    summary: "Odoo and HubSpot connected to daily workflows, removing repetitive data handling.",
    body: [
      "CRM, ERP and business workflows were implemented and connected using Odoo and HubSpot.",
      "APIs, Python and automation removed repetitive data handling and streamlined day-to-day processes.",
    ],
    metrics: [
      { value: 10, suffix: "+ hrs", label: "saved per week" },
      { value: 70, suffix: "%", label: "less manual effort" },
    ],
    services: ["automation-ai", "solution-delivery"],
    tech: ["Odoo", "HubSpot", "Python", "APIs"],
  },
  {
    slug: "rf-communications",
    title: "RF and radio communications",
    domain: "RF and communications",
    summary: "Professional HF, VHF, UHF and microwave radio systems commissioned, with training to match.",
    body: [
      "Professional HF, VHF, UHF and microwave radio systems were configured, programmed, integrated, tested and commissioned.",
      "Custom theoretical and practical training was designed around each client’s requirements and participants’ skill levels, including hands-on exercises, assessments and certification.",
    ],
    metrics: [
      { value: 500, suffix: "+", label: "radios programmed, installed and commissioned" },
      { value: 50, suffix: "+", label: "locations where training was delivered" },
    ],
    services: ["cloud-infrastructure"],
    tech: ["HF", "VHF", "UHF", "Microwave"],
  },
];

export const getCase = (slug: string) => work.find((w) => w.slug === slug);
