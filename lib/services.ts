// Service pages. Scope lists and outcomes come from Linkin World's own service descriptions.

export type Service = {
  slug: string;
  title: string;
  short: string;
  /** the question a client would actually ask */
  problem: string;
  intro: string;
  scope: string[];
  outcome: string;
  tech: string[];
  work: string[]; // case study slugs
};

export const services: Service[] = [
  {
    slug: "solution-delivery",
    title: "End-to-end solution delivery",
    short: "From initial need to final delivery, one accountable lead.",
    problem: "We’re about to buy something big and aren’t sure it’s right.",
    intro:
      "We define requirements, assess feasibility, shape the solution and lead implementation through handover and support. You get one point of contact who speaks to your managers and your vendors in their own language.",
    scope: [
      "Requirements and discovery",
      "Feasibility and solution design",
      "Roadmap, budget and phasing",
      "Technology selection and licensing",
      "Project leadership and coordination",
      "Implementation and integration",
      "Testing, handover and documentation",
      "Post-delivery support",
    ],
    outcome: "The right solution, delivered as committed.",
    tech: ["Microsoft 365", "AWS", "Microsoft Azure", "Google Cloud", "CRM", "ERP"],
    work: ["data-center-to-cloud", "crm-erp-automation"],
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity and compliance",
    short: "Find the gaps, strengthen controls, pass the audit.",
    problem: "We have an audit coming, or we’re worried about a breach.",
    intro:
      "We identify security gaps, strengthen systems and monitoring, and improve resilience against cyber threats while meeting compliance and audit requirements.",
    scope: [
      "Vulnerability assessment",
      "Penetration testing",
      "IAM, MFA and Zero Trust",
      "Firewall, VPN and access review",
      "Endpoint protection (EDR/XDR) and SIEM",
      "ISO 27001 readiness",
    ],
    outcome: "Reduced risk, stronger controls, better compliance.",
    tech: ["ISO 27001", "SIEM", "Firewalls and VPN", "Access control", "Penetration testing", "Server hardening"],
    work: ["iso-27001", "secure-networks"],
  },
  {
    slug: "cloud-infrastructure",
    title: "Cloud, network and infrastructure",
    short: "Secure, scalable infrastructure with cost kept in view.",
    problem: "Our IT costs keep growing and systems still go down.",
    intro:
      "We design and modernise secure, scalable infrastructure across cloud, data centers and networks, with resilience and cost kept in view from the first diagram.",
    scope: [
      "Cloud and data-center migration",
      "Hybrid and multi-cloud",
      "Compute, containers and Kubernetes",
      "Network architecture, SD-WAN, VPN and routing",
      "Infrastructure as Code, DevOps and CI/CD",
      "Monitoring, backup and cost optimisation",
    ],
    outcome: "Secure, resilient, scalable infrastructure with controlled cost.",
    tech: ["AWS", "Microsoft Azure", "Google Cloud", "Docker", "Kubernetes", "Linux / VPS"],
    work: ["data-center-to-cloud", "secure-networks", "rf-communications"],
  },
  {
    slug: "automation-ai",
    title: "Automation, AI and business systems",
    short: "Less manual work, faster processes, better visibility.",
    problem: "Our team spends hours copying data between systems.",
    intro:
      "We connect systems, automate repetitive work and apply AI where it adds practical value, so teams spend less time on manual tasks and more on decisions.",
    scope: [
      "CRM and ERP setup",
      "Workflow automation",
      "AI agents and assistants",
      "Dashboards and BI",
      "Document workflows",
      "API and system integrations",
    ],
    outcome: "Less manual work, faster processes, better visibility.",
    tech: ["n8n", "Zapier", "Make", "HubSpot", "GoHighLevel", "Power BI", "LLM / AI agents"],
    work: ["crm-erp-automation"],
  },
];

export const engagements = [
  {
    title: "Free discovery call",
    text: "Twenty minutes to understand what’s happening and whether we can help. No obligation.",
  },
  {
    title: "Tech operations audit",
    text: "A structured review of your systems, tools, security and costs, ending in a prioritised roadmap.",
  },
  {
    title: "Project delivery",
    text: "A defined scope delivered end to end, from vendor selection through handover.",
  },
  {
    title: "Monthly tech advisor",
    text: "Ongoing senior advice on a monthly arrangement: planning, vendor reviews and second opinions.",
  },
  {
    title: "Fractional tech lead",
    text: "A part-time technical lead embedded with your team when you need leadership but not a full-time hire.",
  },
] as const;

export const getService = (slug: string) => services.find((s) => s.slug === slug);
