import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

import { frame } from "./frame";
import { SPOT } from "./workspace/layout";

/**
 * Night-time room lighting: a cool moonlit fill from the window, the teal
 * glow of the monitor, and a soft procedural environment (rendered once, no
 * HDR download) for reflections. The warm key light lives in <DeskLamp/>.
 */
export function SceneLighting() {
  const screenGlow = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (screenGlow.current) screenGlow.current.intensity = 2.4 * frame.screen * frame.power;
  });

  return (
    <>
      <ambientLight intensity={0.22} color="#5b6b8f" />
      <directionalLight position={[2.5, 3, -3]} intensity={0.55} color="#86a8de" />
      <pointLight
        ref={screenGlow}
        position={[SPOT.monitorScreen[0], SPOT.monitorScreen[1] - 0.1, SPOT.monitorScreen[2] + 0.45]}
        color="#7fd6e3"
        distance={2.6}
        decay={2}
      />

      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={1.2} color="#ffb067" position={[-4, 2, 1]} scale={[3, 4, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.8} color="#7fb4e6" position={[3, 2, -3]} scale={[4, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.5} color="#ffffff" position={[0, 5, 0]} scale={[6, 1, 1]} target={[0, 0, 0]} />
      </Environment>
    </>
  );
}
