import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { projects } from "../constants";
import { github } from "../assets";
import { usePageTransition } from "../context/PageTransition";

const ProjectPage = () => {
  const { slug } = useParams();
  const { trigger } = usePageTransition();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div
        style={{ backgroundColor: "#050816", minHeight: "100vh" }}
        className="flex items-center justify-center"
      >
        <p className="text-white text-2xl">Project not found.</p>
      </div>
    );
  }

  const handleBack = (e) => {
    trigger(e.clientX, e.clientY, "/", "project");
  };

  return (
    <div style={{ backgroundColor: "#050816", minHeight: "100vh" }}>
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.55, duration: 0.4 }}
        onClick={handleBack}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium cursor-pointer"
      >
        ← Back to Projects
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="relative w-full h-[55vh] overflow-hidden"
      >
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/30 to-transparent" />
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="absolute bottom-8 left-8 text-white font-black leading-tight"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          {project.name}
        </motion.h1>
      </motion.div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="text-[#aaa6c3] text-[17px] leading-[30px]"
        >
          {project.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.5 }}
          className="mt-6 flex flex-wrap gap-2"
        >
          {project.tags.map((tag) => (
            <span key={tag.name} className={`text-[14px] ${tag.color}`}>
              #{tag.name}
            </span>
          ))}
        </motion.div>

        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.5 }}
          href={project.source_code_link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-3 px-6 py-3 border border-white/20 hover:border-white/50 text-white rounded-xl transition-colors"
        >
          <img src={github} alt="GitHub" className="w-5 h-5 object-contain" />
          View Source / Live Demo
        </motion.a>
      </div>
    </div>
  );
};

export default ProjectPage;
