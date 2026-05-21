import { motion } from "framer-motion";
import Magnet from "../components/ui/Magnet";
import ContactButton from "../components/ui/ContactButton";

const LINKS = [
  {
    label: "Email",
    value: "syedkhaled.h01@gmail.com",
    href: "mailto:syedkhaled.h01@gmail.com",
    accent: "#818cf8",
  },
  {
    label: "GitHub",
    value: "github.com/Khaledr001",
    href: "https://github.com/Khaledr001",
    accent: "#22d3ee",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/khaled01",
    href: "https://www.linkedin.com/in/khaled01",
    accent: "#38bdf8",
  },
];

const ContactSection = () => (
  <section
    className="px-8 md:px-16 lg:px-24 pt-28 pb-24 border-t border-white/[0.05]"
    id="contact"
  >
    {/* Chapter label */}
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-[11px] text-white/20 uppercase tracking-[6px] font-light"
    >
      05 — Contact
    </motion.span>

    {/* Headline */}
    <div className="mt-6 mb-16 overflow-hidden">
      <motion.h2
        initial={{ y: "100%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="font-black text-white leading-[0.92]"
        style={{ fontSize: "clamp(52px, 9vw, 128px)" }}
      >
        Let's work
        <br />
        <span className="hero-heading">together.</span>
      </motion.h2>
    </div>

    {/* Link rows */}
    <div className="flex flex-col divide-y divide-white/[0.05] mb-16">
      {LINKS.map(({ label, value, href, accent }, i) => (
        <motion.a
          key={label}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
          className="flex items-center justify-between py-6 group"
        >
          <div className="flex items-baseline gap-6">
            <span
              className="text-[11px] uppercase tracking-[4px] font-light min-w-[70px]"
              style={{ color: `${accent}88` }}
            >
              {label}
            </span>
            <span className="text-[16px] md:text-[20px] text-white/40 group-hover:text-white transition-colors duration-300 font-light">
              {value}
            </span>
          </div>
          <span className="text-[22px] text-white/15 group-hover:text-white group-hover:translate-x-2 transition-all duration-300">
            →
          </span>
        </motion.a>
      ))}
    </div>

    {/* CTA button */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
    >
      <Magnet>
        <ContactButton onClick={() => window.open("mailto:syedkhaled.h01@gmail.com")}>
          Send me a message
        </ContactButton>
      </Magnet>
      <span className="text-[13px] text-white/20 font-light">
        Based in Dubai, UAE · Open to remote worldwide
      </span>
    </motion.div>

    {/* Footer */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mt-24 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between gap-4 text-[12px] text-white/15 font-light"
    >
      <span>© 2026 Syed Khaled Hossain</span>
      <span>Built with React · Three.js · Framer Motion</span>
    </motion.div>
  </section>
);

export default ContactSection;
