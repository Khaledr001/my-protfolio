import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, KeyRound } from "lucide-react";

import { revealIn, useScrollMotion } from "@/animations/useScrollMotion";
import { StaticBackdrop } from "@/components/layout/StaticBackdrop";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ButtonLink } from "@/components/ui/Button";
import { ProjectGallery } from "@/components/ui/ProjectGallery";
import { profile } from "@/data/profile";
import { caseStudies } from "@/data/projects";
import { DEFAULT_TITLE, pageTitle } from "@/lib/seo";
import { splitEmphasis } from "@/lib/utils";

function Emphasis({ text }: { text: string }) {
  return (
    <>
      {splitEmphasis(text).map((part, i) =>
        part.strong ? (
          <strong key={i} className="font-semibold text-fg">
            {part.text}
          </strong>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable: the value is visible and selectable anyway.
    }
  };
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-ink-950/60 px-4 py-2.5">
      <div className="min-w-0">
        <p className="eyebrow">{label}</p>
        <p className="mt-1 truncate font-mono text-[13.5px] text-fg">{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? `${label} copied` : `Copy ${label.toLowerCase()}`}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-fg-subtle transition-colors hover:bg-white/10 hover:text-fg"
      >
        {copied ? <Check className="h-4 w-4 text-cool-soft" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

function NotFound() {
  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display text-5xl">Project not found.</h1>
      <ButtonLink href="/#work" internal variant="secondary" icon={<ArrowRight className="h-4 w-4" />}>
        Back to selected work
      </ButtonLink>
    </div>
  );
}

export function ProjectPage() {
  const { slug } = useParams();
  const ref = useRef<HTMLDivElement>(null);
  const index = caseStudies.findIndex((c) => c.slug === slug);
  const study = caseStudies[index];
  const next = index >= 0 ? caseStudies[(index + 1) % caseStudies.length] : undefined;

  // SPA navigation keeps the previous scroll position; start at the top.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [slug]);

  useEffect(() => {
    document.title = study ? pageTitle(study.name) : DEFAULT_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [study]);

  useScrollMotion(ref, () => {
    revealIn(ref.current!);
  });

  return (
    <div ref={ref} className="relative min-h-screen">
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <StaticBackdrop className="opacity-60" />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-ink-950/75 backdrop-blur-xl">
        <nav aria-label="Primary" className="container-x flex h-[var(--nav-height)] items-center justify-between">
          <Link
            to="/#work"
            className="inline-flex items-center gap-2 text-[14px] text-fg-muted transition-colors hover:text-fg"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            All work
          </Link>
          <Link to="/" className="flex items-center gap-3" aria-label={`${profile.name}, home`}>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 font-mono text-[10.5px] font-semibold tracking-wider text-fg">
              {profile.initials}
            </span>
          </Link>
        </nav>
      </header>

      {!study ? (
        <NotFound />
      ) : (
        <main id="main" className="relative z-10">
          <section className="container-x pb-16 pt-[calc(var(--nav-height)+5rem)] sm:pt-[calc(var(--nav-height)+7rem)]">
            <p className="eyebrow" data-reveal>
              Case study · {study.kind}
            </p>
            <h1 className="display mt-6 max-w-5xl text-[clamp(2.6rem,7vw,6rem)]" data-reveal-lines>
              <span className="line-mask">
                <span>{study.name}</span>
              </span>
            </h1>
            <p className="mt-8 max-w-3xl text-[17px] leading-relaxed text-fg-muted sm:text-lg" data-reveal>
              {study.description}
            </p>
            {study.note && (
              <p className="mt-6 max-w-3xl border-l border-accent pl-4 text-[14px] leading-relaxed text-fg-subtle" data-reveal>
                {study.note}
              </p>
            )}
            <div className="mt-10 flex flex-wrap gap-3" data-reveal>
              {study.liveUrl && (
                <ButtonLink href={study.liveUrl} external icon={<ArrowUpRight className="h-4 w-4" />}>
                  Live demo
                </ButtonLink>
              )}
              {study.sourceUrl && (
                <ButtonLink
                  href={study.sourceUrl}
                  external
                  variant="secondary"
                  icon={<BrandIcon id="github" className="h-4 w-4" />}
                >
                  Source code
                </ButtonLink>
              )}
            </div>
          </section>

          <section className="container-x grid gap-12 pb-24 lg:grid-cols-12">
            <aside className="lg:col-span-4" data-reveal>
              <div className="panel space-y-8 p-6 lg:sticky lg:top-28">
                <div>
                  <h2 className="eyebrow">Stack</h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {study.tags.map((tag) => (
                      <li key={tag} className="chip text-fg">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
                {(study.demoLogin || study.demoPassword) && (
                  <div>
                    <h2 className="eyebrow flex items-center gap-2">
                      <KeyRound aria-hidden="true" className="h-3.5 w-3.5" /> Demo access
                    </h2>
                    <div className="mt-4 space-y-2">
                      {study.demoLogin && <CopyField label="Login" value={study.demoLogin} />}
                      {study.demoPassword && <CopyField label="Password" value={study.demoPassword} />}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            <div className="space-y-16 lg:col-span-8">
              <div data-reveal>
                <h2 className="eyebrow">Highlights</h2>
                <ul className="mt-6 space-y-4">
                  {study.points.map((point) => (
                    <li key={point} className="flex gap-4 text-[16px] leading-relaxed text-fg-muted">
                      <span aria-hidden="true" className="mt-[0.75em] h-px w-4 shrink-0 bg-accent" />
                      <span>
                        <Emphasis text={point} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {study.images.length > 0 && (
                <div data-reveal>
                  <h2 className="eyebrow">Screens</h2>
                  <div className="mt-6">
                    <ProjectGallery images={study.images} title={study.name} />
                  </div>
                </div>
              )}
            </div>
          </section>

          {next && next.slug !== study.slug && (
            <section className="border-t border-white/[0.07]">
              <Link
                to={`/projects/${next.slug}`}
                className="group container-x flex flex-col items-start gap-3 py-20 sm:py-28"
              >
                <span className="eyebrow">Next case study</span>
                <span className="display flex items-center gap-5 text-[clamp(2.2rem,6vw,4.8rem)] transition-colors group-hover:text-accent">
                  {next.name}
                  <ArrowRight aria-hidden="true" className="h-[0.6em] w-[0.6em] transition-transform duration-300 group-hover:translate-x-2" />
                </span>
              </Link>
            </section>
          )}
        </main>
      )}

      <footer className="relative z-10 border-t border-white/[0.07]">
        <div className="container-x flex flex-col gap-3 py-10 text-[13px] text-fg-subtle sm:flex-row sm:justify-between">
          <span>&copy; {new Date().getFullYear()} {profile.name}</span>
          <a href={`mailto:${profile.email}`} className="transition-colors hover:text-fg">
            {profile.email}
          </a>
        </div>
      </footer>
    </div>
  );
}
