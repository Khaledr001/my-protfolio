import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the custom type scale (tailwind.config.js → fontSize),
// otherwise `text-small` would be mistaken for a colour and clash with `text-fg`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["caption", "small", "ui", "body-sm", "body", "lead", "title"] }],
    },
  },
});

/** Merge class names with Tailwind-aware conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Splits "**bold** text" into alternating plain / emphasised segments. */
export function splitEmphasis(text: string) {
  return text
    .split(/\*\*(.*?)\*\*/g)
    .map((part, i) => ({ text: part, strong: i % 2 === 1 }));
}
