import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "Add your name.").max(120),
  email: z.string().trim().email("Add a valid email address.").max(200),
  company: z.string().trim().max(160).optional().default(""),
  phone: z.string().trim().max(40).optional().default(""),
  need: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().max(5000).optional().default(""),
  website: z.string().optional().default(""), // honeypot
});

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check the form and try again." }, { status: 400 });
  }
  const { name, email, company, phone, need, message, website } = parsed.data;

  // bots fill the hidden field; pretend success and drop it
  if (website) return NextResponse.json({ ok: true });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;

  if (!key || !to || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] email not configured; submission:", { name, email, company, phone, need, message });
      return NextResponse.json({ ok: true, delivered: false });
    }
    return NextResponse.json({ error: "The contact form isn’t set up yet." }, { status: 503 });
  }

  const html = `
    <h2>New enquiry from the website</h2>
    <p><strong>Name:</strong> ${escape(name)}</p>
    <p><strong>Email:</strong> ${escape(email)}</p>
    <p><strong>Company:</strong> ${escape(company)}</p>
    <p><strong>Phone:</strong> ${escape(phone)}</p>
    <p><strong>Need:</strong> ${escape(need)}</p>
    <p><strong>Message:</strong><br>${escape(message).replace(/\n/g, "<br>")}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, reply_to: email, subject: `Website enquiry: ${need || "General"} (${name})`, html }),
  });

  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "The message couldn’t be sent." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
