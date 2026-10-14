import { useRef } from "react";

import { gsap } from "@/animations/gsap";
import { revealIn, useScrollMotion } from "@/animations/useScrollMotion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SideScrim } from "@/components/ui/SideScrim";
import { education, experience } from "@/data/experience";

export function Experience() {
  const ref = useRef<HTMLElement>(null);

  useScrollMotion(ref, () => {
    revealIn(ref.current!);

    // The rail fills as the reader travels down the timeline.
    gsap.fromTo(
      "[data-rail-fill]",
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-timeline]",
          start: "top 60%",
          end: "bottom 60%",
          scrub: true,
        },
      },
    );

    gsap.utils.toArray<HTMLElement>("[data-role]").forEach((role) => {
      // Entries tilt up out of depth as they arrive…
      gsap.fromTo(
        role.querySelector("[data-role-card]"),
        { autoAlpha: 0, y: 50, rotateX: 14, transformPerspective: 900, transformOrigin: "50% 0%" },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: role, start: "top 82%", once: true },
        },
      );
      // …and their node on the rail lights up while they are being read.
      gsap.to(role.querySelector("[data-role-node]"), {
        scale: 1,
        backgroundColor: "#F2A65A",
        boxShadow: "0 0 0 6px rgba(242,166,90,0.15), 0 0 18px rgba(242,166,90,0.6)",
        duration: 0.4,
        scrollTrigger: {
          trigger: role,
          start: "top 60%",
          end: "bottom 60%",
          toggleActions: "play reverse play reverse",
        },
      });
    });
  });

  return (
    <section
      id="journey"
      ref={ref}
      aria-labelledby="journey-title"
      className="relative py-28 sm:py-36"
    >
      <SideScrim side="left" />
      <div className="container-x grid lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHeader
            chapter="journey"
            id="journey-title"
            lines={[
              "From first backend",
              <>
                to <span className="accent-word">production</span> systems.
              </>,
            ]}
          />

          <ol data-timeline className="relative mt-16 pl-8 sm:pl-10">
            <span aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-px bg-white/10" />
            <span
              data-rail-fill
              aria-hidden="true"
              className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-gradient-to-b from-cool via-accent to-accent-deep"
            />

            {experience.map((role) => (
              <li key={role.id} data-role className="relative pb-16 last:pb-0">
                <span
                  data-role-node
                  aria-hidden="true"
                  className="absolute -left-8 top-2 h-[11px] w-[11px] scale-75 rounded-full border border-white/30 bg-ink-950 sm:-left-10"
                />
                <article data-role-card className="grid gap-x-8 gap-y-3 card p-5 sm:grid-cols-[9.5rem_1fr] sm:p-7">
                  <div className="meta leading-[1.7]">
                    <p className="font-semibold text-cool-soft">{role.period}</p>
                    <p>{role.location}</p>
                  </div>
                  <div>
                    <h3 className="text-[clamp(1.35rem,2vw,1.65rem)] font-semibold tracking-tight text-fg">
                      {role.role}
                      <span className="text-fg-subtle"> · </span>
                      <span className="text-accent">{role.company}</span>
                    </h3>
                    <p className="mt-1.5 text-[15.5px] text-fg-muted">{role.focus}</p>
                    <ul className="mt-5 space-y-2.5">
                      {role.points.map((point) => (
                        <li key={point} className="flex gap-3 text-[16px] leading-[1.7] text-fg-muted">
                          <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-white/30" />
                          {point}
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                      {role.stack.map((tech) => (
                        <li key={tech} className="chip">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            ))}
          </ol>

          <div
            className="mt-16 grid gap-x-8 gap-y-2 border-t border-line pt-8 sm:grid-cols-[9.5rem_1fr] sm:pl-10"
            data-reveal
          >
            <p className="meta">{education.period}</p>
            <p className="text-[16px] text-fg-muted">
              <span className="text-fg">{education.degree}</span> — {education.school}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
