"use client";

import { useState } from "react";
import { contactInfo, needs } from "@/lib/content";

type Status = { kind: "idle" | "sending" | "sent" | "error"; message?: string };

const field = "w-full rounded-xl border-0 bg-surface p-3.5 text-base font-normal text-fg placeholder:text-faint";

export function ContactForm({ defaultNeed }: { defaultNeed?: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      form.reset();
      setStatus({ kind: "sent", message: "Thanks. Your message is with the team and we’ll reply within one business day." });
    } catch (err) {
      setStatus({
        kind: "error",
        message: `${err instanceof Error ? err.message : "The message couldn’t be sent."} You can also email ${contactInfo.email}.`,
      });
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative grid min-w-0 gap-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
        <label htmlFor="name" className="grid gap-1.5 text-[15px] font-semibold">
          Name
          <input id="name" name="name" required autoComplete="name" placeholder="Your name" className={field} />
        </label>
        <label htmlFor="email" className="grid gap-1.5 text-[15px] font-semibold">
          Email
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={field} />
        </label>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
        <label htmlFor="company" className="grid gap-1.5 text-[15px] font-semibold">
          Company
          <input id="company" name="company" autoComplete="organization" placeholder="Company name" className={field} />
        </label>
        <label htmlFor="phone" className="grid gap-1.5 text-[15px] font-semibold">
          Phone (optional)
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+92 300 1234567" className={field} />
        </label>
      </div>
      <label htmlFor="need" className="grid gap-1.5 text-[15px] font-semibold">
        What do you need?
        <select id="need" name="need" className={field} defaultValue={defaultNeed ?? needs[0]}>
          {needs.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </label>
      <label htmlFor="message" className="grid gap-1.5 text-[15px] font-semibold">
        Message
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="A few lines about your business and what you’re trying to solve."
          className={`${field} min-h-[110px] resize-y`}
        />
      </label>
      {/* honeypot: hidden from people, filled by bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="inline-flex min-h-[52px] cursor-pointer items-center justify-center justify-self-start rounded-full bg-fg px-[30px] font-semibold text-bg disabled:opacity-60"
      >
        {status.kind === "sending" ? "Sending…" : "Send message"}
      </button>
      <p role="status" className="min-h-[1.6em] text-base">
        {status.message}
      </p>
    </form>
  );
}
