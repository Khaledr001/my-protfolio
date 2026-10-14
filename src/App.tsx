import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";

import { HomePage } from "@/pages/HomePage";
import { ProjectPage } from "@/pages/ProjectPage";

/** Remount per slug so each case study gets fresh scroll animations. */
function ProjectRoute() {
  const { slug } = useParams();
  return <ProjectPage key={slug} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:slug" element={<ProjectRoute />} />
        <Route path="*" element={<ProjectPage />} />
      </Routes>
    </BrowserRouter>
  );
}
