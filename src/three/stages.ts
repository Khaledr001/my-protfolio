import * as THREE from "three";

import { SPOT } from "./workspace/layout";

export type Vec3 = [number, number, number];

/**
 * One camera "shot" of the desk per chapter of the story. The director
 * interpolates between neighbouring shots using `story.stage`.
 */
export interface StageState {
  cameraPosition: Vec3;
  cameraTarget: Vec3;
  /**
   * Lens shift in fractions of half the viewport: +x moves the subject right,
   * +y moves it up. Lets the desk sit beside or above the text without
   * aiming the camera off-subject.
   */
  viewShift: [number, number];
  /** Desk lamp brightness, 0 → 1+. */
  lamp: number;
  /** Monitor / laptop brightness. */
  screen: number;
  /** Floating UI cards. */
  panels: number;
  particles: number;
}

/** Mutable, per-frame interpolated scene state (read by every 3D component). */
export interface FrameState {
  stage: number;
  work: number;
  time: number;
  /** Intro "power on" progress, 0 → 1. */
  power: number;
  /** Where the coffee mug is (desk or the avatar's hand), world space. */
  mugPosition: THREE.Vector3;
  mugQuaternion: THREE.Quaternion;
  reduced: boolean;
  pointer: THREE.Vector2;
  cameraPosition: THREE.Vector3;
  cameraTarget: THREE.Vector3;
  viewShift: THREE.Vector2;
  lamp: number;
  screen: number;
  panels: number;
  particles: number;
}

export const createFrameState = (): FrameState => ({
  stage: 0,
  work: 0,
  time: 0,
  power: 0,
  mugPosition: new THREE.Vector3(...SPOT.mug),
  mugQuaternion: new THREE.Quaternion(),
  reduced: false,
  pointer: new THREE.Vector2(),
  cameraPosition: new THREE.Vector3(3, 1.8, 4.4),
  cameraTarget: new THREE.Vector3(),
  viewShift: new THREE.Vector2(),
  lamp: 1,
  screen: 1,
  panels: 1,
  particles: 1,
});

// ── Shots ───────────────────────────────────────────────────────────────────
// Wide layouts put text on one side and the desk on the other; narrow layouts
// stack them, so the desk is lifted into the top of the frame.

const screen = SPOT.monitorScreen;
const avatar = SPOT.avatar;

const wideStages: StageState[] = [
  // 01 · The signal — the whole desk, lamp on, code being written.
  {
    cameraPosition: [3.05, 1.85, 4.3],
    cameraTarget: [-0.05, 0.42, -0.15],
    viewShift: [0.38, 0.02],
    lamp: 1,
    screen: 1,
    panels: 1,
    particles: 1,
  },
  // 02 · The engineer — profile of the avatar drinking coffee.
  {
    cameraPosition: [-3.1, 0.9, 0.15],
    cameraTarget: [avatar[0] - 0.25, 0.48, avatar[2] - 0.15],
    viewShift: [-0.46, 0.02],
    lamp: 1.1,
    screen: 0.9,
    panels: 0.35,
    particles: 1,
  },
  // 03 · The systems — the monitor, showing each project's code.
  {
    cameraPosition: [1.6, 1.25, 2.65],
    cameraTarget: [screen[0] + 0.05, screen[1] - 0.06, screen[2]],
    viewShift: [0.36, 0],
    lamp: 0.45,
    screen: 1.1,
    panels: 0.2,
    particles: 0.7,
  },
  // 04 · The architecture — from above: the desk as a layout diagram.
  {
    cameraPosition: [0.3, 5.2, 1.7],
    cameraTarget: [0, 0, 0.2],
    viewShift: [0.44, 0],
    lamp: 0.95,
    screen: 1,
    panels: 0,
    particles: 0.5,
  },
  // 05 · The journey — over the shoulder onto the code review.
  {
    // Over the avatar's shoulder, onto the review on the laptop.
    cameraPosition: [2.45, 1.0, 2.25],
    cameraTarget: [0.3, 0.38, 0.5],
    viewShift: [0.34, 0],
    lamp: 0.9,
    screen: 1.05,
    panels: 0,
    particles: 0.8,
  },
  // 06 · The invitation — pulled back, calm, end of the day.
  {
    cameraPosition: [3.4, 1.5, 4.7],
    cameraTarget: [-0.2, 0.48, -0.25],
    viewShift: [0.36, 0],
    lamp: 1.15,
    screen: 0.6,
    panels: 0.4,
    particles: 1,
  },
];

const narrowStages: StageState[] = [
  { ...wideStages[0], cameraPosition: [2.7, 2.3, 6.6], cameraTarget: [0, 0.42, -0.1], viewShift: [0, 0.3] },
  { ...wideStages[1], cameraPosition: [-2.6, 0.95, 0.6], viewShift: [0, 0.28] },
  { ...wideStages[2], cameraPosition: [0.45, 1.1, 2.6], viewShift: [0, 0.22] },
  { ...wideStages[3], cameraPosition: [0.2, 6.9, 2.0], viewShift: [0, 0.24] },
  { ...wideStages[4], cameraPosition: [2.6, 1.3, 3.2], viewShift: [0, 0.26] },
  { ...wideStages[5], cameraPosition: [2.9, 2.2, 6.8], cameraTarget: [0, 0.42, -0.2], viewShift: [0, 0.3] },
];

export const getStages = (wide: boolean) => (wide ? wideStages : narrowStages);

// ── Interpolation ───────────────────────────────────────────────────────────

const smooth = (t: number) => t * t * (3 - 2 * t);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const setMix = (target: THREE.Vector3, a: Vec3, b: Vec3, t: number) =>
  target.set(mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t));

/** Writes the interpolated state for continuous stage `s` into `out`. */
export function sampleStages(stages: StageState[], s: number, out: FrameState) {
  const last = stages.length - 1;
  const clamped = THREE.MathUtils.clamp(s, 0, last);
  const i0 = Math.floor(clamped);
  const i1 = Math.min(i0 + 1, last);
  const t = smooth(clamped - i0);
  const a = stages[i0];
  const b = stages[i1];

  setMix(out.cameraPosition, a.cameraPosition, b.cameraPosition, t);
  setMix(out.cameraTarget, a.cameraTarget, b.cameraTarget, t);
  out.viewShift.set(mix(a.viewShift[0], b.viewShift[0], t), mix(a.viewShift[1], b.viewShift[1], t));
  out.lamp = mix(a.lamp, b.lamp, t);
  out.screen = mix(a.screen, b.screen, t);
  out.panels = mix(a.panels, b.panels, t);
  out.particles = mix(a.particles, b.particles, t);
}

/** 1 at stage `index`, fading linearly to 0 one stage away. */
export const stageWeight = (s: number, index: number) =>
  Math.max(0, 1 - Math.abs(s - index));
