import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { projects } from "../constants";
import { github } from "../assets";
import { rippleNavigate } from "../utils/ripple";

const ACCENT = "#38debb";

const glass = {
  background: "rgba(255,255,255,0.03)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const divider = { height: "1px", background: "rgba(255,255,255,0.08)" };

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
});

const ProjectPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const idx = projects.findIndex((p) => p.slug === slug);
  const project = projects[idx];
  const nextProject = idx >= 0 ? projects[(idx + 1) % projects.length] : null;

  if (!project) {
    return (
      <div
        style={{ backgroundColor: "#08132a", minHeight: "100vh" }}
        className="flex items-center justify-center"
      >
        <p className="text-white text-2xl font-bold">Project not found.</p>
      </div>
    );
  }

  const handleBack = (e) => {
    rippleNavigate(navigate, e.clientX, e.clientY, "/", () => {
      setTimeout(
        () => document.getElementById("project")?.scrollIntoView({ behavior: "instant" }),
        10
      );
    });
  };

  const handleNext = (e) => {
    rippleNavigate(navigate, e.clientX, e.clientY, `/projects/${nextProject.slug}`);
  };

  return (
    <div style={{ backgroundColor: "#08132a", minHeight: "100vh", color: "#d9e2ff" }}>

      {/* ── Back button ── */}
      <motion.button
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        onClick={handleBack}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-sm font-mono cursor-pointer bg-transparent border-none transition-colors"
        style={{ color: "rgba(217,226,255,0.45)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(217,226,255,0.45)")}
      >
        ← Back to Projects
      </motion.button>

      {/* ── Hero ── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.28, duration: 0.7 }}
        className="relative flex items-end overflow-hidden"
        style={{
          minHeight: "85vh",
          paddingBottom: "5rem",
          paddingTop: "8rem",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover"
            style={{ opacity: 0.28 }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, #08132a 20%, rgba(8,19,42,0.72) 55%, transparent 100%)",
            }}
          />
        </div>

        {/* Glass card */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-20">
          <motion.div
            {...fadeUp(0.45)}
            style={{ ...glass, maxWidth: "56rem", borderRadius: "0.75rem", padding: "3rem" }}
          >
            <div className="flex items-center gap-4 mb-6">
              <span
                className="text-xs font-mono uppercase tracking-widest px-3 py-1"
                style={{
                  color: ACCENT,
                  border: `1px solid ${ACCENT}55`,
                  borderRadius: "0.25rem",
                }}
              >
                Featured Project
              </span>
            </div>

            <h1
              className="font-black leading-none text-white mb-6"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 5rem)", letterSpacing: "-0.02em" }}
            >
              {project.name}
            </h1>

            <p
              className="text-lg leading-relaxed mb-8 max-w-2xl"
              style={{ color: "#aaa6c3" }}
            >
              {project.description}
            </p>

            <a
              href={project.source_code_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-mono transition-all duration-300"
              style={{
                border: `1px solid ${ACCENT}70`,
                color: ACCENT,
                borderRadius: "0.25rem",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = `${ACCENT}18`)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <img
                src={github}
                alt=""
                className="w-4 h-4 object-contain"
                style={{ filter: "invert(1) brightness(0.7)" }}
              />
              View Source / Live Demo
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Details ── */}
      <section style={{ padding: "5rem 0" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

            {/* Sticky sidebar */}
            <motion.div {...fadeUp(0.52)} className="md:col-span-4">
              <div
                className="space-y-8 p-6"
                style={{ ...glass, position: "sticky", top: "5rem", borderRadius: "0.5rem" }}
              >
                {/* Tech stack */}
                <div>
                  <h3
                    className="text-xs font-mono uppercase tracking-widest mb-3"
                    style={{ color: "rgba(217,226,255,0.38)" }}
                  >
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag.name}
                        className="px-3 py-1 text-sm font-mono text-white"
                        style={{
                          border: "1px solid rgba(255,255,255,0.14)",
                          borderRadius: "0.25rem",
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={divider} />

                {/* Repository */}
                <div>
                  <h3
                    className="text-xs font-mono uppercase tracking-widest mb-3"
                    style={{ color: "rgba(217,226,255,0.38)" }}
                  >
                    Repository / Live
                  </h3>
                  <a
                    href={project.source_code_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-mono transition-colors"
                    style={{ color: ACCENT, textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    <img
                      src={github}
                      alt=""
                      className="w-4 h-4 object-contain"
                      style={{ filter: "invert(1) brightness(0.7)" }}
                    />
                    Open Link ↗
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Main content */}
            <div className="md:col-span-8 space-y-16">

              {/* Overview */}
              <motion.div {...fadeUp(0.58)} className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono" style={{ color: ACCENT }}>
                    01.
                  </span>
                  <h2 className="text-white font-bold text-[2rem]">Project Overview</h2>
                </div>
                <p className="text-lg leading-relaxed" style={{ color: "#aaa6c3" }}>
                  {project.description}
                </p>
              </motion.div>

              {/* Screenshot */}
              <motion.div
                {...fadeUp(0.66)}
                className="relative group overflow-hidden"
                style={{
                  borderRadius: "0.75rem",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute bottom-0 left-0 w-full p-4"
                  style={{
                    background: "rgba(8,19,42,0.85)",
                    backdropFilter: "blur(8px)",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p className="text-xs font-mono" style={{ color: "rgba(217,226,255,0.38)" }}>
                    Fig 1. {project.name} — Project Preview
                  </p>
                </div>
              </motion.div>

              {/* Video — shown only when project.video is set */}
              {project.video && (
                <motion.div
                  {...fadeUp(0.74)}
                  className="overflow-hidden"
                  style={{
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <video
                    src={project.video}
                    controls
                    className="w-full block"
                    style={{ background: "#000" }}
                  />
                  <div
                    className="p-4"
                    style={{
                      background: "rgba(8,19,42,0.85)",
                      borderTop: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <p className="text-xs font-mono" style={{ color: "rgba(217,226,255,0.38)" }}>
                      Fig 2. {project.name} — Demo Video
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Next Project ── */}
      {nextProject && (
        <motion.section
          {...fadeUp(0.82)}
          style={{ padding: "5rem 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="text-center">
            <p
              className="text-xs font-mono uppercase tracking-widest mb-6"
              style={{ color: "rgba(217,226,255,0.38)" }}
            >
              Next Project
            </p>
            <motion.button
              className="group inline-flex flex-col items-center cursor-pointer bg-transparent border-none"
              onClick={handleNext}
              whileHover="hovered"
            >
              <motion.h2
                variants={{ hovered: { color: ACCENT } }}
                className="font-black text-white"
                style={{
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  letterSpacing: "-0.02em",
                  transition: "color 0.3s",
                }}
              >
                {nextProject.name}
              </motion.h2>
              <motion.div
                variants={{ hovered: { scaleX: 1 } }}
                initial={{ scaleX: 0 }}
                style={{
                  height: "2px",
                  width: "100%",
                  background: ACCENT,
                  marginTop: "1rem",
                  transformOrigin: "left",
                  transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
                }}
              />
            </motion.button>
          </div>
        </motion.section>
      )}

      {/* ── Footer ── */}
      <footer style={{ padding: "3rem 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div
          className="max-w-7xl mx-auto px-6 md:px-20 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <span className="text-white font-bold text-xl">SKH</span>
          <span className="text-sm font-mono" style={{ color: "rgba(217,226,255,0.35)" }}>
            © 2026 Syed Khaled Hossain. Built with React.
          </span>
          <a
            href={project.source_code_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono transition-colors"
            style={{ color: "rgba(217,226,255,0.35)", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(217,226,255,0.35)")}
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};

export default ProjectPage;
