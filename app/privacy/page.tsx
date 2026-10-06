import type { Metadata } from "next";
import { contactInfo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Linkin World handles information you send through this website.",
  alternates: { canonical: "/privacy" },
};

// TODO(client): have this reviewed before launch. It describes what this codebase does, not legal advice.
export default function PrivacyPage() {
  return (
    <section className="py-20">
      <div className="container-x max-w-[760px]">
        <h1 className="text-[clamp(40px,5vw,64px)] leading-[1.05] tracking-[-0.04em]">Privacy</h1>
        <p className="mt-4 text-faint">Last updated: [date]</p>
        <div className="mt-10 grid gap-8 text-lg text-muted [&_h2]:mb-2 [&_h2]:text-2xl [&_h2]:text-fg">
          <div>
            <h2>What we collect</h2>
            <p>
              When you use the contact form we receive your name, email address and, if you add them, your company, phone number, the
              service you’re interested in and your message.
            </p>
          </div>
          <div>
            <h2>How we use it</h2>
            <p>We use it only to reply to your enquiry and to discuss the work you asked about. We don’t sell it or use it for advertising.</p>
          </div>
          <div>
            <h2>How it’s sent</h2>
            <p>Form submissions are delivered to our inbox through an email delivery provider. [Name the provider and where data is stored.]</p>
          </div>
          <div>
            <h2>How long we keep it</h2>
            <p>[State the retention period, for example as long as needed to handle the enquiry and any resulting engagement.]</p>
          </div>
          <div>
            <h2>Your choices</h2>
            <p>
              To see, correct or delete the information you sent us, email <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
