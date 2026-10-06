import Link from "next/link";
import { OrbitLines } from "./orbit-lines";

export function CtaBand({
  title = "Tell us what you’re trying to solve.",
  text = "A free 20-minute call. We listen, ask a few focused questions and suggest a sensible next step.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="pb-24">
      <div className="container-x">
        <div className="relative flex flex-wrap items-center justify-between gap-8 overflow-hidden rounded-[28px] bg-accent p-[clamp(28px,5vw,72px)] text-accent-ink">
          <OrbitLines className="-top-[200px] -right-[160px]" />
          <div className="relative max-w-[640px]">
            <h2 className="h2 mb-4">{title}</h2>
            <p className="text-[19px] opacity-90">{text}</p>
          </div>
          <Link
            href="/contact"
            className="relative inline-flex min-h-[52px] items-center justify-center rounded-full bg-fg px-[30px] font-semibold text-bg no-underline transition-transform duration-200 hover:-translate-y-0.5"
          >
            Book a free call
          </Link>
        </div>
      </div>
    </section>
  );
}
