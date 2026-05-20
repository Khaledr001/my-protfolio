import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import FadeIn from "../components/ui/FadeIn";

const CARDS = [
  {
    title: "Backend Development",
    description:
      "Scalable server-side applications with NestJS, Node.js, PostgreSQL, and MongoDB — from schema design to deployment.",
    icon: "⚡",
    accent: "#B600A8",
  },
  {
    title: "API Design",
    description:
      "RESTful and real-time APIs with Socket.IO, JWT authentication, role-based permissions, and multi-tenant architecture.",
    icon: "◈",
    accent: "#7621B0",
  },
  {
    title: "Frontend Development",
    description:
      "Clean, performant UIs with React, TypeScript, and Tailwind CSS. Smooth animations with Framer Motion.",
    icon: "✦",
    accent: "#BE4C00",
  },
  {
    title: "Full-Stack Engineering",
    description:
      "End-to-end product ownership — database, API, UI, and infrastructure — delivered on time.",
    icon: "◉",
    accent: "#B600A8",
  },
];

const ServiceCard = ({ card, index, progress, total }) => {
  const targetScale = 1 - (total - 1 - index) * 0.04;
  const scale = useTransform(
    progress,
    [index / total, (index + 1) / total],
    [1, targetScale]
  );

  return (
    <div
      className="sticky flex items-center justify-center"
      style={{ top: `${96 + index * 24}px`, height: "85vh" }}
    >
      <motion.div
        style={{ scale }}
        className="w-full rounded-3xl p-10 border border-white/[0.08] bg-[#111111]"
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-8"
          style={{
            background: card.accent + "22",
            border: `1px solid ${card.accent}44`,
          }}
        >
          {card.icon}
        </div>
        <h3 className="text-[32px] font-bold text-white mb-4">{card.title}</h3>
        <p className="text-white/45 text-[15px] leading-relaxed max-w-sm">
          {card.description}
        </p>
        <div
          className="mt-8 h-px w-16"
          style={{ background: card.accent + "88" }}
        />
      </motion.div>
    </div>
  );
};

const AboutSection = () => {
  const cardsRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardsRef,
    offset: ["start start", "end end"],
  });

  return (
    <section className="px-8 md:px-16 lg:px-24 py-28" id="about">
      <div className="grid lg:grid-cols-5 gap-16 items-start">
        {/* Left: bio text */}
        <div className="lg:col-span-2 lg:sticky lg:top-24">
          <FadeIn>
            <p className="text-white/25 text-[12px] uppercase tracking-[5px] font-light mb-5">
              About me
            </p>
            <h2
              className="font-black leading-none text-white mb-10"
              style={{ fontSize: "clamp(48px, 6vw, 80px)" }}
            >
              Who
              <br />I am.
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-white/45 text-[15px] leading-[1.9] mb-5">
              I&apos;m{" "}
              <span className="text-white font-medium">
                Syed Khaled Hossain
              </span>
              , a full-stack developer specializing in backend systems with
              NestJS and Node.js. I build products that are fast, reliable, and
              scalable.
            </p>
            <p className="text-white/45 text-[15px] leading-[1.9] mb-5">
              I&apos;ve shipped ISP management platforms, real-time prescription
              systems, and chat applications at companies like Vivasoft, Enosis
              Solutions, and DevsFleet.
            </p>
            <p className="text-white/45 text-[15px] leading-[1.9]">
              Currently available for new opportunities — remote or on-site in
              Bangladesh.
            </p>
          </FadeIn>
        </div>

        {/* Right: sticky card stack */}
        <div ref={cardsRef} className="lg:col-span-3">
          {CARDS.map((card, i) => (
            <ServiceCard
              key={card.title}
              card={card}
              index={i}
              progress={scrollYProgress}
              total={CARDS.length}
            />
          ))}
          <div style={{ height: "10vh" }} />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
