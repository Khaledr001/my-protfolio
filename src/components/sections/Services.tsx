import { useRef } from "react";
import { Link } from "react-router-dom";
import { AppWindow, ArrowRight, ArrowUpRight, BrainCircuit, Building2, Check, Server, type LucideIcon } from "lucide-react";

import { gsap } from "@/animations/gsap";
import { revealIn, useScrollMotion } from "@/animations/useScrollMotion";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { profile } from "@/data/profile";
import { services, type ServiceIcon, type ServiceTone } from "@/data/services";
import { cn } from "@/lib/utils";

const icons: Record<ServiceIcon, LucideIcon> = {
  server: Server,
  building: Building2,
  brain: BrainCircuit,
  app: AppWindow,
};

// Full class names so Tailwind can see them.
const tones: Record<ServiceTone, { tile: string; ink: string; bar: string; hover: string; check: string }> = {
  terracotta: {
    tile: "bg-terracotta-wash text-terracotta-ink",
    ink: "text-terracotta-ink",
    bar: "bg-terracotta",
    hover: "hover:border-terracotta/50",
    check: "bg-terracotta-wash text-terracotta-ink",
  },
  ochre: {
    tile: "bg-ochre-wash text-ochre-ink",
    ink: "text-ochre-ink",
    bar: "bg-ochre",
    hover: "hover:border-ochre/60",
    check: "bg-ochre-wash text-ochre-ink",
  },
  olive: {
    tile: "bg-olive-wash text-olive-ink",
    ink: "text-olive-ink",
    bar: "bg-olive",
    hover: "hover:border-olive/50",
    check: "bg-olive-wash text-olive-ink",
  },
  sky: {
    tile: "bg-sky-wash text-sky-ink",
    ink: "text-sky-ink",
    bar: "bg-sky",
    hover: "hover:border-sky/50",
    check: "bg-sky-wash text-sky-ink",
  },
};

/**
 * The services on offer, on a warm paper page that covers the 3D scene.
 */
export function Services() {
  const ref = useRef<HTMLElement>(null);

  useScrollMotion(ref, () => {
    revealIn(ref.current!);
    gsap.fromTo(
      "[data-service]",
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: "[data-service-grid]", start: "top 80%", once: true },
      },
    );
  });

  return (
    <section
      id="services"
      ref={ref}
      aria-labelledby="services-title"
      className="theme-paper paper-surface relative overflow-hidden py-28 sm:py-36"
    >
      {/* Soft autumn shapes in the corners, echoing the paper palette. */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-ochre/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-20 bottom-24 h-80 w-80 rounded-full bg-terracotta/15 blur-3xl" />

      <div className="container-x relative">
        <SectionHeader
          chapter="services"
          id="services-title"
          lines={[
            "What I can",
            <>
              build <span className="accent-word">for you.</span>
            </>,
          ]}
          intro="Four kinds of work I take on, each one backed by systems I've already shipped."
        />

        <ul data-service-grid className="mt-12 grid gap-5 md:grid-cols-2">
          {services.map((service, i) => {
            const Icon = icons[service.icon];
            const tone = tones[service.tone];
            return (
              <li
                key={service.id}
                data-service
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-[20px] border border-line bg-paper-card p-6 shadow-[0_18px_40px_-28px_rgba(80,45,20,0.45)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-30px_rgba(80,45,20,0.55)] sm:p-7",
                  tone.hover,
                )}
              >
                <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-1", tone.bar)} />

                <div className="flex items-start justify-between gap-4">
                  <span className={cn("grid h-11 w-11 place-items-center rounded-xl", tone.tile)}>
                    <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span className={cn("font-display text-ui font-bold", tone.ink)}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="display mt-5 text-[clamp(1.3rem,1.8vw,1.55rem)]">{service.title}</h3>
                <p className="mt-2 text-body-sm leading-[1.6] text-fg-muted">{service.summary}</p>

                <ul className="mt-5 space-y-2.5">
                  {service.points.map((point) => (
                    <li key={point} className="flex gap-3 text-ui leading-[1.55] text-fg">
                      <span aria-hidden="true" className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full", tone.check)}>
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>

                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
                  {service.stack.map((tech) => (
                    <li key={tech} className="chip">
                      {tech}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-5">
                  <div className="border-t border-line pt-4">
                    <p className="text-caption font-semibold uppercase tracking-[0.12em] text-fg-subtle">Shipped in</p>
                    <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                      {service.proof.map((proof) => (
                        <li key={proof.label}>
                          {proof.href.startsWith("/") ? (
                            <Link to={proof.href} className={cn("inline-flex items-center gap-1.5 text-ui font-semibold underline-offset-4 hover:underline", tone.ink)}>
                              {proof.label}
                              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                            </Link>
                          ) : (
                            <a href={proof.href} className={cn("inline-flex items-center gap-1.5 text-ui font-semibold underline-offset-4 hover:underline", tone.ink)}>
                              {proof.label}
                              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Call to action band */}
        <div
          data-reveal
          className="relative mt-10 overflow-hidden rounded-[24px] bg-terracotta-ink px-7 py-8 text-white shadow-[0_30px_70px_-35px_rgba(120,40,20,0.7)] sm:px-10 sm:py-9"
        >
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-ochre/40 blur-3xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h3 className="font-display text-[clamp(1.6rem,2.8vw,2.3rem)] font-bold leading-tight tracking-[-0.02em]">
                Have a project in mind?
              </h3>
              <p className="mt-3 text-body-sm leading-[1.65] text-white/90">
                Tell me what you&rsquo;re building, and I&rsquo;ll tell you honestly how I can help.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink
                href="#contact"
                size="lg"
                className="bg-white text-terracotta-ink hover:bg-paper hover:shadow-none"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Discuss a project
              </ButtonLink>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/50 px-6 text-ui font-medium text-white transition-colors hover:bg-white/10"
              >
                Email me
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
