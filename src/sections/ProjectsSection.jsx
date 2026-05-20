import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import FadeIn from "../components/ui/FadeIn";
import LiveProjectButton from "../components/ui/LiveProjectButton";
import { chat_app, isp3, eCommerce, employees, eWallet } from "../assets";

const PROJECTS = [
  {
    title: "Chat Application",
    description:
      "Real-time messaging platform with Socket.IO, NestJS backend, MongoDB persistence, and a React frontend.",
    tags: ["NestJS", "Socket.IO", "MongoDB", "React", "TypeScript"],
    image: chat_app,
    link: "https://github.com/Khaledr001/chat-app.git",
    year: "2024",
    bg: "#0d0a18",
  },
  {
    title: "ISP Solution Backend",
    description:
      "Multi-tenant ISP management platform with role-based auth, MikroTik router control, and real-time stats.",
    tags: ["Node.js", "MongoDB", "Express", "TypeScript"],
    image: isp3,
    link: "https://ispadmin.softinsightsltd.com/",
    year: "2023",
    bg: "#0a150d",
  },
  {
    title: "E-Commerce Platform",
    description:
      "Single-vendor storefront with admin panel, product management, cart, and smooth checkout flow.",
    tags: ["React", "Node.js", "MongoDB", "Tailwind", "DaisyUI"],
    image: eCommerce,
    link: "https://github.com/Khaledr001/eCommerce",
    year: "2023",
    bg: "#180d0a",
  },
  {
    title: "Employee Management",
    description:
      "HR platform for leave requests, company notices, employee records, and role-based dashboards.",
    tags: ["React", "Node.js", "MongoDB", "DaisyUI"],
    image: employees,
    link: "https://github.com/Khaledr001/Employee-Management-System",
    year: "2022",
    bg: "#0a0f1a",
  },
  {
    title: "E-Wallet App",
    description:
      "Flutter mobile wallet with Firebase backend, card management, and secure digital payments.",
    tags: ["Flutter", "Dart", "Firebase"],
    image: eWallet,
    link: "https://github.com/zahid-ul-islam/Vehicle-Detection",
    year: "2022",
    bg: "#0d1218",
  },
];

const ProjectCard = ({ project, index, progress, total }) => {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(
    progress,
    [index / total, (index + 1) / total],
    [1, targetScale]
  );

  return (
    <div
      className="sticky flex justify-center"
      style={{ top: `${96 + index * 28}px`, height: "85vh" }}
    >
      <motion.div
        style={{ scale }}
        className="w-full max-w-[960px] rounded-3xl overflow-hidden border border-white/[0.07] flex flex-col md:flex-row h-full"
      >
        {/* Image */}
        <div className="relative md:w-[48%] overflow-hidden h-52 md:h-full">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
        </div>

        {/* Content */}
        <div
          className="flex-1 p-8 md:p-10 flex flex-col justify-between"
          style={{ background: project.bg }}
        >
          <div>
            <span className="text-[11px] text-white/25 uppercase tracking-[4px] font-light">
              {project.year}
            </span>
            <h3 className="text-[26px] md:text-[30px] font-bold text-white mt-2 mb-4 leading-tight">
              {project.title}
            </h3>
            <p className="text-white/45 text-[14px] leading-relaxed">
              {project.description}
            </p>
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-[11px] text-white/35 border border-white/[0.08] tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
            <LiveProjectButton href={project.link}>
              View project
            </LiveProjectButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ProjectsSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      className="px-8 md:px-16 lg:px-24 py-28 border-t border-white/[0.06]"
      id="project"
    >
      <FadeIn>
        <p className="text-white/25 text-[12px] uppercase tracking-[5px] font-light mb-5">
          My work
        </p>
        <h2
          className="font-black leading-none text-white mb-16"
          style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
        >
          Projects.
        </h2>
      </FadeIn>

      <div ref={ref}>
        {PROJECTS.map((project, i) => (
          <ProjectCard
            key={project.title}
            project={project}
            index={i}
            progress={scrollYProgress}
            total={PROJECTS.length}
          />
        ))}
        {/* bottom spacer so last card stays in view */}
        <div style={{ height: "85vh" }} />
      </div>
    </section>
  );
};

export default ProjectsSection;
