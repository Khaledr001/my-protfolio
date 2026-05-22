import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { projects } from "../constants";
import { rippleNavigate } from "../utils/ripple";

const Works = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const count = projects.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(count - 1, Math.floor(v * count));
    if (next !== activeIndexRef.current) {
      activeIndexRef.current = next;
      setActiveIndex(next);
    }
  });

  const goTo = useCallback(
    (i) => {
      if (!containerRef.current) return;
      const el = containerRef.current;
      const containerTop = window.scrollY + el.getBoundingClientRect().top;
      const scrollableRange = el.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: Math.round(containerTop + (i / count) * scrollableRange + 1),
        behavior: "smooth",
      });
    },
    [count]
  );

  const handleCardClick = useCallback(
    (e, project) => {
      rippleNavigate(navigate, e.clientX, e.clientY, `/projects/${project.slug}`);
    },
    [navigate]
  );

  return (
    <div ref={containerRef} style={{ height: `calc(100vh + ${count * 260}px)` }}>
      {/* Nav anchor */}
      <span id="project" className="hash-span">&nbsp;</span>

      {/* Sticky full-screen panel */}
      <section
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "linear-gradient(160deg, #07031a 0%, #050816 60%, #020510 100%)",
        }}
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(147,51,234,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Heading — top-left */}
        <div className="relative z-10 pt-14 px-8 sm:px-14 pointer-events-none">
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(192,132,252,0.75)",
              marginBottom: 6,
            }}
          >
            My Work
          </p>
          <h2
            style={{
              fontSize: "clamp(34px, 5vw, 58px)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Projects.
          </h2>
        </div>

        {/* Card stack */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ paddingTop: 80 }}
        >
          <div
            style={{
              position: "relative",
              width: "clamp(360px, 64vw, 760px)",
              height: "clamp(300px, 52vh, 500px)",
            }}
          >
            {/* Render back-to-front so front card paints last */}
            {[...projects].reverse().map((project) => {
              const i = projects.indexOf(project);
              const depth = i - activeIndex;
              const isDeparted = depth < 0;
              const clampedDepth = Math.min(Math.max(depth, 0), 3);
              const isActive = depth === 0;

              let xOff, yOff, scale, opacity;
              if (isDeparted) {
                xOff = 110; yOff = 35; scale = 0.87; opacity = 0;
              } else {
                xOff = clampedDepth * -68;
                yOff = clampedDepth * -36;
                scale = 1 - clampedDepth * 0.055;
                opacity = clampedDepth === 0 ? 1 : Math.max(0.18, 0.72 - clampedDepth * 0.2);
              }

              return (
                <motion.div
                  key={project.slug}
                  animate={{ x: xOff, y: yOff, scale, opacity }}
                  transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                  onClick={isActive ? (e) => handleCardClick(e, project) : () => goTo(i)}
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: isDeparted ? 0 : count - clampedDepth,
                    borderRadius: 18,
                    overflow: "hidden",
                    cursor: isActive ? "pointer" : "default",
                    boxShadow: isActive
                      ? "0 32px 72px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.07)"
                      : "0 14px 36px rgba(0,0,0,0.45)",
                  }}
                >
                  {/* Full-bleed image */}
                  <img
                    src={project.image}
                    alt={project.name}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  {/* Dark gradient overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(5,8,22,0.96) 0%, rgba(5,8,22,0.52) 52%, rgba(5,8,22,0.12) 100%)",
                    }}
                  />

                  {/* Top-right index */}
                  <div
                    style={{
                      position: "absolute",
                      top: 20,
                      right: 22,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.16em",
                      color: "rgba(255,255,255,0.38)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(count).padStart(2, "0")}
                  </div>

                  {/* Bottom content */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "26px 30px",
                    }}
                  >
                    {/* Tech tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag.name}
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.13em",
                            textTransform: "uppercase",
                            color: "rgba(192,132,252,0.72)",
                            border: "1px solid rgba(147,51,234,0.32)",
                            borderRadius: 3,
                            padding: "2px 7px",
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>

                    {/* Project name */}
                    <h3
                      style={{
                        fontSize: "clamp(18px, 2.6vw, 26px)",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "#fff",
                        lineHeight: 1.1,
                        marginBottom: 10,
                      }}
                    >
                      {project.name}
                    </h3>

                    {/* CTA — only on active card */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          key="cta"
                          initial={{ opacity: 0, y: 7 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 7 }}
                          transition={{ duration: 0.22, delay: 0.12 }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.22em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.55)",
                          }}
                        >
                          <span>Take a look</span>
                          <span style={{ fontSize: 13 }}>→</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right-side project list — desktop only */}
        <div
          className="hidden lg:flex"
          style={{
            position: "absolute",
            right: 48,
            top: "50%",
            transform: "translateY(-50%)",
            flexDirection: "column",
            gap: 14,
            zIndex: 20,
          }}
        >
          {projects.map((p, i) => (
            <motion.button
              key={p.slug}
              type="button"
              onClick={() => goTo(i)}
              animate={{
                color:
                  activeIndex === i
                    ? "rgba(255,255,255,0.88)"
                    : "rgba(255,255,255,0.22)",
              }}
              transition={{ duration: 0.3 }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textAlign: "right",
                whiteSpace: "nowrap",
              }}
            >
              {p.name}
            </motion.button>
          ))}
        </div>

        {/* Bottom progress dots */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
            zIndex: 20,
          }}
        >
          {projects.map((_, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              animate={{
                scale: activeIndex === i ? 1.5 : 1,
                backgroundColor:
                  activeIndex === i
                    ? "rgb(147,51,234)"
                    : "rgba(255,255,255,0.2)",
              }}
              transition={{ duration: 0.3 }}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Works;
