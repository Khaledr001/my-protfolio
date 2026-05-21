import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

// ─── animated counter ─────────────────────────────────────────────────────────
function CountStat({ target, suffix = "", label, duration = 1800 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) frame = requestAnimationFrame(tick);
      else setCount(target);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration]);

  return (
    <div ref={ref} className="flex flex-col items-center md:items-start">
      <span className="text-[52px] md:text-[60px] font-black text-white leading-none tabular-nums">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="mt-2 text-[12px] text-white/30 uppercase tracking-[4px] font-light">
        {label}
      </span>
    </div>
  );
}

// ─── word-by-word reveal ──────────────────────────────────────────────────────
function RevealLine({ text, delay = 0, className = "" }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "105%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.06 }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

// ─── section ──────────────────────────────────────────────────────────────────
const StorySection = () => (
  <section className="px-8 md:px-16 lg:px-24 py-32 border-t border-white/[0.05]">
    {/* Chapter label */}
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-[11px] text-white/20 uppercase tracking-[6px] font-light"
    >
      01 — Story
    </motion.span>

    {/* Narrative headline */}
    <div className="mt-8 mb-6">
      <h2 className="font-black leading-[1.05] text-white/50" style={{ fontSize: "clamp(30px, 4.5vw, 58px)" }}>
        <RevealLine text="Some engineers ship features." delay={0.1} />
      </h2>
      <h2 className="font-black leading-[1.05] text-white mt-1" style={{ fontSize: "clamp(30px, 4.5vw, 58px)" }}>
        <RevealLine text="I design the systems they run on." delay={0.2} />
      </h2>
    </div>

    <motion.p
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.5 }}
      className="text-[16px] md:text-[17px] text-white/35 leading-[1.9] max-w-2xl font-light"
    >
      From competitive programming in Comilla to shipping production SaaS in Chicago —
      five years of learning, building, and scaling systems that matter.
      Backend at heart. Full-stack in practice. Obsessed with craft.
    </motion.p>

    {/* Stats */}
    <div className="mt-20 pt-14 border-t border-white/[0.05] grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-4">
      <CountStat target={5}    suffix="+"   label="Years Coding"      duration={1200} />
      <CountStat target={4}    suffix=""    label="Companies"          duration={800}  />
      <CountStat target={1100} suffix="+"   label="Problems Solved"    duration={2200} />
      <CountStat target={10}   suffix="+"   label="Projects Shipped"   duration={1400} />
    </div>
  </section>
);

export default StorySection;
