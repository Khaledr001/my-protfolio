import type { ReactNode } from "react";

import { chapters, type ChapterId } from "@/data/chapters";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  chapter: ChapterId;
  /** Each entry renders as one masked, separately revealed line. */
  lines: ReactNode[];
  id?: string;
  intro?: ReactNode;
  className?: string;
}

/** Chapter marker + oversized headline used at the top of every section. */
export function SectionHeader({ chapter, lines, id, intro, className }: SectionHeaderProps) {
  const meta = chapters.find((c) => c.id === chapter);
  return (
    <header className={cn("max-w-4xl", className)}>
      <p className="eyebrow flex items-center gap-3" data-reveal>
        <span className="text-accent">{meta?.number}</span>
        <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
        <span>{meta?.name}</span>
      </p>
      <h2
        id={id}
        className="display mt-6 text-[clamp(2.25rem,4.9vw,4.4rem)]"
        data-reveal-lines
      >
        {lines.map((line, i) => (
          <span key={i} className="line-mask">
            <span>{line}</span>
          </span>
        ))}
      </h2>
      {intro && (
        <p
          className="mt-7 max-w-2xl text-body text-fg-muted sm:text-lead"
          data-reveal
        >
          {intro}
        </p>
      )}
    </header>
  );
}
