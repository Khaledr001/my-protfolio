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
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ol className="flex flex-col items-end gap-3.5">
        {chapters.map((chapter, i) => {
          const isActive = active === i;
          return (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                aria-current={isActive ? "step" : undefined}
                className="group flex items-center gap-3 py-0.5"
              >
                <span
                  className={cn(
                    "text-[11.5px] font-semibold uppercase tracking-[0.12em] transition-all duration-500",
                    // The active name only shows where there is room beside the content.
                    isActive ? "text-fg 2xl:translate-x-0 2xl:opacity-100" : "text-fg-subtle",
                    "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
                  )}
                >
                  {chapter.name}
                </span>
                <span className="meta text-[12px]">{chapter.number}</span>
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
