import { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";

import { notifyStory, story, subscribeStory } from "@/animations/story";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { detectQuality } from "./capabilities";
import { CameraRig } from "./CameraRig";
import { ParticleField } from "./ParticleField";
import { SceneDirector } from "./SceneDirector";
import { SceneLighting } from "./SceneLighting";
import { Workspace } from "./workspace/Workspace";

const BACKGROUND = "#0B0F17";

/** With frameloop="demand", render whenever the scroll story changes. */
function InvalidateOnStory() {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => subscribeStory(() => invalidate()), [invalidate]);
  return null;
}

/** Tracks the pointer anywhere on the page (the canvas itself ignores events). */
function usePointerTracking(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      story.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      story.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
      notifyStory();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);
}

interface PortfolioCanvasProps {
  onReady?: () => void;
}

/**
 * The one persistent WebGL canvas behind the whole home page: a late-night
 * developer desk that the camera explores as the story scrolls. Purely
 * decorative — aria-hidden, no pointer events, and the page works without it.
 */
export default function PortfolioCanvas({ onReady }: PortfolioCanvasProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [quality] = useState(detectQuality);
  const low = quality === "low";
  const shadows = !low;
  const [maxDpr, setMaxDpr] = useState(low ? 1.25 : 1.75);

  usePointerTracking(!reducedMotion);

  return (
    <Canvas
      frameloop={reducedMotion ? "demand" : "always"}
      dpr={[1, maxDpr]}
      shadows={shadows ? "soft" : false}
      camera={{ fov: 34, position: [3, 1.8, 4.4], near: 0.05, far: 40 }}
      gl={{
        antialias: !low,
        alpha: false,
        stencil: false,
        powerPreference: "high-performance",
      }}
      onCreated={() => onReady?.()}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={[BACKGROUND]} />
      <fog attach="fog" args={[BACKGROUND, 7, 16]} />
      <PerformanceMonitor onDecline={() => setMaxDpr(1)} />

      <SceneDirector reducedMotion={reducedMotion} />
      <CameraRig parallax={reducedMotion ? 0 : low ? 0.06 : 0.16} />
      <SceneLighting />

      <Workspace quality={quality} shadows={shadows} />
      <ParticleField count={low ? 120 : 320} />

      {reducedMotion && <InvalidateOnStory />}
    </Canvas>
  );
}
