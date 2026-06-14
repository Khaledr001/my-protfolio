import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  About, Contact, CustomCursor, Experience, Hero,
  Navbar, Tech, Works, FeaturedWork, Testimonials, StarsCanvas,
} from "./components";
import ProjectPage from "./pages/ProjectPage";
import { Component as AILoader } from "@/components/ui/ai-loader";

const colors = {
  hero:       "#050a18",
  about:      "#060e28",
  experience: "#08102e",
  tech:       "#041a28",
  featured:   "#03080f",
  works:      "#060e20",
  testimonials: "#050a1c",
  contact:    "#080a24",
};

const MainPage = () => (
  <div className="relative">
    <div
      id="s-hero"
      style={{ backgroundColor: colors.hero }}
      className="bg-hero-pattern bg-cover bg-no-repeat bg-center"
    >
      <Navbar />
      <Hero />
    </div>

    <div id="s-about" style={{ backgroundColor: colors.about }}>
      <About />
    </div>

    <div id="s-tech" style={{ backgroundColor: colors.tech }}>
      <Tech />
    </div>

    <div
      id="s-featured"
      style={{ backgroundColor: colors.featured }}
      className="overflow-hidden"
    >
      <FeaturedWork />
    </div>

    <div id="s-works" style={{ backgroundColor: colors.works }}>
      <Works />
    </div>
    
    <div id="s-experience" style={{ backgroundColor: colors.experience }}>
      <Experience />
    </div>
    
    <div
      id="s-testimonials"
      style={{ backgroundColor: colors.testimonials }}
    >
      <Testimonials />
    </div>

    <div
      id="s-contact"
      style={{ backgroundColor: colors.contact }}
      className="relative z-0"
    >
      <Contact />
      <StarsCanvas />
    </div>
  </div>
);

const App = () => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Keep the splash up until the hero's 3D scene has finished loading, so it
    // appears instantly when the loader fades. Bounded by a minimum (avoids a
    // flash when the scene is cached) and a hard cap (never hangs if it fails).
    // Non-home routes have no Spline scene, so they use a short splash.
    const isHome = window.location.pathname === "/";

    let finished = false;
    let minPassed = false;
    let sceneReady = !isHome || window.__splineLoaded === true;

    const finish = () => {
      if (finished) return;
      finished = true;
      setFadeOut(true);
      window.setTimeout(() => setLoading(false), 700);
    };
    const maybeFinish = () => {
      if (minPassed && sceneReady) finish();
    };

    const minTimer = window.setTimeout(
      () => {
        minPassed = true;
        maybeFinish();
      },
      isHome ? 1200 : 500
    );
    const maxTimer = window.setTimeout(finish, isHome ? 7000 : 1500);

    const onSceneReady = () => {
      sceneReady = true;
      maybeFinish();
    };
    window.addEventListener("spline:loaded", onSceneReady);

    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
      window.removeEventListener("spline:loaded", onSceneReady);
    };
  }, []);

  return (
    <BrowserRouter>
      {loading && (
        <div
          className={`fixed inset-0 z-[60] transition-opacity duration-700 ${
            fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <AILoader text="Loading" />
        </div>
      )}
      <CustomCursor />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
