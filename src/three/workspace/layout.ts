// Where everything sits on the desk. The desk top is the y = 0 plane, centred
// on the origin; units are roughly metres. Camera shots in ../stages.ts aim at
// these points.

export type V3 = [number, number, number];

export const DESK = { width: 3.2, depth: 1.4, thickness: 0.07 } as const;

export const SPOT = {
  monitor: [-0.15, 0, -0.42] as V3,
  monitorScreen: [-0.15, 0.8, -0.47] as V3,
  laptop: [0.98, 0, 0.02] as V3,
  laptopScreen: [0.92, 0.26, -0.14] as V3,
  keyboard: [-0.15, 0, 0.3] as V3,
  mouse: [0.5, 0, 0.32] as V3,
  mug: [-1.1, 0, 0.3] as V3,
  lamp: [-1.42, 0, -0.5] as V3,
  lampTarget: [-0.7, 0, 0.12] as V3,
  plant: [1.4, 0, -0.48] as V3,
  notebook: [-0.72, 0, -0.1] as V3,
  wallZ: -1.6,
  floorY: -1.05,
} as const;
