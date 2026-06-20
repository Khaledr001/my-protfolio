import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  KeyRound,
  ListChecks,
} from "lucide-react";

import { projects } from "../constants";
import { logo, github } from "../assets";
import { rippleNavigate } from "../utils/ripple";
import ProjectGallery from "../components/ProjectGallery";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
});

const glassCard =
  "rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_10px_40px_-10px_rgba(0,0,0,0.6)]";

// Wrap **double asterisks** around words to highlight them in the accent colour.
function highlight(text) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-semibold text-[var(--accent)]">
        {part}
      </span>
    ) : (
      part
    )
  );
}

// Copy-to-clipboard credential row
function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/30 px-3 py-2">
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-secondary">
          {label}
        </p>
        <p className="truncate font-mono text-sm text-white">{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label}`}
        className="shrink-0 rounded-md p-2 text-secondary transition-colors hover:bg-white/10 hover:text-[var(--accent)]"
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

const ProjectPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const idx = projects.findIndex((p) => p.slug === slug);
  const project = projects[idx];
  const nextProject = idx >= 0 ? projects[(idx + 1) % projects.length] : null;

  // Start at the top whenever a project page opens (or switches projects),
  // since SPA navigation keeps the previous scroll position.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [slug]);

  // Per-route document title for SEO / sharing; restore on unmount.
  useEffect(() => {
    const previous = document.title;
    if (project) {
      document.title = `${project.name} | Syed Khaled Hossain`;
    }
    return () => {
      document.title = previous;
    };
  }, [project]);

  const handleBack = (e) => {
    rippleNavigate(navigate, e.clientX, e.clientY, "/", () => {
      setTimeout(
        () =>
          document
            .getElementById("project")
            ?.scrollIntoView({ behavior: "instant" }),
        10
      );  
    });
  };

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0f1a33] text-white">
        <p className="text-2xl font-bold">Project not found.</p>
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/50 px-5 py-2 text-sm font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </button>
      </div>
    );
  }

  // Normalize media + optional fields so single/legacy values still work.
  const images = project.images?.length
    ? project.images
    : project.image
      ? [project.image]
      : [];
  const videos = project.videos?.length
    ? project.videos
    : project.video
      ? [project.video]
      : [];
  const points = project.points ?? [];
  const liveLink = project.live_demo_link;
  const hasCredentials = project.demo_login || project.demo_password;

  const handleNext = (e) => {
    rippleNavigate(navigate, e.clientX, e.clientY, `/projects/${nextProject.slug}`);
  };

  return (
    <div className="min-h-screen bg-[#0f1a33] text-white-100">
      {/* ── Top bar (navbar) ── */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0f1a33]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </button>
          <Link to="/" aria-label="Home" className="flex items-center gap-2">
            <img src={logo} alt="logo" className="h-8 w-8 object-contain" />
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative flex min-h-[80vh] items-end overflow-hidden border-b border-white/10 px-6 pb-16 pt-32 sm:px-10 lg:px-20">
        <div className="absolute inset-0 z-0">
          {images[0] && (
            <img
              src={images[0]}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover opacity-25"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a33] via-[#0f1a33]/70 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`${glassCard} max-w-4xl p-8 sm:p-10`}
          >
            <span className="inline-block rounded-full border border-[var(--accent)]/40 px-3 py-1 text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
              Project
            </span>

            <h1 className="mt-6 font-black leading-[1.05] text-white text-[clamp(2rem,5vw,3.75rem)]">
              {project.name}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-secondary">
              {project.description}
            </p>

            {/* Tech badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag.name}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm font-medium text-white"
                >
                  {tag.name}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              {liveLink && (
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:shadow-[0_0_24px_-4px_var(--accent)]"
                >
                  <ExternalLink className="h-4 w-4" /> Live Demo
                </a>
              )}
              {project.source_code_link && (
                <a
                  href={project.source_code_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <img
                    src={github}
                    alt=""
                    className="h-4 w-4 object-contain"
                    style={{ filter: "invert(1)" }}
                  />
                  Source Code
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="px-6 py-16 sm:px-10 lg:px-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-12">
          {/* Sidebar */}
          <motion.aside {...fadeUp(0.05)} className="md:col-span-4">
            <div className={`${glassCard} sticky top-24 space-y-6 p-6`}>
              <div>
                <h3 className="mb-3 text-xs font-mono uppercase tracking-widest text-secondary">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag.name}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>

              {(liveLink || project.source_code_link) && (
                <>
                  <div className="h-px bg-white/10" />
                  <div className="space-y-2">
                    <h3 className="mb-3 text-xs font-mono uppercase tracking-widest text-secondary">
                      Links
                    </h3>
                    {liveLink && (
                      <a
                        href={liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[var(--accent)] transition-opacity hover:opacity-75"
                      >
                        <ExternalLink className="h-4 w-4" /> Live Demo ↗
                      </a>
                    )}
                    {project.source_code_link && (
                      <a
                        href={project.source_code_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
                      >
                        <img
                          src={github}
                          alt=""
                          className="h-4 w-4 object-contain"
                          style={{ filter: "invert(1)" }}
                        />
                        Source Code ↗
                      </a>
                    )}
                  </div>
                </>
              )}

              {hasCredentials && (
                <>
                  <div className="h-px bg-white/10" />
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-secondary">
                      <KeyRound className="h-3.5 w-3.5" /> Demo Credentials
                    </h3>
                    <div className="space-y-2">
                      {project.demo_login && (
                        <CopyField label="Email" value={project.demo_login} />
                      )}
                      {project.demo_password && (
                        <CopyField
                          label="Password"
                          value={project.demo_password}
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.aside>

          {/* Main content */}
          <div className="space-y-14 md:col-span-8">
            {/* Overview */}
            <motion.div {...fadeUp(0.1)} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[var(--accent)]">01.</span>
                <h2 className="text-2xl font-bold text-white">Overview</h2>
              </div>
              <p className="text-lg leading-relaxed text-secondary">
                {project.description}
              </p>
            </motion.div>

            {/* Highlights (bullet points) */}
            {points.length > 0 && (
              <motion.div {...fadeUp(0.15)} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[var(--accent)]">02.</span>
                  <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
                    <ListChecks className="h-5 w-5 text-[var(--accent)]" />
                    Highlights
                  </h2>
                </div>
                <ul className="space-y-3">
                  {points.map((point, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-base leading-relaxed text-secondary"
                    >
                      <span className="mt-1 shrink-0 text-[var(--accent)]">▸</span>
                      <span>{highlight(point)}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Gallery — images */}
            {images.length > 0 && (
              <motion.div {...fadeUp(0.2)} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[var(--accent)]">
                    {points.length > 0 ? "03." : "02."}
                  </span>
                  <h2 className="text-2xl font-bold text-white">Gallery</h2>
                </div>
                {images.length > 1 ? (
                  <ProjectGallery images={images} title={project.name} />
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-white/10">
                    <img
                      src={images[0]}
                      alt={`${project.name} screenshot`}
                      loading="lazy"
                      className="w-full object-cover"
                    />
                  </div>
                )}
              </motion.div>
            )}

            {/* Videos */}
            {videos.length > 0 && (
              <motion.div {...fadeUp(0.25)} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[var(--accent)]">
                    {(points.length > 0 ? 1 : 0) + (images.length > 0 ? 1 : 0) + 2}.
                  </span>
                  <h2 className="text-2xl font-bold text-white">Demo Video</h2>
                </div>
                <div className="space-y-6">
                  {videos.map((src, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-black"
                    >
                      <video src={src} controls className="block w-full" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ── Next project ── */}
      {nextProject && nextProject.slug !== project.slug && (
        <section className="border-t border-white/10 px-6 py-16 text-center sm:px-10">
          <p className="mb-4 text-sm font-mono uppercase tracking-widest text-secondary">
            Next Project
          </p>
          <button
            type="button"
            onClick={handleNext}
            className="group inline-flex flex-col items-center"
          >
            <h2 className="font-black text-white transition-colors group-hover:text-[var(--accent)] text-[clamp(1.75rem,5vw,3.5rem)]">
              {nextProject.name}
            </h2>
            <span className="mt-2 h-0.5 w-0 bg-[var(--accent)] transition-all duration-500 group-hover:w-full" />
          </button>
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 px-6 py-10 sm:px-10 lg:px-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-secondary md:flex-row">
          <span className="font-bold text-white">SKH</span>
          <span className="font-mono">&copy; 2026 Syed Khaled Hossain.</span>
        </div>
      </footer>
    </div>
  );
};

export default ProjectPage;
