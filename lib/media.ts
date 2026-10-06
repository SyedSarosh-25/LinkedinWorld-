// Photography. Free Unsplash photos, hot-linked for now.
// TODO(launch): download the final picks into /public/media (Unsplash licence allows this) or swap in
// Linkin World's own project photos/footage, then point these at the local files.

const u = (id: string, w = 2000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=78`;

export const media = {
  hero: [
    { src: u("photo-1558494949-ef010cbdcc31"), alt: "Network cabling in a server rack" },
    { src: u("photo-1603793510575-a8cf24361baa"), alt: "City buildings from above at night" },
    { src: u("photo-1493514789931-586cb221d7a7"), alt: "City skyline at night from above" },
  ],
  field: { src: u("photo-1594915440248-1e419eba6611", 2400), alt: "Fibre optic cables connected to a network switch" },
  steps: [
    { src: u("photo-1517245386807-bb43f82c33c4", 1200), alt: "Consultant explaining a plan in a meeting" },
    { src: u("photo-1454165804606-c3d57bc86b40", 1200), alt: "Planning notes beside a laptop" },
    { src: u("photo-1544197150-b99a580bb7a8", 1200), alt: "Network cables patched into a switch" },
    { src: u("photo-1629904853716-f0bc54eea481", 1200), alt: "Team working at monitors" },
  ],
  services: {
    "solution-delivery": { src: u("photo-1522071820081-009f0129c71c", 1400), alt: "Team working together around laptops" },
    cybersecurity: { src: u("photo-1614064641938-3bbee52942c7", 1400), alt: "Padlock resting on a computer keyboard" },
    "cloud-infrastructure": { src: u("photo-1762163516269-3c143e04175c", 1400), alt: "Server rack with status lights" },
    "automation-ai": { src: u("photo-1550751827-4bd374c3f58b", 1400), alt: "Teal LED panel" },
  } as Record<string, { src: string; alt: string }>,
  work: {
    "data-center-to-cloud": { src: u("photo-1717386255950-f7fbe05eb6c0", 1400), alt: "Network cabling on a rack" },
    "iso-27001": { src: u("photo-1614064548237-096f735f344f", 1400), alt: "Padlock on a laptop with light trails" },
    "secure-networks": { src: u("photo-1682559736721-c2e77ff4c650", 1400), alt: "Network cables connected to a server" },
    "crm-erp-automation": { src: u("photo-1542744173-8e7e53415bb0", 1400), alt: "Presenter walking a team through a system" },
    "rf-communications": { src: u("photo-1557174360-3f4f7c724501", 1400), alt: "Telecom cell site antennas" },
  } as Record<string, { src: string; alt: string }>,
  cta: { src: u("photo-1645451365229-676df30167f0", 2400), alt: "City at night" },
};
