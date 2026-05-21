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
    <section
      className="relative h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 100% 100% at 65% 50%, #0f2060 0%, #081540 35%, #050e2e 65%, #04112a 100%)",
      }}
    >
      {/* ── 3D canvas: full bleed background ── */}
      <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
        <Suspense fallback={null}>
          <Avatar3D />
        </Suspense>
      </div>

      {/* ── Left gradient: keeps text readable ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, #04112a 22%, rgba(4,17,42,0.7) 52%, transparent 100%)",
        }}
      />

      {/* ── Bottom gradient: bleeds into next section ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #04112a)",
        }}
      />

      {/* ── Text content ── */}
      <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16 lg:px-24 py-16 max-w-3xl">
        {/* Available badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/30 backdrop-blur-sm mb-10 w-fit">
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
    </section>
  );
};

export default HeroSection;
