import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { story } from "@/animations/story";
import { frame } from "./frame";
import { getStages, sampleStages } from "./stages";

const { damp } = THREE.MathUtils;

interface SceneDirectorProps {
  reducedMotion: boolean;
}

/**
 * Eases the scene toward the scroll-derived targets in `story` and samples
 * the camera shots into `frame`. Mounted first so it runs before the other
 * useFrame callbacks each frame.
 */
export function SceneDirector({ reducedMotion }: SceneDirectorProps) {
  const width = useThree((state) => state.size.width);
  const invalidate = useThree((state) => state.invalidate);
  const stages = getStages(width >= 1024);
  const started = useRef(false);
  const powerRaw = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    frame.reduced = reducedMotion;

    // Remounting mid-page should not sweep the camera from the hero.
    if (!started.current) {
      started.current = true;
      frame.stage = story.stage;
      frame.work = story.work;
    }

    const lambda = reducedMotion ? 30 : 2.6;
    frame.stage = damp(frame.stage, story.stage, lambda, dt);
    frame.work = damp(frame.work, story.work, reducedMotion ? 30 : 4, dt);

    const px = reducedMotion ? 0 : story.pointer.x;
    const py = reducedMotion ? 0 : story.pointer.y;
    frame.pointer.x = damp(frame.pointer.x, px, 2.5, dt);
    frame.pointer.y = damp(frame.pointer.y, py, 2.5, dt);

    if (!reducedMotion) frame.time += dt;

    sampleStages(stages, frame.stage, frame);

    // Intro: the lamp flickers on, then the screens wake up.
    powerRaw.current = reducedMotion ? 1 : Math.min(1, powerRaw.current + dt / 1.8);
    const p = powerRaw.current;
    const flicker = p < 0.35 ? (Math.sin(p * 90) > 0.2 ? 0.7 : 0.15) * (p / 0.35) : 1;
    frame.power = THREE.MathUtils.smoothstep(p, 0.3, 0.75);
    frame.lamp *= flicker;

    // In on-demand mode, keep requesting frames until the scene settles.
    if (reducedMotion) {
      const unsettled =
        Math.abs(frame.stage - story.stage) > 1e-4 || Math.abs(frame.work - story.work) > 1e-4;
      if (unsettled) invalidate();
    }
  });

  return null;
}
