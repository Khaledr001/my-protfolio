import { useState, useEffect } from "react";
import { CardStack } from "@/components/ui/card-stack";

// Card dimensions scale with viewport; the stage clips the fanned overflow.
function getDims(vw) {
  if (vw < 480) {
    const w = Math.max(220, vw - 80);
    return { w, h: Math.round(w * 0.66) };
  }
  if (vw < 768) return { w: 360, h: 240 };
  if (vw < 1024) return { w: 460, h: 300 };
  return { w: 560, h: 360 };
}

/**
 * Fanned 3D carousel of a single project's screenshots.
 * Reuses the CardStack component with image-only cards.
 */
const ProjectGallery = ({ images, title }) => {
  const [dims, setDims] = useState(() =>
    getDims(typeof window !== "undefined" ? window.innerWidth : 1024)
  );

  useEffect(() => {
    const update = () => setDims(getDims(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const items = images.map((src, i) => ({ id: i, title, imageSrc: src }));

  return (
    <div className="w-full overflow-hidden">
      <CardStack
        items={items}
        cardWidth={dims.w}
        cardHeight={dims.h}
        maxVisible={5}
        loop
        showDots
        renderCard={(item) => (
          <div className="flex h-full w-full items-center justify-center bg-neutral-950">
            <img
              src={item.imageSrc}
              alt={item.title}
              className="pointer-events-none max-h-full max-w-full object-contain"
              draggable={false}
            />
          </div>
        )}
      />
    </div>
  );
};

export default ProjectGallery;
