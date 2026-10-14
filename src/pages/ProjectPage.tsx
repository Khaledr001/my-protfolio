import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, Expand, Info, KeyRound } from "lucide-react";

import { revealIn, useScrollMotion } from "@/animations/useScrollMotion";
import { BrowserFrame, PhoneFrame, ScreenImage } from "@/components/case-study/DeviceFrames";
import { Lightbox } from "@/components/case-study/Lightbox";
import { ScreensGallery } from "@/components/case-study/ScreensGallery";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ButtonLink } from "@/components/ui/Button";
import { profile } from "@/data/profile";
import { caseStudies, type CaseStudy } from "@/data/projects";
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
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-ink-950/60 px-4 py-2.5">
      <div className="min-w-0">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-fg-subtle">{label}</p>
        <p className="mt-1 truncate font-mono text-[14px] text-fg">{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? `${label} copied` : `Copy ${label.toLowerCase()}`}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-fg-subtle transition-colors hover:bg-white/10 hover:text-fg"
      >
        {copied ? <Check className="h-4 w-4 text-cool-soft" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

/** Address shown in the browser frame: the live host, or the repo path. */
function addressFor(study: CaseStudy) {
  const url = study.liveUrl ?? study.sourceUrl;
  if (!url) return undefined;
  try {
    const { host, pathname } = new URL(url);
    return study.liveUrl ? host : `${host}${pathname}`.replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

/** Soft warm/cool glow behind the page (no 3D on case studies). */
function Backdrop() {
  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 bg-ink-950">
      <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_78%_8%,rgba(242,166,90,0.14),transparent_70%),radial-gradient(45%_40%_at_8%_40%,rgba(79,209,197,0.08),transparent_70%)]" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
    </div>
  );
}

function Header() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink-950/80 backdrop-blur-xl">
      <nav aria-label="Primary" className="container-x flex h-[var(--nav-height)] items-center justify-between gap-4">
        <Link
          to="/#work"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-[14px] font-medium text-fg transition-colors hover:border-accent/60"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          All work
        </Link>
        <Link to="/" className="flex items-center gap-3" aria-label={`${profile.name}, home`}>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-line-strong font-mono text-[10.5px] font-semibold tracking-wider text-fg">
            {profile.initials}
          </span>
          <span className="hidden text-[14px] font-medium text-fg sm:block">{profile.name}</span>
        </Link>
        <a
          href={`mailto:${profile.email}`}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-[14px] font-semibold text-ink-950 transition-colors hover:bg-accent-soft"
        >
          Let&rsquo;s talk
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </nav>
      <div className="absolute inset-x-0 bottom-0 h-px overflow-hidden" aria-hidden="true">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-gradient-to-r from-accent-deep via-accent to-cool" />
      </div>
    </header>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display mt-3 text-[clamp(1.75rem,3vw,2.4rem)]">{title}</h2>
    </div>
  );
}

function SiblingCard({ study, direction }: { study: CaseStudy; direction: "Previous" | "Next" }) {
  const cover = study.screens.find((s) => s.device === "desktop") ?? study.screens[0];
  return (
    <Link
      to={`/projects/${study.slug}`}
      className="card group flex flex-col transition-colors hover:border-accent/50"
    >
      {cover && (
        <div className="aspect-[2.2/1] overflow-hidden border-b border-line">
          <img
            src={cover.src}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover object-top opacity-80 transition-[transform,opacity] duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
          />
        </div>
      )}
      <div className={`flex flex-1 flex-col gap-2 p-6 ${direction === "Next" ? "sm:items-end sm:text-right" : ""}`}>
        <span className="eyebrow">{direction} case study</span>
        <span className="display flex items-center gap-3 text-[clamp(1.4rem,2.4vw,1.9rem)] transition-colors group-hover:text-accent">
          {direction === "Previous" && <ArrowLeft aria-hidden="true" className="h-5 w-5 shrink-0" />}
          {study.name}
          {direction === "Next" && <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />}
        </span>
        <span className="text-[14.5px] text-fg-subtle">{study.kind}</span>
      </div>
    </Link>
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
  const [lightbox, setLightbox] = useState<number | null>(null);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const index = caseStudies.findIndex((c) => c.slug === slug);
  const study = caseStudies[index];
  const total = caseStudies.length;
  const previous = index >= 0 ? caseStudies[(index - 1 + total) % total] : undefined;
  const next = index >= 0 ? caseStudies[(index + 1) % total] : undefined;

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

  const address = study ? addressFor(study) : undefined;
  const hero = study?.screens[0];
  const hasAccess = Boolean(study?.demoLogin || study?.demoPassword);

  return (
    <div ref={ref} className="relative min-h-screen">
      <Backdrop />
      <Header />

      {!study ? (
        <NotFound />
      ) : (
        <main id="main" className="relative z-10">
          {/* ── Intro ─────────────────────────────────────────────────── */}
          <section className="container-x pt-[calc(var(--nav-height)+4rem)] sm:pt-[calc(var(--nav-height)+6rem)]">
            <p className="eyebrow flex flex-wrap items-center gap-3" data-reveal>
              <span className="text-accent">
                Case study {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
              <span>{study.kind}</span>
            </p>
            <h1 className="display mt-6 max-w-5xl text-[clamp(2.5rem,6vw,5.25rem)]" data-reveal-lines>
              <span className="line-mask">
                <span>{study.name}</span>
              </span>
            </h1>

            <div className="mt-8 grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="text-[18px] leading-[1.7] text-fg-muted sm:text-[19px]" data-reveal>
                  {study.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-3" data-reveal>
                  {study.liveUrl && (
                    <ButtonLink href={study.liveUrl} external size="lg" icon={<ArrowUpRight className="h-4 w-4" />}>
                      Open live demo
                    </ButtonLink>
                  )}
                  {study.sourceUrl && (
                    <ButtonLink
                      href={study.sourceUrl}
                      external
                      size="lg"
                      variant={study.liveUrl ? "secondary" : "primary"}
                      icon={<BrandIcon id="github" className="h-4 w-4" />}
                    >
                      View source
                    </ButtonLink>
                  )}
                </div>
              </div>

              {/* At a glance */}
              <dl className="card grid divide-y divide-line self-start lg:col-span-5" data-reveal>
                <div className="grid grid-cols-[7rem_1fr] gap-4 px-6 py-4">
                  <dt className="eyebrow pt-0.5">Type</dt>
                  <dd className="text-[15px] text-fg">{study.kind}</dd>
                </div>
                <div className="grid grid-cols-[7rem_1fr] gap-4 px-6 py-4">
                  <dt className="eyebrow pt-0.5">Core stack</dt>
                  <dd className="text-[15px] text-fg">{study.tags.slice(0, 4).join(" · ")}</dd>
                </div>
                <div className="grid grid-cols-[7rem_1fr] gap-4 px-6 py-4">
                  <dt className="eyebrow pt-0.5">Try it</dt>
                  <dd className="text-[15px] text-fg">
                    {[study.liveUrl && "Live demo", study.sourceUrl && "Source code", hasAccess && "Demo account"]
                      .filter(Boolean)
                      .join(" · ") || "Screenshots below"}
                  </dd>
                </div>
              </dl>
            </div>

            {study.note && (
              <p className="mt-8 flex max-w-4xl gap-3 rounded-xl border border-cool/30 bg-cool/[0.07] px-5 py-4 text-[15px] leading-[1.65] text-fg-muted" data-reveal>
                <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-cool" />
                <span>{study.note}</span>
              </p>
            )}
          </section>

          {/* ── Showcase ──────────────────────────────────────────────── */}
          {hero && (
            <section className="container-x mt-14 sm:mt-20" aria-label="Product screenshot">
              <div className="relative" data-reveal>
                <div aria-hidden="true" className="absolute -inset-y-12 inset-x-0 -z-10 sm:-inset-x-10 bg-[radial-gradient(50%_60%_at_50%_40%,rgba(242,166,90,0.16),transparent_70%)]" />
                <button
                  type="button"
                  onClick={() => setLightbox(0)}
                  aria-label={`Open ${study.name} screenshot 1 of ${study.screens.length}`}
                  className="group relative block w-full cursor-zoom-in text-left"
                >
                  {hero.device === "desktop" ? (
                    <BrowserFrame address={address}>
                      <ScreenImage screen={hero} alt={`${study.name} — main screen`} eager />
                    </BrowserFrame>
                  ) : (
                    <PhoneFrame className="mx-auto max-w-xs">
                      <ScreenImage screen={hero} alt={`${study.name} — main screen`} eager />
                    </PhoneFrame>
                  )}
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/90 p-2.5 text-[13.5px] font-medium text-fg opacity-90 transition-opacity group-hover:opacity-100 sm:bottom-5 sm:right-5 sm:px-4 sm:py-2">
                    <Expand aria-hidden="true" className="h-4 w-4" />
                    <span className="hidden sm:inline">View full size</span>
                  </span>
                </button>
              </div>
            </section>
          )}

          {/* ── Details ───────────────────────────────────────────────── */}
          <section className="container-x grid gap-12 py-20 sm:py-28 lg:grid-cols-12">
            <div className="space-y-20 lg:col-span-8">
              <div>
                <SectionTitle eyebrow="Highlights" title="What I built" />
                <ol className="card mt-8 divide-y divide-line" data-reveal>
                  {study.points.map((point, i) => (
                    <li key={point} className="flex gap-5 px-6 py-5 sm:px-8 sm:py-6">
                      <span className="w-7 shrink-0 font-display text-[15px] font-bold leading-[1.8] text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[16.5px] leading-[1.7] text-fg-muted">
                        <Emphasis text={point} />
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {study.screens.length > 1 && (
                <div>
                  <SectionTitle eyebrow="Screens" title="More of the product" />
                  <div className="mt-8" data-reveal>
                    <ScreensGallery
                      screens={study.screens}
                      shown={study.screens.slice(1)}
                      title={study.name}
                      address={address}
                      onOpen={setLightbox}
                    />
                  </div>
                </div>
              )}
            </div>

            <aside className="order-first lg:order-last lg:col-span-4" data-reveal>
              <div className="card divide-y divide-line lg:sticky lg:top-28">
                <div className="p-6">
                  <h2 className="eyebrow">Stack</h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {study.tags.map((tag) => (
                      <li key={tag} className="chip">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                {(study.liveUrl || study.sourceUrl) && (
                  <div className="p-6">
                    <h2 className="eyebrow">Links</h2>
                    <ul className="mt-4 space-y-2">
                      {study.liveUrl && (
                        <li>
                          <a href={study.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-[15px] text-fg transition-colors hover:border-accent/60">
                            <span className="truncate">{address}</span>
                            <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
                            <span className="sr-only">(opens in a new tab)</span>
                          </a>
                        </li>
                      )}
                      {study.sourceUrl && (
                        <li>
                          <a href={study.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-[15px] text-fg transition-colors hover:border-accent/60">
                            <span className="flex items-center gap-2">
                              <BrandIcon id="github" className="h-4 w-4" /> Source on GitHub
                            </span>
                            <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
                            <span className="sr-only">(opens in a new tab)</span>
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {hasAccess && (
                  <div className="p-6">
                    <h2 className="eyebrow flex items-center gap-2">
                      <KeyRound aria-hidden="true" className="h-4 w-4" /> Demo access
                    </h2>
                    <p className="mt-2 text-[14px] leading-[1.6] text-fg-subtle">A shared public account for the live demo.</p>
                    <div className="mt-4 space-y-2">
                      {study.demoLogin && <CopyField label="Login" value={study.demoLogin} />}
                      {study.demoPassword && <CopyField label="Password" value={study.demoPassword} />}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </section>

          {/* ── More case studies ─────────────────────────────────────── */}
          {previous && next && total > 1 && (
            <nav aria-label="More case studies" className="border-t border-line">
              <div className="container-x grid gap-6 py-16 sm:grid-cols-2 sm:py-20">
                <SiblingCard study={previous} direction="Previous" />
                <SiblingCard study={next} direction="Next" />
              </div>
            </nav>
          )}
        </main>
      )}

      <footer className="relative z-10 border-t border-line">
        <div className="container-x flex flex-col gap-3 py-10 text-[14px] text-fg-subtle sm:flex-row sm:justify-between">
          <span>&copy; {new Date().getFullYear()} {profile.name}</span>
          <a href={`mailto:${profile.email}`} className="transition-colors hover:text-fg">
            {profile.email}
          </a>
        </div>
      </footer>

      {study && lightbox !== null && (
        <Lightbox screens={study.screens} index={lightbox} title={study.name} onIndex={setLightbox} onClose={closeLightbox} />
      )}
    </div>
  );
}
