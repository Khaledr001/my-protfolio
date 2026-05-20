import { useState } from "react";
import FadeIn from "../components/ui/FadeIn";

const SERVICES = [
  {
    num: "01",
    title: "Backend Development",
    description:
      "Scalable APIs, microservices, and database architecture using NestJS, Node.js, PostgreSQL, and MongoDB.",
  },
  {
    num: "02",
    title: "Frontend Development",
    description:
      "Responsive, animated interfaces with React, TypeScript, and Tailwind CSS.",
  },
  {
    num: "03",
    title: "API Design & Integration",
    description:
      "RESTful APIs, real-time WebSocket systems with Socket.IO, and third-party service integrations.",
  },
  {
    num: "04",
    title: "Full-Stack Engineering",
    description:
      "End-to-end product ownership from architecture to deployment, including CI/CD setup.",
  },
  {
    num: "05",
    title: "Technical Consultation",
    description:
      "Code review, architecture planning, performance optimization, and mentorship.",
  },
];

const ServicesSection = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <section
      className="px-8 md:px-16 lg:px-24 py-28 border-t border-white/[0.06]"
      id="work"
    >
      <FadeIn>
        <p className="text-white/25 text-[12px] uppercase tracking-[5px] font-light mb-5">
          What I do
        </p>
        <h2
          className="font-black leading-none text-white mb-16"
          style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
        >
          Services.
        </h2>
      </FadeIn>

      <div>
        {SERVICES.map((svc, i) => (
          <div
            key={svc.num}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="flex items-start gap-8 py-8 border-b border-white/[0.06] cursor-default"
          >
            <span className="text-[13px] text-white/20 font-light min-w-[36px] pt-2 tracking-wider">
              {svc.num}
            </span>
            <div className="flex-1 min-w-0">
              <h3
                className="font-bold leading-tight transition-colors duration-300"
                style={{
                  fontSize: "clamp(22px, 3vw, 38px)",
                  color: hovered === i ? "#bbccd7" : "rgba(255,255,255,0.45)",
                }}
              >
                {svc.title}
              </h3>
              <div
                className="overflow-hidden transition-all duration-500"
                style={{
                  maxHeight: hovered === i ? "80px" : "0",
                  opacity: hovered === i ? 1 : 0,
                }}
              >
                <p className="mt-2 text-[14px] text-white/40 leading-relaxed">
                  {svc.description}
                </p>
              </div>
            </div>
            <span
              className="text-[28px] text-white/20 transition-all duration-300 pt-0.5 leading-none"
              style={{
                transform: hovered === i ? "rotate(45deg)" : "rotate(0deg)",
                color: hovered === i ? "#bbccd7" : "rgba(255,255,255,0.15)",
              }}
            >
              +
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
