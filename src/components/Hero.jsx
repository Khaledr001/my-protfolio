import { motion } from "framer-motion";

import { styles } from "../style";
import { personalInfo } from "../content";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

function parseHighlights(text) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1
      ? <span key={i} className="text-[var(--accent)]">{part}</span>
      : part
  );
}

const Hero = () => {
  return (
    <section className="relative w-full h-screen mx-auto overflow-hidden bg-black/[0.96]">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      <div className="absolute inset-0 flex flex-col md:flex-row">
        {/* Left content — name + subtitle */}
        <div
          className={`${styles.paddingX} flex-1 z-10 flex flex-col justify-center pt-[120px] md:pt-0`}
        >
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hi, I am{" "}
            <span className="text-[var(--accent)]">{personalInfo.name}</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100 max-w-2xl`}>
            {parseHighlights(personalInfo.heroSubtitle)}
          </p>
        </div>

        {/* Right content — interactive 3D scene */}
        <div className="flex-1 relative min-h-[40vh] md:min-h-0">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>

      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center z-10">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
              className="w-3 h-3 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
