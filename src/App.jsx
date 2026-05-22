import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  About, Contact, CustomCursor, Experience, Hero,
  Navbar, Tech, Works, StarsCanvas,
} from "./components";
import TransitionOverlay from "./components/TransitionOverlay";
import { PageTransitionProvider } from "./context/PageTransition";
import ProjectPage from "./pages/ProjectPage";

const colors = {
  hero:       "#050a18",
  about:      "#060e28",
  experience: "#08102e",
  tech:       "#041a28",
  works:      "#060e20",
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

    <div id="s-experience" style={{ backgroundColor: colors.experience }}>
      <Experience />
    </div>

    <div id="s-tech" style={{ backgroundColor: colors.tech }}>
      <Tech />
    </div>

    <div id="s-works" style={{ backgroundColor: colors.works }}>
      <Works />
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

const App = () => (
  <BrowserRouter>
    <PageTransitionProvider>
      <CustomCursor />
      <TransitionOverlay />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
      </Routes>
    </PageTransitionProvider>
  </BrowserRouter>
);

export default App;
