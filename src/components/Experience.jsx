import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";

import { experiences } from "../constants";
import { styles } from "../style";

// ─── Experience component ─────────────────────────────────────────────────────
// Architecture: tall container (100vh + count×200px) with a sticky full-screen
// panel. As the user scrolls through the container the panel stays pinned at
// the top and scrollYProgress drives which experience is active. No wheel-event
// hijacking needed — the sticky layout handles the "stay in section" behaviour
// natively.

const Experience = () => {
  const containerRef = useRef(null);
  const count = experiences.length;

  // Scroll progress across the whole container (0 → 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Circle geometry
  const startAngle   = -90 + 360 / count / 2;
  const arcSpan      = 180 - 360 / count;
  const anglePerStep = count > 1 ? arcSpan / (count - 1) : 0;

  // Pre-compute arc positions once — avoids sin/cos on every render
  const arcPositions = useMemo(
    () =>
      experiences.map((_, i) => {
        const angle = startAngle + i * anglePerStep;
        const rad = (angle * Math.PI) / 180;
        return { xOff: Math.cos(rad) * 200, yOff: Math.sin(rad) * 200 };
      }),
    [startAngle, anglePerStep]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  // Map scroll progress → discrete experience index
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(count - 1, Math.floor(v * count));
    if (next !== activeIndexRef.current) {
      activeIndexRef.current = next;
      setActiveIndex(next);
    }
  });

  // Jump to an experience by scrolling to its position in the container
  const goTo = useCallback(
    (i) => {
      if (!containerRef.current) return;
      const el = containerRef.current;
      const containerTop   = window.scrollY + el.getBoundingClientRect().top;
      const scrollableRange = el.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: Math.round(containerTop + (i / count) * scrollableRange + 1),
        behavior: "smooth",
      });
    },
    [count],
  );

  const navigate = useCallback(
    (dir) => goTo(Math.max(0, Math.min(count - 1, activeIndexRef.current + dir))),
    [count, goTo],
  );

  const active    = experiences[activeIndex];
  const rotation  = startAngle + activeIndex * anglePerStep;
  const shortName = (name) => name.split(" — ")[0];

  return (
    // Tall container — the extra height is what keeps the sticky panel in view
    // while the user scrolls (≈ 200px of scroll distance per experience)
    <div
      ref={containerRef}
      style={{ height: `calc(100vh + ${count * 200}px)` }}
    >
      {/* Nav anchor */}
      <span id="work" className="hash-span">&nbsp;</span>

      {/* ── Sticky full-screen panel ───────────────────────────────────────── */}
      <section
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0d0520 0%, #060a1c 55%, #050816 100%)",
        }}
      >
        {/* Honeycomb pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='%239C27B0' stroke-width='1'/%3E%3Cpath d='M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34' fill='none' stroke='%239C27B0' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: "56px 100px",
          }}
        />

        <div className="relative z-10 h-full flex flex-col w-full py-8">

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className={`${styles.sectionSubText} text-center`}>
              What I have done so far
            </p>
            <h2 className={`${styles.sectionHeadText} text-center pb-10`}>
              Work Experience.
            </h2>
          </motion.div>

          {/* Main grid */}
          <div className="flex-1 min-h-0 flex items-center mt-4">
            <div className="relative w-full grid grid-cols-1 md:grid-cols-2 items-center gap-24 lg:gap-40">

              {/* ── Left: circle (md+) ──────────────────────────────────────── */}
              <div
                className="hidden md:flex items-center justify-center"
                style={{ height: 400 }}
              >
                <div className="origin-center scale-[0.78] lg:scale-[0.9] xl:scale-100">
                  <div className="relative" style={{ width: 400, height: 400 }}>

                    {/* Outer ring */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                    />

                    {/* Inner circle — company icon */}
                    <div
                      className="absolute inset-8 rounded-full overflow-hidden"
                      style={{ border: "4px solid rgba(147,51,234,0.55)" }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={active.company_name}
                          initial={{ opacity: 0, scale: 1.08 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.94 }}
                          transition={{ duration: 0.45 }}
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ background: active.iconBg }}
                        >
                          <img
                            src={active.icon}
                            alt={active.company_name}
                            style={{ width: "55%", height: "55%", objectFit: "contain" }}
                          />
                        </motion.div>
                      </AnimatePresence>
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(88,28,135,0.35), transparent)",
                        }}
                      />
                    </div>

                    {/* Rotating indicator dot */}
                    <motion.div
                      className="absolute"
                      style={{
                        left: "50%",
                        top: "50%",
                        width: 16,
                        height: 16,
                        transformOrigin: "0 0",
                      }}
                      animate={{ rotate: rotation }}
                      transition={{ duration: 0.55, ease: "easeInOut" }}
                    >
                      <div
                        className="absolute rounded-full"
                        style={{
                          width: 16,
                          height: 16,
                          left: 196,
                          top: -8,
                          marginLeft: -8,
                          background: "rgb(147,51,234)",
                          boxShadow: "0 0 14px rgba(147,51,234,0.9)",
                        }}
                      />
                    </motion.div>

                    {/* Arc menu items */}
                    {experiences.map((exp, i) => {
                      const { xOff, yOff } = arcPositions[i];
                      return (
                        <div
                          key={exp.company_name}
                          className="absolute"
                          style={{
                            left: "50%",
                            top: "50%",
                            transform: `translate(${xOff + 24}px, ${yOff - 10}px)`,
                          }}
                        >
                          <motion.button
                            type="button"
                            onClick={() => goTo(i)}
                            animate={{
                              color:
                                activeIndex === i
                                  ? "rgb(255,255,255)"
                                  : "rgba(255,255,255,0.38)",
                            }}
                            transition={{ duration: 0.3 }}
                            className="cursor-pointer whitespace-nowrap text-sm font-medium tracking-wide hover:text-white"
                          >
                            {shortName(exp.company_name)}
                          </motion.button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── Right: active content ──────────────────────────────────── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.company_name}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col justify-center"
                >
                  <p
                    className="text-xs font-bold tracking-widest uppercase mb-3"
                    style={{ color: "rgba(192,132,252,0.85)" }}
                  >
                    {active.date}
                  </p>

                  <h2 className="text-white text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-1">
                    {active.title}
                  </h2>

                  <p
                    className="mb-1 text-[0.975rem]"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {active.company_name}
                  </p>

                  <p
                    className="text-sm mb-6"
                    style={{ color: "rgba(192,132,252,0.5)" }}
                  >
                    {active.project}
                  </p>

                  <ul className="space-y-2.5">
                    {active.points.map((point, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-sm leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.65)" }}
                      >
                        <span
                          className="shrink-0 mt-0.5"
                          style={{ color: "rgb(167,139,250)" }}
                        >
                          ▸
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  {/* Prev / Next */}
                  <div className="flex gap-3 mt-8">
                    {[["←", -1], ["→", 1]].map(([arrow, dir]) => (
                      <button
                        key={dir}
                        type="button"
                        onClick={() => navigate(dir)}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                        style={{
                          border: "1px solid rgba(147,51,234,0.45)",
                          background: "rgba(88,28,135,0.2)",
                          color: "rgba(255,255,255,0.55)",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "rgba(255,255,255,0.55)")
                        }
                      >
                        {arrow}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                {experiences.map((_, i) => (
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
                    className="w-2 h-2 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Experience;
