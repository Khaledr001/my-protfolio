import { chapters } from "@/data/chapters";
import { cn } from "@/lib/utils";

interface ChapterRailProps {
  active: number;
}

/** Desktop-only scene index on the right edge; each entry jumps to its chapter. */
export function ChapterRail({ active }: ChapterRailProps) {
  return (
    <nav
      aria-label="Chapters"
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 rounded-2xl border border-line/60 bg-ink-950/75 px-3 py-3 backdrop-blur-md xl:block"
    >
      <ol className="flex flex-col items-end gap-3.5">
        {chapters.map((chapter, i) => {
          const isActive = active === i;
          return (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                aria-current={isActive ? "step" : undefined}
                className="group relative flex items-center gap-3 py-0.5"
              >
                {/* Name as a tooltip to the left: out of the layout, so the
                    panel stays as narrow as the numbers. */}
                <span
                  className={cn(
                    "pointer-events-none absolute right-full mr-4 whitespace-nowrap rounded-lg border border-line/60 bg-ink-950/90 px-2.5 py-1 text-caption font-semibold uppercase tracking-[0.12em] transition-all duration-300",
                    isActive ? "text-fg" : "text-fg-muted",
                    "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
                  )}
                >
                  {chapter.name}
                </span>
                <span className="meta text-caption">{chapter.number}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px transition-all duration-500",
                    isActive ? "w-8 bg-accent" : "w-4 bg-white/25 group-hover:w-6",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
