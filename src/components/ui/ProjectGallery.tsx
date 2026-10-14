import { useState } from "react";

import { cn } from "@/lib/utils";

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

/** A large preview with selectable thumbnails. */
export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [index, setIndex] = useState(0);
  const current = images[index];

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-white/[0.09] bg-ink-900">
        <img
          src={current}
          alt={`${title} — screenshot ${index + 1} of ${images.length}`}
          className="block w-full object-cover"
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3" role="group" aria-label="Choose screenshot">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show screenshot ${i + 1}`}
              aria-pressed={i === index}
              className={cn(
                "h-16 w-24 overflow-hidden rounded-lg border transition-all sm:h-20 sm:w-32",
                i === index
                  ? "border-accent/80 opacity-100"
                  : "border-white/10 opacity-[0.55] hover:opacity-90",
              )}
            >
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
