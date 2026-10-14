import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
