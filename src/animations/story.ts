// ─────────────────────────────────────────────────────────────────────────────
// The bridge between scroll (GSAP ScrollTrigger, DOM) and the 3D scene (R3F).
//
// ScrollTriggers write raw scroll-derived targets here; the scene reads them
// every frame and eases toward them. It is a plain mutable object on purpose:
// it changes on every scroll tick and must never trigger React re-renders.
// ─────────────────────────────────────────────────────────────────────────────

export interface StoryState {
  /** Continuous scene index: 0 = hero … 5 = contact. */
  stage: number;
  /** Continuous index of the project in view (0 … featured.length - 1). */
  work: number;
  /** Pointer position in [-1, 1], from anywhere on the page. */
  pointer: { x: number; y: number };
}

export const story: StoryState = {
  stage: 0,
  work: 0,
  pointer: { x: 0, y: 0 },
};

type Listener = () => void;
const listeners = new Set<Listener>();

/** Called by scroll/pointer handlers after they mutate `story`. */
export function notifyStory() {
  listeners.forEach((listener) => listener());
}

/** Used by the canvas to request frames when it renders on demand. */
export function subscribeStory(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
