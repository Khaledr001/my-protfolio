import { lazy, Suspense } from "react";
import ContactButton from "../components/ui/ContactButton";
import LiveProjectButton from "../components/ui/LiveProjectButton";
import Magnet from "../components/ui/Magnet";

const Avatar3D = lazy(() => import("../components/ui/Avatar3D"));

const STATS = [
  { value: "5+", label: "Years Experience" },
  { value: "10+", label: "Projects Delivered" },
  { value: "3+", label: "Companies" },
];

const HeroSection = () => {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-screen flex items-center px-8 md:px-16 lg:px-24 py-24 overflow-hidden">
      {/* Left content */}
      <div className="flex-1 z-10 max-w-2xl">
        {/* Available badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-10">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[13px] text-white/60 font-light tracking-wide">
            Available for work
          </span>
        </div>

        {/* Heading */}
        <h1
          className="hero-heading font-black leading-[0.92] mb-10"
          style={{ fontSize: "clamp(56px, 8.5vw, 120px)" }}
        >
          Khaled.
          <br />
          Full-Stack
          <br />
          Developer.
        </h1>

        {/* CTA buttons */}
        <div className="flex items-center gap-6 mb-14">
          <Magnet>
            <ContactButton onClick={() => scrollTo("contact")}>
              Get in touch
            </ContactButton>
          </Magnet>
          <LiveProjectButton href="#project">See my work</LiveProjectButton>
        </div>

        {/* Stats */}
        <div className="flex gap-10">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="text-[38px] font-bold text-white leading-none">{value}</p>
              <p className="text-[12px] text-white/35 font-light mt-1 tracking-wide">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3D Avatar — right side */}
      <div
        className="hidden lg:block absolute right-0 top-0 h-full"
        style={{ width: "50%", pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <Avatar3D />
        </Suspense>
      </div>
    </section>
  );
};

export default HeroSection;
