import { useRef } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";

import { gsap } from "@/animations/gsap";
import { useScrollMotion } from "@/animations/useScrollMotion";
import { ButtonLink } from "@/components/ui/Button";
import { SideScrim } from "@/components/ui/SideScrim";
import { heroStack, profile } from "@/data/profile";

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useScrollMotion(ref, () => {
    // Opening sequence on load (the one non-scroll animation on the page).
    const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
    intro
      .from("[data-hero-eyebrow]", { autoAlpha: 0, y: 16, duration: 1 }, 0.25)
      .from(".line-mask > span", { yPercent: 110, duration: 1.4, stagger: 0.12 }, 0.35)
      .from("[data-hero-fade]", { autoAlpha: 0, y: 24, duration: 1.2, stagger: 0.1 }, 0.8);

    // As the reader leaves the hero, the copy drifts up and fades, tied to scroll.
    gsap.to("[data-hero-copy]", {
      yPercent: -18,
      autoAlpha: 0.15,
      ease: "none",
      scrollTrigger: {
        trigger: ref.current,
        start: "top top",
        end: "bottom 30%",
        scrub: true,
      },
    });
  });

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col justify-end pb-10 pt-[calc(var(--nav-height)+2rem)] lg:justify-center lg:pb-0"
    >
      <SideScrim side="left" width="w-[58%]" />
      <div className="container-x" data-hero-copy>
        <div className="max-w-[min(100%,58rem)] pt-[28vh] lg:pt-0">
          <p
            className="eyebrow flex items-center gap-3 text-fg-muted"
            data-hero-eyebrow
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-cool shadow-[0_0_12px_2px_rgba(79,209,197,0.6)]"
            />
            {profile.title} · {profile.location}
          </p>

          <h1
            id="hero-title"
            className="display mt-7 text-[clamp(2.5rem,5.4vw,5.5rem)]"
          >
            <span className="line-mask">
              <span>
                I engineer the <span className="accent-word">systems</span>
              </span>
            </span>
            <span className="line-mask">
              <span>behind what&rsquo;s next.</span>
            </span>
          </h1>

          <p
            className="mt-8 max-w-[34rem] text-[17px] leading-[1.7] text-fg-muted sm:text-lg"
            data-hero-fade
          >
            I build reliable SaaS platforms, event-driven backends, and AI-powered
            products — turning complex business workflows into dependable software.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3" data-hero-fade>
            <ButtonLink href="#work" size="lg" icon={<ArrowRight className="h-4 w-4" />}>
              Explore my work
            </ButtonLink>
            <ButtonLink href="#contact" size="lg" variant="secondary">
              Get in touch
            </ButtonLink>
          </div>
        </div>

        <div
          className="mt-14 flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between lg:mt-24"
          data-hero-fade
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <p className="eyebrow shrink-0">Core stack</p>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Core technologies">
              {heroStack.map((tech, i) => (
                <li key={tech} className="flex items-center gap-5 text-[14px] text-fg">
                  {i > 0 && <span aria-hidden="true" className="h-3 w-px bg-white/15" />}
                  {tech}
                </li>
              ))}
            </ul>
          </div>
          <a
            href="#about"
            className="hidden items-center gap-3 text-[13px] text-fg-subtle transition-colors hover:text-fg sm:flex"
          >
            <span className="relative block h-9 w-px overflow-hidden bg-white/10">
              <span className="absolute inset-0 animate-scroll-cue bg-accent" />
            </span>
            Scroll to begin
            <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
