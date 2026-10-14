import { cn } from "@/lib/utils";

interface SideScrimProps {
  side: "left" | "right" | "full";
  /** Width of the gradient for left/right scrims (Tailwind width class). */
  width?: string;
}

/**
 * Darkens the 3D scene behind a section's text column on wide screens, so
 * copy stays readable whatever the camera is looking at. Sits behind the
 * section content (negative z inside <main>'s stacking context).
 */
export function SideScrim({ side, width = "w-[72%]" }: SideScrimProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-y-0 -z-10 hidden lg:block",
        side === "full"
          ? "inset-x-0 bg-ink-950/70"
          : cn(width, "from-ink-950/95 via-ink-950/80 to-transparent"),
        side === "left" && "left-0 bg-gradient-to-r",
        side === "right" && "right-0 bg-gradient-to-l",
      )}
    />
  );
}
