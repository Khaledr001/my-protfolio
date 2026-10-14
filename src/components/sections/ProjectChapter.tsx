import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { DepthPanel } from "@/components/visuals/DepthPanel";
import { ProjectDiagram } from "@/components/visuals/ProjectDiagrams";
import type { FeaturedProject } from "@/data/projects";
import { cn } from "@/lib/utils";

interface ProjectChapterProps {
  project: FeaturedProject;
  index: number;
  total: number;
}

/** One featured project: an architecture visual beside a concise case summary. */
export function ProjectChapter({ project, index, total }: ProjectChapterProps) {
  const flip = index % 2 === 1;
  const headingId = `project-${project.id}`;

  return (
    <article
      data-work-item
      aria-labelledby={headingId}
      style={{ "--accent": project.accent } as CSSProperties}
      className="grid items-start gap-x-14 gap-y-10 border-t border-white/[0.07] py-20 lg:grid-cols-12 lg:py-28"
    >
      {/* Visual */}
      <div className={cn("lg:col-span-7 lg:sticky lg:top-28", flip && "lg:order-2")}>
        <div data-visual>
          <DepthPanel accent={project.accent} label={`System ${project.code} · Architecture`}>
            <ProjectDiagram visual={project.visual} accent={project.accent} />
          </DepthPanel>
        </div>
        <ol
          aria-label={`${project.title} architecture`}
          className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[11px] text-fg-subtle"
        >
          {project.architecture.map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true" className="text-[var(--accent)]">→</span>}
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Story */}
      <div className={cn("lg:col-span-5", flip && "lg:order-1")}>
        <div className="flex items-center gap-4" data-reveal>
          <span className="serif-accent text-[3.25rem] leading-none text-[var(--accent)]">
            {project.code}
          </span>
          <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
          <span className="font-mono text-[11px] text-fg-subtle">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>

        <p className="mt-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted" data-reveal>
          <span
            aria-hidden="true"
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              project.status === "production" ? "bg-[var(--accent)]" : "border border-[var(--accent)]",
            )}
          />
          {project.context}
        </p>

        <h3
          id={headingId}
          className="display mt-4 text-[clamp(2rem,3.6vw,3.2rem)]"
          data-reveal
        >
          {project.title}
        </h3>

        <p className="mt-5 text-[16.5px] leading-relaxed text-fg-muted" data-reveal>
          {project.summary}
        </p>

        <dl className="mt-9 space-y-6" data-reveal>
          <div>
            <dt className="eyebrow">Problem</dt>
            <dd className="mt-2 text-[15.5px] leading-relaxed text-fg">{project.problem}</dd>
          </div>
          <div>
            <dt className="eyebrow">Solution</dt>
            <dd className="mt-2 text-[15.5px] leading-relaxed text-fg">{project.solution}</dd>
          </div>
        </dl>

        <div className="mt-9" data-reveal>
          <h4 className="eyebrow">Technical highlights</h4>
          <ul className="mt-4 space-y-3">
            {project.highlights.map((point) => (
              <li key={point} className="flex gap-3 text-[15px] leading-relaxed text-fg-muted">
                <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-[var(--accent)]" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technologies" data-reveal>
          {project.stack.map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
        </ul>

        {project.note && (
          <p className="mt-6 border-l border-[var(--accent)] pl-4 text-[13.5px] leading-relaxed text-fg-subtle" data-reveal>
            {project.note}
          </p>
        )}

        {project.links.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3" data-reveal>
            {project.links.map((link) =>
              link.internal ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="link-underline inline-flex items-center gap-2 pb-0.5 text-[14.5px] font-medium text-fg"
                >
                  {link.label}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline inline-flex items-center gap-2 pb-0.5 text-[14.5px] font-medium text-fg"
                >
                  {link.label}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ),
            )}
          </div>
        )}
      </div>
    </article>
  );
}
