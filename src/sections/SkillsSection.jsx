import { motion } from "framer-motion";

const CATEGORIES = [
  {
    label: "Backend",
    accent: "#818cf8",
    skills: ["Node.js", "NestJS", "Express.js", "TypeScript", "REST APIs", "Microservices", "RabbitMQ", "NATS", "JWT", "bKash API"],
  },
  {
    label: "Frontend",
    accent: "#22d3ee",
    skills: ["React", "Angular", "Next.js", "Tailwind CSS", "Framer Motion", "Bootstrap"],
  },
  {
    label: "Database",
    accent: "#34d399",
    skills: ["PostgreSQL", "MongoDB", "MySQL", "Mongoose", "Knex"],
  },
  {
    label: "Cloud & Ops",
    accent: "#f97316",
    skills: ["AWS EC2", "AWS S3", "Docker", "Nginx", "Git", "GitHub", "GitLab"],
  },
  {
    label: "Languages",
    accent: "#e879f9",
    skills: ["JavaScript", "TypeScript", "Python", "C++", "C#", "C"],
  },
];

const CONCEPTS = [
  "SaaS Architecture", "Multi-tenant Systems", "RBAC", "Authentication",
  "Payment Integration", "Event-driven Systems", "Background Jobs",
  "Query Optimisation", "Monorepo", "SEO",
];

function SkillPill({ name, accent, index }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileHover={{ color: "#fff", borderColor: accent }}
      className="px-4 py-[7px] rounded-full text-[12px] border border-white/[0.07] text-white/35 cursor-default transition-colors duration-200"
    >
      {name}
    </motion.span>
  );
}

const SkillsSection = () => (
  <section className="px-8 md:px-16 lg:px-24 py-28 border-t border-white/[0.05]">
    {/* Header */}
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-[11px] text-white/20 uppercase tracking-[6px] font-light"
    >
      03 — Skills
    </motion.span>

    <motion.h2
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mt-4 font-black leading-none text-white"
      style={{ fontSize: "clamp(48px, 7vw, 90px)" }}
    >
      The Stack.
    </motion.h2>

    <motion.p
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-4 text-white/30 text-[15px] max-w-xl leading-relaxed font-light"
    >
      Tools I reach for every day. Concepts I've shipped in production.
    </motion.p>

    {/* Skill rows */}
    <div className="mt-14 space-y-7">
      {CATEGORIES.map(({ label, accent, skills }) => (
        <div key={label} className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-8">
          <span
            className="text-[11px] uppercase tracking-[3px] font-light sm:min-w-[80px] pt-[9px]"
            style={{ color: accent }}
          >
            {label}
          </span>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <SkillPill key={s} name={s} accent={accent} index={i} />
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Core concepts */}
    <div className="mt-14 pt-10 border-t border-white/[0.05]">
      <p className="text-[11px] text-white/20 uppercase tracking-[5px] font-light mb-6">
        Core Concepts
      </p>
      <div className="flex flex-wrap gap-3">
        {CONCEPTS.map((c, i) => (
          <motion.span
            key={c}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="text-[13px] text-white/25 font-light"
          >
            {c}{i < CONCEPTS.length - 1 && <span className="text-white/10 mx-3">·</span>}
          </motion.span>
        ))}
      </div>
    </div>

    {/* Competitive programming callout */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mt-14 p-7 rounded-2xl border border-white/[0.07] bg-white/[0.02]"
    >
      <p className="text-[12px] text-indigo-400/60 uppercase tracking-[4px] font-light mb-3">
        Competitive Programming
      </p>
      <p className="text-[22px] font-bold text-white mb-2">1100+ problems solved</p>
      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3">
        {[
          ["Codeforces", "700+"],
          ["LeetCode", "200+"],
          ["Toph", "150+"],
          ["LightOJ", "70+"],
          ["UVA", "50+"],
        ].map(([platform, count]) => (
          <span key={platform} className="text-[13px] text-white/40 font-light">
            {platform} <span className="text-white/60">{count}</span>
          </span>
        ))}
      </div>
    </motion.div>
  </section>
);

export default SkillsSection;
