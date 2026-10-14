import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import type { Quality } from "../capabilities";
import { frame } from "../frame";
import type { V3 } from "./layout";
import { drawPanelTexture, type PanelKind } from "./screens";

const PANELS: { kind: PanelKind; position: V3; width: number; phase: number }[] = [
  { kind: "pull-request", position: [-1.15, 1.55, -0.65], width: 0.78, phase: 0 },
  { kind: "terminal", position: [1.05, 1.5, -0.75], width: 0.74, phase: 1.7 },
  { kind: "pipeline", position: [1.38, 0.92, 0.3], width: 0.74, phase: 3.1 },
];

/** Translucent UI cards hovering around the desk, turned toward the camera. */
export function FloatingPanels({ quality }: { quality: Quality }) {
  const camera = useThree((state) => state.camera);
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  const materials = useMemo(
    () =>
      PANELS.map((panel) => {
        const map = drawPanelTexture(panel.kind, quality === "high" ? 640 : 400);
        return new THREE.MeshBasicMaterial({
          map,
          transparent: true,
          depthWrite: false,
          toneMapped: false,
          side: THREE.DoubleSide,
        });
      }),
    [quality],
  );

  useEffect(
    () => () =>
      materials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      }),
    [materials],
  );

  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const visibility = frame.panels * frame.power;
    PANELS.forEach((panel, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      mesh.visible = visibility > 0.01;
      if (!mesh.visible) return;
      const bob = Math.sin(frame.time * 0.8 + panel.phase) * 0.025;
      mesh.position.set(panel.position[0], panel.position[1] + bob, panel.position[2]);
      // Face the camera, but only partly, so the cards keep some perspective.
      target.copy(camera.position).lerp(mesh.position, 0.35);
      mesh.lookAt(target);
      materials[i].opacity = visibility * 0.95;
    });
  });

  return (
    <group>
      {PANELS.map((panel, i) => (
        <mesh
          key={panel.kind}
          ref={(el) => {
            refs.current[i] = el;
          }}
          material={materials[i]}
          renderOrder={2}
        >
          <planeGeometry args={[panel.width, panel.width * 0.56]} />
        </mesh>
      ))}
    </group>
  );
}
