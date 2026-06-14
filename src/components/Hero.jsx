import { motion } from "framer-motion";
import { Download } from "lucide-react";

import { personalInfo } from "../content";
import resume from "../assets/resume/Syed_Khaled_Hossain_Resume.pdf";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { GooeyText } from "@/components/ui/gooey-text-morphing";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import SocialLinks from "./SocialLinks";

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function parseHighlights(text) {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1
      ? <span key={i} className="text-[var(--accent)]">{part}</span>
      : part
  );
}

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black/10 md:h-screen">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center gap-6 px-4 pb-12 pt-24 sm:px-8 md:h-full md:min-h-0 md:flex-row md:items-stretch md:gap-10 md:py-0 lg:px-12">
        {/* Left content — name, role, subtitle, CTAs */}
        <div className="flex w-full flex-1 flex-col justify-center text-center md:py-20 md:text-left">
          <h1 className="font-black leading-[1.1] text-white text-[clamp(2rem,4vw_+_1rem,3.75rem)]">
            Hi, I am{" "}
            <span className="text-[var(--accent)]">{personalInfo.name}</span>
          </h1>

          {/* Morphing role line */}
          <div className="mt-3 w-full h-[clamp(2rem,5vw,2.75rem)] md:mt-6">
            <GooeyText
              texts={[
                "Full-Stack Engineer",
                "Backend Architect",
                "AI Enthusiast",
                "Problem Solver",
              ]}
              morphTime={1}
              cooldownTime={0.6}
              className="md:[&>div]:justify-start"
              textClassName="font-bold text-[var(--accent)] whitespace-nowrap text-[clamp(1rem,1vw_+_0.1rem,1rem)]"
            />
          </div>

          <p
            className="mx-auto mt-3 max-w-xl leading-relaxed text-white-100 md:mx-0 md:max-w-2xl text-[clamp(0.95rem,1vw_+_0.6rem,1.2rem)]"
          >
            {parseHighlights(personalInfo.heroSubtitle)}
          </p>

          {/* Call-to-action buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-8 sm:gap-4 md:justify-start">
            <LiquidButton
              size="xl"
              onClick={() => scrollToSection("s-works")}
              className="text-white"
            >
              View My Work
            </LiquidButton>
            <LiquidButton
              size="xl"
              onClick={() => scrollToSection("s-contact")}
              className="text-white"
            >
              Get in Touch
            </LiquidButton>
            <LiquidButton
              href={resume}
              download="Syed_Khaled_Hossain_Resume.pdf"
              size="xl"
              variant="outline"
              className="gap-2 text-white"
            >
              <Download className="h-4 w-4" />
              Download CV
            </LiquidButton>
          </div>

          {/* Social links */}
          <SocialLinks
            className="mt-6 justify-center md:justify-start"
            itemClassName="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            iconClassName="h-[18px] w-[18px]"
            includeEmail={false}
          />
        </div>

        {/* Right content — interactive 3D scene */}
        <div className="relative h-[300px] w-full flex-1 self-stretch sm:h-[400px] md:h-full md:min-h-0">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-full w-full"
          />
        </div>
      </div>

      {/* Scroll cue — hidden on mobile where it would overlap stacked content */}
      <button
        type="button"
        onClick={() => scrollToSection("s-about")}
        aria-label="Scroll to About section"
        className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 md:block"
      >
        <div className="flex h-[64px] w-[35px] items-start justify-center rounded-3xl border-4 border-secondary p-2">
          <motion.div
            animate={{ y: [0, 24, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
            className="mb-1 h-3 w-3 rounded-full bg-secondary"
          />
        </div>
      </button>
    </section>
  );
};

export default Hero;
