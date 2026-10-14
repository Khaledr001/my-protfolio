import { useRef } from "react";

import { gsap } from "@/animations/gsap";
import { revealIn, useScrollMotion } from "@/animations/useScrollMotion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SideScrim } from "@/components/ui/SideScrim";
import { facts, principles } from "@/data/profile";

const STATEMENT =
  "I'm drawn to the parts of software most people never see — tenant boundaries, message queues, query plans — and to making them hold up under real business pressure.";

export function About() {
  const ref = useRef<HTMLElement>(null);

  useScrollMotion(ref, () => {
    revealIn(ref.current!);

    // The statement lights up word by word as it is read.
    gsap.fromTo(
      "[data-word]",
      { opacity: 0.16 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.08,
        scrollTrigger: {
          trigger: "[data-statement]",
          start: "top 80%",
          end: "bottom 45%",
          scrub: true,
        },
      },
    );
  });

  return (
    <section
      id="about"
      ref={ref}
      aria-labelledby="about-title"
      className="relative py-28 sm:py-36 lg:py-44"
    >
      <SideScrim side="right" />
      <div className="container-x grid gap-y-16 lg:grid-cols-12">
        <div className="lg:col-span-7 lg:col-start-6">
          <SectionHeader
            chapter="about"
            id="about-title"
            lines={[
              "Backend depth,",
              <>
                built for <span className="serif-accent text-signal">production.</span>
              </>,
            ]}
          />

          <p
            data-statement
            className="mt-12 text-[clamp(1.35rem,2.3vw,2rem)] font-medium leading-[1.35] tracking-[-0.02em] text-fg"
          >
            {STATEMENT.split(" ").map((word, i) => (
              <span key={i} data-word>
                {word}{" "}
              </span>
            ))}
          </p>

          <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-fg-muted" data-reveal>
            For about three years I&rsquo;ve built SaaS, ERP, CRM and marketplace
            backends — multi-tenant systems with strict data isolation, carefully
            designed APIs, optimized queries and event-driven services. Lately
            I&rsquo;ve been bringing LLMs into that world with retrieval-augmented
            generation, embeddings and pgvector.
          </p>

          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-4">
            {facts.map((fact, i) => (
              <div
                key={fact.label}
                className="flex flex-col justify-between gap-6 bg-ink-950/90 p-5 sm:p-6"
                data-reveal
                data-reveal-delay={i * 0.08}
              >
                <dt className="text-[13px] leading-snug text-fg-muted">{fact.label}</dt>
                <dd>
                  <span className="display block text-[2.4rem] leading-none">
                    {fact.value}
                    {fact.unit && (
                      <span className="ml-1 font-mono text-xs font-normal tracking-normal text-fg-subtle">
                        {fact.unit}
                      </span>
                    )}
                  </span>
                  <span className="mt-2 block font-mono text-[11px] text-fg-subtle">
                    {fact.detail}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-20">
            <h3 className="eyebrow" data-reveal>
              How I engineer
            </h3>
            <ol className="mt-8 grid gap-x-10 gap-y-10 sm:grid-cols-2">
              {principles.map((principle, i) => (
                <li key={principle.title} className="border-t border-white/[0.08] pt-6" data-reveal>
                  <span className="font-mono text-[11px] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="mt-3 text-xl font-semibold tracking-tight text-fg">
                    {principle.title}
                  </h4>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-fg-muted">{principle.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
