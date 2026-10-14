import type { ReactNode } from "react";

import type { Screen } from "@/data/projects";
import { cn } from "@/lib/utils";

interface BrowserFrameProps {
  /** Shown in the address bar, e.g. "isp.devsfleet.com". */
  address?: string;
  children: ReactNode;
  className?: string;
}

/** A minimal browser window around a desktop screenshot. */
export function BrowserFrame({ address, children, className }: BrowserFrameProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-line-strong bg-surface shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]", className)}>
      <div className="flex items-center gap-3 border-b border-line bg-surface-raised px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#F0817A]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-cool/80" />
        </div>
        {address && (
          <div className="mx-auto max-w-[60%] truncate rounded-md border border-line bg-ink-950/70 px-3 py-1 text-center text-[12px] text-fg-subtle">
            {address}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

/** A phone outline around a mobile screenshot. */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative rounded-[2rem] border border-line-strong bg-surface-raised p-2 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      <span aria-hidden="true" className="absolute left-1/2 top-3.5 z-10 h-1.5 w-14 -translate-x-1/2 rounded-full bg-ink-950" />
      <div className="overflow-hidden rounded-[1.6rem]">{children}</div>
    </div>
  );
}

/** The screenshot image itself, sized from its real dimensions (no layout shift). */
export function ScreenImage({ screen, alt, eager }: { screen: Screen; alt: string; eager?: boolean }) {
  return (
    <img
      src={screen.src}
      alt={alt}
      width={screen.width}
      height={screen.height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className="block h-auto w-full"
    />
  );
}
