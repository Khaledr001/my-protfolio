import { useState, useEffect } from "react";
import { CardStack } from "@/components/ui/card-stack";
import { projects } from "../constants";

const items = projects.map((project, index) => ({
  id: index,
  title: project.name,
  description: project.description,
  imageSrc: project.image,
  href: project.source_code_link,
}));

// Card dimensions scale down on smaller viewports (the stage clips the fan).
function getDims(vw) {
  if (vw < 480) return { w: Math.max(240, vw - 70), h: 320 };
  if (vw < 768) return { w: 360, h: 260 };
  if (vw < 1024) return { w: 440, h: 290 };
  return { w: 500, h: 320 };
}

const ProjectsCarousel = () => {
  const [dims, setDims] = useState(() =>
    getDims(typeof window !== "undefined" ? window.innerWidth : 1024)
  );

  useEffect(() => {
    const update = () => setDims(getDims(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="mt-12 w-full overflow-hidden">
      <CardStack
        items={items}
        cardWidth={dims.w}
        cardHeight={dims.h}
        maxVisible={5}
        autoAdvance
        intervalMs={3200}
        pauseOnHover
        showDots
      />
    </div>
  );
};

export default ProjectsCarousel;
