"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useTilt } from "@/lib/hooks";
import { team } from "@/lib/content";
import haleema from "@/public/team/haleema.jpg";

export function Team() {
  const frame = useTilt<HTMLDivElement>(8);
  const photo = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        photo.current,
        { scale: 1.12 },
        { scale: 1, ease: "none", scrollTrigger: { trigger: frame.current, start: "top bottom", end: "center center", scrub: true } },
      );
    });
  });

  return (
    <section id="team" className="pt-10 pb-28">
      <div className="container-x flex flex-wrap items-center gap-14">
        <div className="min-w-0 flex-[1_1_380px]">
          <h2 className="h2 mb-8">Both sides of the table</h2>
          {team.map((p, i) => (
            <div key={p.name} className={i > 0 ? "mt-9 border-t border-line pt-7" : ""}>
              <h3 className="text-2xl tracking-[-0.01em]">{p.name}</h3>
              <p className="mt-1 mb-2.5 text-base text-accent">{p.role}</p>
              <p className="max-w-[30em] text-muted">{p.bio}</p>
            </div>
          ))}
        </div>
        <div className="w-full max-w-[420px] flex-[0_1_420px] [perspective:900px]">
          <div ref={frame} className="aspect-[4/5] overflow-hidden rounded-[20px] [transform-style:preserve-3d]">
            <div ref={photo} className="h-full w-full">
              <Image
                src={haleema}
                alt="Haleema Khan, Marketing Director, seated at a desk"
                className="h-full w-full object-cover"
                sizes="(max-width: 640px) 100vw, 420px"
                placeholder="blur"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
