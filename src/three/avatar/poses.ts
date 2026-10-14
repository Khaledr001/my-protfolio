import * as THREE from "three";

import { SPOT, type V3 } from "../workspace/layout";
import { BODY, blendPose, createPose, headCentre, shoulder, type HandPose, type Pose } from "./rig";

/** Everything a gesture needs to know this frame. */
export interface PoseContext {
  time: number;
  /** World point → body space (accounts for the chair's current swivel). */
  local: (world: V3) => THREE.Vector3;
  /** The camera, in body space. */
  camera: THREE.Vector3;
  /** Chair swivel that would face the camera. */
  yawToCamera: number;
}

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const smooth = THREE.MathUtils.smoothstep;

function setHand(
  hand: HandPose,
  target: THREE.Vector3,
  fingers: THREE.Vector3,
  palm: THREE.Vector3,
  pole: THREE.Vector3,
  curl: number,
  index = curl,
  thumb = 0.25,
) {
  hand.target.copy(target);
  hand.fingers.copy(fingers).normalize();
  hand.palm.copy(palm).normalize();
  hand.pole.copy(pole).normalize();
  hand.curl = curl;
  hand.index = index;
  hand.thumb = thumb;
}

const monitorPoint: V3 = [SPOT.monitorScreen[0] + 0.1, SPOT.monitorScreen[1] - 0.05, SPOT.monitorScreen[2]];

/** Mug grip on the desk: beside the handle, which faces the avatar (+x). */
export const mugGripWorld: V3 = [SPOT.mug[0] + 0.2, 0.17, SPOT.mug[2]];

// ── Gestures ────────────────────────────────────────────────────────────────

/** Hands on the home row, fingers tapping. */
function typing(ctx: PoseContext, out: Pose, tapping = true) {
  out.yaw = 0;
  out.lean = 0.2;
  out.twist = 0;
  out.tilt = 0;
  out.recline = 0;
  out.look.copy(ctx.local(monitorPoint));
  out.smile = 0.25;
  ([-1, 1] as const).forEach((side) => {
    const hand = side === -1 ? out.left : out.right;
    const t = ctx.time * 13 + (side === 1 ? 1.3 : 0);
    const bob = tapping ? Math.max(0, Math.sin(t)) * 0.012 : 0;
    const target = ctx.local([SPOT.keyboard[0] + side * 0.17, 0.085 + bob, SPOT.keyboard[2] - 0.02]);
    const tap = tapping ? 0.15 * Math.max(0, Math.sin(t * 1.4)) : 0;
    setHand(hand, target, v(side * -0.1, -0.35, -1), v(0, -1, 0.15), v(side * 0.8, -1, 0.5), 0.38 + tap, 0.3 + tap, 0.2);
  });
}

/** Turns toward the viewer and waves. */
function wave(ctx: PoseContext, out: Pose, turn: number) {
  typing(ctx, out, false);
  out.yaw = ctx.yawToCamera * turn;
  out.lean = 0.08;
  out.look.copy(ctx.camera);
  out.smile = 1;
  const swing = Math.sin(ctx.time * 9) * 0.5;
  setHand(out.right, v(0.27, 1.3, -0.08), v(swing * 0.8, 1, -0.1), v(0, 0.05, -1), v(1, -0.4, 0.4), 0.04, 0.04, 0.1);
}

/** 01 · Typing, with a wave every few seconds. */
export function heroPose(ctx: PoseContext, out: Pose, scratch: Pose) {
  typing(ctx, out);
  const cycle = ctx.time % 11;
  const amount = smooth(cycle, 1.4, 2.0) * (1 - smooth(cycle, 4.4, 5.0));
  if (amount > 0) {
    wave(ctx, scratch, 0.5);
    blendPose(out, out, scratch, amount);
  }
}

/** How far the coffee is lifted toward the mouth (0 on the desk, 1 drinking). */
export function sipAmount(time: number) {
  const cycle = time % 7;
  return smooth(cycle, 1.2, 2.2) * (1 - smooth(cycle, 3.8, 4.8));
}

/** 02 · Picks up the coffee and drinks; right hand on the mouse. */
export function coffeePose(ctx: PoseContext, out: Pose) {
  typing(ctx, out, false);
  const sip = sipAmount(ctx.time);
  out.lean = 0.12 - sip * 0.1;
  out.tilt = 0;
  out.smile = 0.6 - sip * 0.5;

  const desk = ctx.local(mugGripWorld);
  const head = headCentre(out.lean, 0, 0);
  const mouth = head.clone().add(v(-0.13, -0.08, -0.16));
  const target = desk.lerp(mouth, sip);
  // Fingers wrap the handle; palm faces the mug.
  setHand(out.left, target, v(0.15, 0.1, -1), v(-1, 0, 0.1), v(-0.9, -1, 0.3), 0.75, 0.7, 0.6);

  const look = ctx.local(monitorPoint).lerp(head.clone().add(v(-0.2, -0.05, -0.6)), sip);
  out.look.copy(look);

  setHand(out.right, ctx.local([SPOT.mouse[0] - 0.02, 0.07, SPOT.mouse[2] + 0.03]), v(0, -0.3, -1), v(0, -1, 0), v(1, -1, 0.4), 0.45, 0.4, 0.3);
}

/** 03 · Points at the code on the monitor. */
export function pointPose(ctx: PoseContext, out: Pose) {
  typing(ctx, out, false);
  out.lean = 0.14;
  out.twist = 0.05;
  out.smile = 0.5;
  const screen = ctx.local(monitorPoint);
  out.look.copy(screen);
  const s = shoulder(1, out.lean, out.twist, 0);
  const dir = screen.clone().sub(s).normalize();
  const reach = 0.45 + Math.sin(ctx.time * 2.2) * 0.015;
  const palm = v(0, -1, 0).addScaledVector(dir, dir.y);
  setHand(out.right, s.clone().addScaledVector(dir, reach), dir, palm, v(1, -1, 0.3), 1, 0, 0.7);
}

/** 04 · Leans back, hands behind the head, thinking. */
export function thinkPose(ctx: PoseContext, out: Pose) {
  typing(ctx, out, false);
  out.yaw = 0.18 + Math.sin(ctx.time * 0.5) * 0.06;
  out.lean = -0.22;
  out.recline = 0.2;
  out.smile = 0.35;
  out.look.set(0.1, BODY.pelvis.y + 1.6, -1.6);
  const head = headCentre(out.lean, 0, 0);
  ([-1, 1] as const).forEach((side) => {
    const hand = side === -1 ? out.left : out.right;
    const target = head.clone().add(v(side * 0.1, 0.02, 0.12));
    setHand(hand, target, v(-side, 0.25, 0), v(0, 0, -1), v(side, 0.5, -0.6), 0.3, 0.3, 0.2);
  });
}

/** 05 · Chin on hand, reviewing the code on the laptop. */
export function reviewPose(ctx: PoseContext, out: Pose) {
  typing(ctx, out, false);
  out.lean = 0.3;
  out.twist = -0.38;
  out.tilt = 0.04;
  out.smile = 0.15;
  out.look.copy(ctx.local(SPOT.laptopScreen));
  const head = headCentre(out.lean, out.twist, out.tilt);
  const chin = head.clone().add(v(0.02, -0.14, -0.08));
  const nod = Math.sin(ctx.time * 1.3) * 0.006;
  setHand(out.right, chin.add(v(0.01, -0.06 + nod, 0)), v(0, 1, -0.15), v(0, 0.2, 1), v(0.3, -1, -0.7), 0.85, 0.8, 0.7);
  setHand(out.left, ctx.local([SPOT.keyboard[0] + 0.05, 0.08, SPOT.keyboard[2] + 0.1]), v(0.3, -0.3, -1), v(0, -1, 0), v(-0.8, -1, 0.5), 0.5, 0.45, 0.3);
}

/** 06 · Swivels to the viewer with an open palm: "let's talk". */
export function invitePose(ctx: PoseContext, out: Pose) {
  typing(ctx, out, false);
  out.yaw = ctx.yawToCamera;
  out.lean = 0.06;
  out.twist = 0;
  out.recline = 0.05;
  out.smile = 1;
  out.look.copy(ctx.camera);
  const sway = Math.sin(ctx.time * 1.8) * 0.015;
  setHand(out.right, v(0.2, 1.0 + sway, -0.36), v(0.15, 0.85, -0.45), v(0, 0.1, -1), v(1, -0.6, 0.4), 0.05, 0.05, 0.15);
  setHand(out.left, v(-0.13, 0.64, -0.3), v(0, -0.3, -1), v(0, -1, 0), v(-0.8, -1, 0.3), 0.45, 0.45, 0.3);
}

/** One gesture per chapter of the story, in order. */
export const chapterPoses: ((ctx: PoseContext, out: Pose, scratch: Pose) => void)[] = [
  heroPose,
  coffeePose,
  pointPose,
  thinkPose,
  reviewPose,
  invitePose,
];

export { createPose };
