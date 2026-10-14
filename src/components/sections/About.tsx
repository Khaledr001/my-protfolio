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
      { opacity: 0.5 },
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
                built for <span className="accent-word">production.</span>
              </>,
            ]}
          />

          <div className="card mt-12 p-6 sm:p-9">
          <p
            data-statement
            className="text-[clamp(1.3rem,2.1vw,1.85rem)] font-medium leading-[1.4] tracking-[-0.015em] text-fg"
          >
            {STATEMENT.split(" ").map((word, i) => (
              <span key={i} data-word>
                {word}{" "}
              </span>
            ))}
          </p>

          <p className="mt-6 max-w-2xl border-t border-line pt-6 text-[17px] leading-[1.7] text-fg-muted" data-reveal>
            For about three years I&rsquo;ve built SaaS, ERP, CRM and marketplace
            backends — multi-tenant systems with strict data isolation, carefully
            designed APIs, optimized queries and event-driven services. Lately
            I&rsquo;ve been bringing LLMs into that world with retrieval-augmented
            generation, embeddings and pgvector.
          </p>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
            {facts.map((fact, i) => (
              <div
                key={fact.label}
                className="flex flex-col justify-between gap-6 bg-surface p-5 sm:p-6"
                data-reveal
                data-reveal-delay={i * 0.08}
              >
                <dt className="text-[13px] leading-snug text-fg-muted">{fact.label}</dt>
                <dd>
                  <span className="display block text-[2.4rem] leading-none">
                    {fact.value}
                    {fact.unit && (
                      <span className="ml-1 text-[13px] font-medium tracking-normal text-fg-subtle">
                        {fact.unit}
                      </span>
                    )}
                  </span>
                  <span className="mt-2 block meta">
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
            <ol className="mt-6 grid gap-4 sm:grid-cols-2">
              {principles.map((principle, i) => (
                <li key={principle.title} className="card p-6" data-reveal>
                  <span className="meta text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="mt-3 text-xl font-semibold tracking-tight text-fg">
                    {principle.title}
                  </h4>
                  <p className="mt-3 text-[16.5px] leading-[1.7] text-fg-muted">{principle.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
