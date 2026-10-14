import { cn } from "@/lib/utils";

interface StaticBackdropProps {
  className?: string;
}

/**
 * A flat illustration of the 3D desk: shown while WebGL loads, when WebGL is
 * unavailable, if the scene crashes, and on case-study pages.
 */
export function StaticBackdrop({ className }: StaticBackdropProps) {
  return (
    <div aria-hidden="true" className={cn("absolute inset-0 overflow-hidden bg-ink-950", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(45%_40%_at_70%_55%,rgba(242,166,90,0.16),transparent_70%),radial-gradient(35%_30%_at_82%_35%,rgba(79,209,197,0.10),transparent_70%)]" />
      <svg
        className="absolute left-1/2 top-[14%] w-[min(92vw,720px)] -translate-x-1/2 opacity-80 lg:left-[72%] lg:top-1/2 lg:-translate-y-1/2"
        viewBox="0 0 480 300"
        fill="none"
      >
        {/* Lamp light pool */}
        <ellipse cx="150" cy="232" rx="120" ry="26" fill="#F2A65A" fillOpacity="0.12" />
        {/* Monitor */}
        <rect x="150" y="56" width="200" height="118" rx="8" fill="#0F1420" stroke="#E9E6DF" strokeOpacity="0.18" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect
            key={i}
            x={166 + (i % 3) * 12}
            y={74 + i * 13}
            width={[90, 120, 70, 110, 60, 130, 80][i]}
            height="4"
            rx="2"
            fill={["#F2A65A", "#4FD1C5", "#8AB4F8", "#E9E6DF"][i % 4]}
            fillOpacity="0.55"
          />
        ))}
        <rect x="244" y="174" width="12" height="40" fill="#E9E6DF" fillOpacity="0.14" />
        <rect x="214" y="212" width="72" height="6" rx="3" fill="#E9E6DF" fillOpacity="0.14" />
        {/* Desk */}
        <rect x="20" y="220" width="440" height="8" rx="3" fill="#4A3324" />
        {/* Keyboard */}
        <rect x="190" y="212" width="110" height="8" rx="3" fill="#232A3A" />
        {/* Mug and steam */}
        <rect x="96" y="186" width="30" height="34" rx="5" fill="#E4DDD0" fillOpacity="0.85" />
        <path d="M126 196 q12 2 0 16" stroke="#E4DDD0" strokeOpacity="0.85" strokeWidth="4" />
        <path d="M104 178 q-8 -14 2 -26 q8 -10 -2 -22" stroke="#E9E6DF" strokeOpacity="0.25" strokeWidth="3" strokeLinecap="round" />
        <path d="M118 176 q8 -12 -2 -24" stroke="#E9E6DF" strokeOpacity="0.18" strokeWidth="3" strokeLinecap="round" />
        {/* Lamp */}
        <path d="M44 218 L60 120 L118 98" stroke="#2A2F3A" strokeWidth="5" strokeLinecap="round" />
        <path d="M108 86 L142 108 L118 124 Z" fill="#2A2F3A" />
        <path d="M130 116 L178 220 L70 220 Z" fill="#F2A65A" fillOpacity="0.06" />
        <circle cx="131" cy="116" r="5" fill="#FFE6C2" />
        {/* Laptop */}
        <path d="M330 220 L350 160 L424 160 L404 220 Z" fill="#0F1420" stroke="#E9E6DF" strokeOpacity="0.16" />
        <rect x="350" y="174" width="44" height="4" rx="2" fill="#8BE0B0" fillOpacity="0.5" />
        <rect x="346" y="186" width="54" height="4" rx="2" fill="#F0817A" fillOpacity="0.45" />
        <rect x="342" y="198" width="40" height="4" rx="2" fill="#8BE0B0" fillOpacity="0.5" />
      </svg>
    </div>
  );
}
