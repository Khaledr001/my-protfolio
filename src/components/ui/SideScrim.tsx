import { cn } from "@/lib/utils";

/**
 * Darkens the 3D scene behind a section's text column on wide screens, so
 * copy stays readable whatever the camera is looking at. Sits behind the
 * section content (negative z inside <main>'s stacking context).
 */
export function SideScrim({ side }: { side: "left" | "right" | "full" }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-y-0 -z-10 hidden lg:block",
        side === "full"
          ? "inset-x-0 bg-ink-950/60"
          : "w-[68%] from-ink-950/90 via-ink-950/65 to-transparent",
        side === "left" && "left-0 bg-gradient-to-r",
        side === "right" && "right-0 bg-gradient-to-l",
      )}
    />
  );
}
