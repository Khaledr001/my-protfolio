import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { gsap } from "@/animations/gsap";
import { revealIn, useScrollMotion } from "@/animations/useScrollMotion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SideScrim } from "@/components/ui/SideScrim";
import { featuredProjects, moreWork } from "@/data/projects";
import { ProjectChapter } from "./ProjectChapter";

export function Projects() {
  const ref = useRef<HTMLElement>(null);

  useScrollMotion(ref, ({ isDesktop }) => {
    revealIn(ref.current!);

    // Each visual opens like an aperture as it scrolls into place.
    gsap.utils.toArray<HTMLElement>("[data-visual]").forEach((visual) => {
      gsap.fromTo(
        visual,
        { clipPath: "inset(14% 8% 14% 8% round 20px)", y: isDesktop ? 60 : 30 },
        {
          clipPath: "inset(0% 0% 0% 0% round 20px)",
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: visual,
            start: "top 95%",
            end: "top 45%",
            scrub: true,
          },
        },
      );
    });

    gsap.fromTo(
      "[data-more-row]",
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: { trigger: "[data-more-list]", start: "top 85%", once: true },
      },
    );
  });

  return (
    <section
      id="work"
      ref={ref}
      aria-labelledby="work-title"
      className="relative py-28 sm:py-36"
    >
      <SideScrim side="full" />
      <div className="container-x">
        <SectionHeader
          chapter="work"
          id="work-title"
          lines={[
            "Selected",
            <>
              <span className="accent-word">systems</span>, end to end.
            </>,
          ]}
          intro="Four systems, from multi-tenant billing to retrieval-grounded AI. Each one is shown as its architecture, with the problem it solved and what made it work."
        />

        <div className="mt-20">
          {featuredProjects.map((project, i) => (
            <ProjectChapter
              key={project.id}
              project={project}
              index={i}
              total={featuredProjects.length}
            />
          ))}
        </div>

        {/* More work: compact index of the remaining case studies */}
        <div className="mt-10 border-t border-line pt-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h3 className="display text-[clamp(1.8rem,3vw,2.6rem)]" data-reveal>
              More work
            </h3>
            <p className="max-w-md text-[16px] text-fg-muted" data-reveal>
              Case studies with screenshots, live demos and source code.
            </p>
          </div>

          <ul className="mt-10" data-more-list>
            {moreWork.map((study, i) => (
              <li key={study.slug} data-more-row>
                <Link
                  to={`/projects/${study.slug}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-1 border-b border-line py-6 transition-colors hover:bg-white/[0.02] sm:grid-cols-[3rem_1.2fr_1fr_auto] sm:gap-x-8 sm:px-2"
                >
                  <span className="meta">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-[19px] font-semibold tracking-tight text-fg transition-colors group-hover:text-accent sm:text-[22px]">
                      {study.name}
                    </span>
                    <span className="mt-1 block text-[13.5px] text-fg-subtle">{study.kind}</span>
                  </span>
                  <span className="hidden flex-wrap gap-2 sm:flex">
                    {study.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="chip">
                        {tag}
                      </span>
                    ))}
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-line transition-all duration-300 group-hover:border-accent/60 group-hover:bg-accent/10">
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
