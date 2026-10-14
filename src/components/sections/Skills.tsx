import { useLayoutEffect, useRef, useState } from "react";

import { gsap, ScrollTrigger } from "@/animations/gsap";
import { revealIn, useScrollMotion } from "@/animations/useScrollMotion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SideScrim } from "@/components/ui/SideScrim";
import { skillLayers } from "@/data/skills";
import { cn } from "@/lib/utils";

export function Skills() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  // Track which layer is being read (drives the readout and row emphasis).
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-stack-layer]").forEach((row, i) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  useScrollMotion(ref, () => {
    revealIn(ref.current!);

    // Layers assemble progressively: each row's tools slot in as it is reached.
    gsap.utils.toArray<HTMLElement>("[data-stack-layer]").forEach((row) => {
      gsap.fromTo(
        row.querySelectorAll("[data-skill]"),
        { autoAlpha: 0, y: 14, scale: 0.96 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "expo.out",
          stagger: 0.04,
          scrollTrigger: { trigger: row, start: "top 80%", once: true },
        },
      );
      gsap.fromTo(
        row.querySelector("[data-layer-rule]"),
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: row, start: "top 85%", end: "top 50%", scrub: true },
        },
      );
    });
  });

  return (
    <section
      id="stack"
      ref={ref}
      aria-labelledby="stack-title"
      className="relative py-28 sm:py-36"
    >
      <SideScrim side="left" />
      <div className="container-x grid gap-x-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionHeader
            chapter="stack"
            id="stack-title"
            lines={[
              "Layered like",
              <>
                the <span className="serif-accent text-signal">systems</span> I build.
              </>,
            ]}
            intro="No percentages, no star ratings. These are the tools I reach for in production, grouped by the layer of a system they belong to."
          />

          <ol className="mt-16">
            {skillLayers.map((layer, i) => (
              <li
                key={layer.id}
                data-stack-layer
                aria-current={active === i ? "step" : undefined}
                className={cn(
                  "relative py-10 transition-opacity duration-500 lg:py-14",
                  active === i ? "opacity-100" : "lg:opacity-[0.55]",
                )}
              >
                <span
                  data-layer-rule
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-accent/70 via-white/10 to-transparent"
                />
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[11px] text-accent">
                    L{String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[clamp(1.5rem,2.4vw,2rem)] font-semibold tracking-tight text-fg">
                    {layer.name}
                  </h3>
                  <span className="ml-auto hidden font-mono text-[10.5px] uppercase tracking-[0.2em] text-fg-subtle sm:block">
                    {layer.layer}
                  </span>
                </div>
                <p className="mt-3 max-w-lg pl-[2.4rem] text-[15px] leading-relaxed text-fg-muted">
                  {layer.summary}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2 pl-[2.4rem]">
                  {layer.items.map((item) => (
                    <li key={item} data-skill className="chip text-fg">
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </section>
  );
}
