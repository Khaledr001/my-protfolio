import type { ReactNode } from "react";

// Shared SVG building blocks for the architecture diagrams (viewBox 480×360).

export const MUTED = "#8B93A7";
export const LINE = "rgba(255,255,255,0.16)";

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  accent?: string;
  strong?: boolean;
  dashed?: boolean;
}

export function Box({ x, y, w, h, label, sub, accent = "#F2A65A", strong, dashed }: BoxProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={9}
        fill={strong ? "rgba(22,29,45,0.95)" : "rgba(15,20,32,0.92)"}
        stroke={strong ? accent : LINE}
        strokeOpacity={strong ? 0.75 : 1}
        strokeDasharray={dashed ? "4 4" : undefined}
      />
      {strong && (
        <rect x={x} y={y} width={w} height={h} rx={9} fill={accent} fillOpacity={0.07} />
      )}
      <text
        x={x + w / 2}
        y={y + h / 2 + (sub ? -3 : 4)}
        textAnchor="middle"
        fontFamily="JetBrains Mono Variable, monospace"
        fontSize={10.5}
        fill="#E9E6DF"
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 12}
          textAnchor="middle"
          fontFamily="JetBrains Mono Variable, monospace"
          fontSize={8.5}
          fill={MUTED}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

interface FlowProps {
  d: string;
  accent: string;
  slow?: boolean;
}

/** A static guide line with animated "packets" travelling along it. */
export function Flow({ d, accent, slow }: FlowProps) {
  return (
    <g fill="none">
      <path d={d} stroke={LINE} strokeWidth={1} />
      <path
        d={d}
        stroke={accent}
        strokeWidth={1.4}
        strokeLinecap="round"
        className={slow ? "flow-slow" : "flow"}
      />
    </g>
  );
}

export function Caption({ x, y, children, anchor = "start" }: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontFamily="JetBrains Mono Variable, monospace"
      fontSize={8.5}
      letterSpacing={1.2}
      fill={MUTED}
    >
      {children}
    </text>
  );
}

export function Dot({ cx, cy, r = 3, color }: { cx: number; cy: number; r?: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * 2.6} fill={color} fillOpacity={0.12} />
      <circle cx={cx} cy={cy} r={r} fill={color} />
    </g>
  );
}

export function DiagramSvg({ title, children }: { title: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" role="img" aria-label={title}>
      {children}
    </svg>
  );
}
