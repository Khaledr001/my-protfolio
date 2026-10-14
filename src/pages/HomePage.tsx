import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { useStoryTimeline } from "@/animations/useStoryTimeline";
import { ChapterRail } from "@/components/layout/ChapterRail";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SceneLayer } from "@/components/layout/SceneLayer";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { DEFAULT_TITLE } from "@/lib/seo";

export function HomePage() {
  const mainRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const active = useStoryTimeline(mainRef, progressRef);
  const { hash } = useLocation();

  useEffect(() => {
    document.title = DEFAULT_TITLE;
  }, []);

  // Arriving from a case study with "/#work" etc.: jump to that chapter.
  useEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() => {
      document
        .getElementById(decodeURIComponent(hash.slice(1)))
        ?.scrollIntoView({ behavior: "instant", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <>
      <SceneLayer />
      <Navbar active={active} progressRef={progressRef} />
      <ChapterRail active={active} />
      <main id="main" ref={mainRef} tabIndex={-1} className="relative z-10 outline-none">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
