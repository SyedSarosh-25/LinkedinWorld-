import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-32">
      <div className="container-x max-w-[720px]">
        <p className="text-faint">404</p>
        <h1 className="mt-3 text-[clamp(40px,6vw,76px)] leading-[1.02] tracking-[-0.045em]">This page isn’t connected to anything.</h1>
        <p className="lede mt-6">The link may be old or mistyped. Try one of these instead.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn">
            Go to the homepage
          </Link>
          <Link href="/services" className="btn-ghost min-h-[52px]">
            See services
          </Link>
        </div>
      </div>
    </section>
  );
}
