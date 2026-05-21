import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const EXPERIENCE = [
  {
    company: "Sidago Inc",
    role: "Full-Stack Developer",
    period: "Feb 2026 – Present",
    location: "Chicago, USA · Remote",
    highlight:
      "Built mazarini — a full-stack headless CMS using Strapi, Next.js and TypeScript in a monorepo. Engineered mega menus, animated hero sections and touch carousels with Framer Motion.",
    tech: ["Next.js", "Strapi", "TypeScript", "Docker", "PostgreSQL", "Nginx", "Framer Motion"],
    accent: "#818cf8",
    current: true,
  },
  {
    company: "Bizreflex",
    role: "Junior Software Engineer",
    period: "Jul 2025 – Jan 2026",
    location: "Dhaka, Bangladesh",
    highlight:
      "Built TekomoPro — a technician marketplace. Optimised Order Service APIs by ~30% via query tuning. Implemented event-driven services with RabbitMQ and NATS. AWS S3 for file storage.",
    tech: ["NestJS", "Angular", "PostgreSQL", "RabbitMQ", "NATS", "AWS S3", "Knex"],
    accent: "#a78bfa",
    current: false,
  },
  {
    company: "Bright Technology Ltd",
    role: "Junior Software Engineer",
    period: "Jan 2024 – Jun 2025",
    location: "Dhaka, Bangladesh",
    highlight:
      "Architected a multi-tenant ISP SaaS platform with company-level RBAC, JWT auth, bKash payment gateway integration, MikroTik RouterOS API for PPPoE provisioning, and automated billing cron jobs.",
    tech: ["Node.js", "Express", "TypeScript", "MongoDB", "Docker", "Swagger", "bKash API"],
    accent: "#38bdf8",
    current: false,
  },
  {
    company: "Telemedicine NGO",
    role: "Backend Developer",
    period: "Jun 2023 – Nov 2023",
    location: "Bangladesh",
    highlight:
      "Developed an online prescription system for doctors — patients could view, download and print prescriptions. Integrated Bangladesh regional data (District, Sub-District, Union) for location-based doctor search.",
    tech: ["NestJS", "PostgreSQL", "MongoDB"],
    accent: "#34d399",
    current: false,
  },
];

function ExperienceCard({ exp, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      className="relative pl-10 pb-20 last:pb-0"
    >
      {/* Dot on the timeline */}
      <div
        className="absolute left-0 top-[6px] w-[10px] h-[10px] rounded-full -translate-x-[5px] ring-2 ring-offset-2 ring-offset-transparent transition-all"
        style={{
          background: exp.current ? exp.accent : "#04112a",
          borderColor: exp.accent,
          ringColor: exp.accent,
          boxShadow: exp.current ? `0 0 12px ${exp.accent}88` : "none",
        }}
      />

      {/* Current badge */}
      {exp.current && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border mb-3 w-fit"
          style={{ borderColor: `${exp.accent}44`, background: `${exp.accent}16` }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: exp.accent }} />
          <span className="text-[11px] font-light tracking-[3px] uppercase" style={{ color: exp.accent }}>
            Current
          </span>
        </motion.div>
      )}

      {/* Company + meta */}
      <h3 className="text-[26px] md:text-[32px] font-bold text-white leading-none mb-1">
        {exp.company}
      </h3>
      <p className="text-[13px] text-white/30 font-light tracking-wide mb-5">
        {exp.role} · {exp.location} · {exp.period}
      </p>

      {/* Key achievement */}
      <p className="text-[15px] text-white/55 leading-[1.85] mb-6 max-w-xl">
        {exp.highlight}
      </p>

      {/* Tech pills */}
      <div className="flex flex-wrap gap-2">
        {exp.tech.map((t) => (
          <span
            key={t}
            className="px-3 py-1 text-[11px] rounded-full border border-white/[0.07] text-white/30 tracking-wide"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

const JourneySection = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "end 0.5"],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="px-8 md:px-16 lg:px-24 py-28 border-t border-white/[0.05]"
      id="work"
    >
      {/* Header */}
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-[11px] text-white/20 uppercase tracking-[6px] font-light"
      >
        02 — Journey
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-4 font-black leading-none text-white"
        style={{ fontSize: "clamp(48px, 7vw, 90px)" }}
      >
        Career.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-4 text-white/30 text-[15px] max-w-xl leading-relaxed font-light"
      >
        Four companies. One constant — building systems that scale.
      </motion.p>

      {/* Timeline */}
      <div className="mt-16 relative">
        {/* Track line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-white/[0.05]">
          <motion.div
            className="absolute top-0 left-0 right-0 origin-top"
            style={{
              scaleY: lineScaleY,
              height: "100%",
              background: "linear-gradient(to bottom, #818cf8, #34d399)",
            }}
          />
        </div>

        <div className="pl-7">
          {EXPERIENCE.map((exp, i) => (
            <ExperienceCard key={exp.company} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
