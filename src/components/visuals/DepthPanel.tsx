import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DepthPanelProps {
  accent: string;
  label: string;
  children: ReactNode;
  className?: string;
}

const canTilt = () =>
  window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches;

/**
 * A framed visual with real depth: the background grid, glow and diagram sit
 * on separate planes and the panel tilts toward the pointer. Tilt is written
 * to CSS variables directly, so moving the pointer never re-renders React.
 */
export function DepthPanel({ accent, label, children, className }: DepthPanelProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !canTilt()) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--ry", `${(x * 9).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-y * 7).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
  };

  return (
    <figure className={cn("[perspective:1200px]", className)}>
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ "--accent": accent } as CSSProperties}
        className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-line bg-ink-900 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] transition-transform duration-500 ease-out [transform-style:preserve-3d] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]"
      >
        {/* Plane 0: blueprint grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(80%_80%_at_50%_50%,black,transparent)]"
        />
        {/* Plane 1: accent glow that follows the pointer */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-70 [background:radial-gradient(55%_55%_at_var(--gx,30%)_var(--gy,30%),color-mix(in_srgb,var(--accent)_26%,transparent),transparent_70%)]"
        />
        {/* Plane 2: the diagram, lifted toward the viewer */}
        <div className="absolute inset-0 [transform:translateZ(40px)]" data-depth-layer>
          {children}
        </div>
        <span className="absolute left-4 top-4 hidden text-[11.5px] font-semibold uppercase tracking-[0.12em] text-fg-subtle sm:block">
          {label}
        </span>
      </div>
    </figure>
  );
}
