import HeroSection    from "./sections/HeroSection";
import StorySection   from "./sections/StorySection";
import JourneySection from "./sections/JourneySection";
import SkillsSection  from "./sections/SkillsSection";
import ProjectsSection from "./sections/ProjectsSection";
import ContactSection from "./sections/ContactSection";

function App() {
  return (
    <main style={{ overflowX: "clip", backgroundColor: "#04112a" }}>
      <HeroSection />
      <StorySection />
      <JourneySection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}

export default App;
