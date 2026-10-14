import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { Screen } from "@/data/projects";

interface LightboxProps {
  screens: Screen[];
  index: number;
  title: string;
  onIndex: (index: number) => void;
  onClose: () => void;
}

/**
 * Full-screen screenshot viewer. Escape closes it, arrow keys step through
 * screens, focus moves in on open and returns to the trigger on close.
 */
export function Lightbox({ screens, index, title, onIndex, onClose }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const screen = screens[index];
  const many = screens.length > 1;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (!many) return;
      if (event.key === "ArrowRight") onIndex((index + 1) % screens.length);
      if (event.key === "ArrowLeft") onIndex((index - 1 + screens.length) % screens.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, many, onClose, onIndex, screens.length]);

  const navButton =
    "grid h-12 w-12 place-items-center rounded-full border border-line-strong bg-surface/90 text-fg transition-colors hover:border-accent/60 hover:text-accent";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} screenshots`}
      className="fixed inset-0 z-[80] flex flex-col bg-ink-950/95 backdrop-blur-md"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="container-x flex h-16 shrink-0 items-center justify-between">
        <p className="text-[14px] text-fg-muted" aria-live="polite">
          {title} · {index + 1} / {screens.length}
        </p>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className={navButton}>
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center gap-4 px-4 pb-6" onClick={(event) => event.target === event.currentTarget && onClose()}>
        {many && (
          <button type="button" aria-label="Previous screenshot" className={`${navButton} hidden sm:grid`} onClick={() => onIndex((index - 1 + screens.length) % screens.length)}>
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <img
          src={screen.src}
          alt={`${title} — screenshot ${index + 1} of ${screens.length}`}
          className="max-h-full max-w-full rounded-lg border border-line object-contain"
        />
        {many && (
          <button type="button" aria-label="Next screenshot" className={`${navButton} hidden sm:grid`} onClick={() => onIndex((index + 1) % screens.length)}>
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {many && (
        <div className="flex shrink-0 justify-center gap-3 pb-6 sm:hidden">
          <button type="button" aria-label="Previous screenshot" className={navButton} onClick={() => onIndex((index - 1 + screens.length) % screens.length)}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Next screenshot" className={navButton} onClick={() => onIndex((index + 1) % screens.length)}>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
