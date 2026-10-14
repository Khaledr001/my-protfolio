import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

import type { Quality } from "../capabilities";
import { frame } from "../frame";
import { stageWeight } from "../stages";
import { ambientSnippets, projectSnippets, reviewDiff } from "./codeContent";
import { SPOT } from "./layout";
import { drawReviewTexture, EditorScreen } from "./screens";

interface DeviceProps {
  quality: Quality;
  shadows: boolean;
}

const aluminium = () =>
  new THREE.MeshStandardMaterial({ color: "#9aa1ab", metalness: 0.85, roughness: 0.32 });
const darkMetal = () =>
  new THREE.MeshStandardMaterial({ color: "#14171e", metalness: 0.5, roughness: 0.42 });

/** The main monitor, with an editor that types code live. */
export function Monitor({ quality, shadows }: DeviceProps) {
  const high = quality === "high";
  const editor = useMemo(() => (high ? new EditorScreen(1024, 576) : new EditorScreen(640, 360)), [high]);
  const ambientIndex = useRef(0);

  const materials = useMemo(
    () => ({
      screen: new THREE.MeshBasicMaterial({ map: editor.texture, toneMapped: false }),
      bezel: darkMetal(),
      stand: aluminium(),
      note: new THREE.MeshStandardMaterial({ color: "#f2c46a", roughness: 0.8 }),
    }),
    [editor],
  );

  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => alive && editor.redraw());
    return () => {
      alive = false;
      editor.dispose();
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [editor, materials]);

  useFrame((_, delta) => {
    const inProjects = stageWeight(frame.stage, 2) > 0.5;
    if (inProjects) {
      const index = THREE.MathUtils.clamp(Math.round(frame.work), 0, projectSnippets.length - 1);
      editor.show(projectSnippets[index], frame.reduced ? 1e6 : 160);
    } else {
      if (editor.isDone(frame.time)) {
        ambientIndex.current = (ambientIndex.current + 1) % ambientSnippets.length;
      }
      editor.show(ambientSnippets[ambientIndex.current], frame.reduced ? 1e6 : 26);
    }
    editor.update(frame.time, frame.reduced ? 1 : Math.min(delta, 0.1), high ? 14 : 7);
    materials.screen.color.setScalar(frame.screen * frame.power);
  });

  return (
    <group position={SPOT.monitor}>
      {/* Stand */}
      <RoundedBox args={[0.44, 0.02, 0.26]} radius={0.008} position={[0, 0.01, 0.02]} material={materials.stand} castShadow={shadows} receiveShadow={shadows} />
      <mesh position={[0, 0.36, -0.07]} rotation-x={0.06} material={materials.stand} castShadow={shadows}>
        <boxGeometry args={[0.07, 0.68, 0.03]} />
      </mesh>

      {/* Panel */}
      <group position={[0, 0.8, -0.05]} rotation-x={-0.05}>
        <RoundedBox args={[1.7, 1, 0.045]} radius={0.018} material={materials.bezel} castShadow={shadows} />
        <mesh position={[0, 0.005, 0.0235]} material={materials.screen}>
          <planeGeometry args={[1.62, 0.912]} />
        </mesh>
        {/* A sticky note on the bezel */}
        <mesh position={[0.74, -0.4, 0.026]} rotation-z={0.07} material={materials.note}>
          <planeGeometry args={[0.13, 0.13]} />
        </mesh>
      </group>
    </group>
  );
}

/** The laptop, open on a code review. */
export function Laptop({ quality, shadows }: DeviceProps) {
  const materials = useMemo(() => {
    const review = drawReviewTexture(reviewDiff, quality === "high" ? 1024 : 640);
    return {
      review,
      screen: new THREE.MeshBasicMaterial({ map: review, toneMapped: false }),
      body: aluminium(),
      deck: new THREE.MeshStandardMaterial({ color: "#1a1e26", roughness: 0.7 }),
      pad: new THREE.MeshStandardMaterial({ color: "#7f858e", metalness: 0.6, roughness: 0.35 }),
    };
  }, [quality]);

  useEffect(
    () => () => {
      Object.values(materials).forEach((m) => m.dispose());
    },
    [materials],
  );

  useFrame(() => {
    materials.screen.color.setScalar(frame.screen * frame.power);
  });

  return (
    <group position={SPOT.laptop} rotation-y={-0.55}>
      <RoundedBox args={[0.66, 0.022, 0.44]} radius={0.008} position={[0, 0.011, 0]} material={materials.body} castShadow={shadows} receiveShadow={shadows} />
      <mesh position={[0, 0.0225, -0.05]} rotation-x={-Math.PI / 2} material={materials.deck}>
        <planeGeometry args={[0.58, 0.2]} />
      </mesh>
      <mesh position={[0, 0.0225, 0.12]} rotation-x={-Math.PI / 2} material={materials.pad}>
        <planeGeometry args={[0.22, 0.12]} />
      </mesh>
      {/* Lid, hinged at the back edge and tilted back */}
      <group position={[0, 0.022, -0.215]} rotation-x={-0.3}>
        <RoundedBox args={[0.66, 0.42, 0.012]} radius={0.006} position={[0, 0.21, 0]} material={materials.body} castShadow={shadows} />
        <mesh position={[0, 0.215, 0.0065]} material={materials.screen}>
          <planeGeometry args={[0.6, 0.375]} />
        </mesh>
      </group>
    </group>
  );
}

// ── Keyboard: one instanced mesh, keys press as if someone is typing ────────

interface KeyRect {
  x: number;
  z: number;
  w: number;
}

function buildKeys(): KeyRect[] {
  const unit = 0.058;
  const keys: KeyRect[] = [];
  for (let row = 0; row < 5; row++) {
    const z = (row - 2) * unit;
    if (row === 4) {
      // Bottom row: modifiers either side of a long space bar.
      [-7, -6, -5].forEach((c) => keys.push({ x: c * unit, z, w: unit - 0.01 }));
      keys.push({ x: -0.5 * unit, z, w: unit * 7 - 0.01 });
      [4, 5, 6, 7].forEach((c) => keys.push({ x: c * unit, z, w: unit - 0.01 }));
      continue;
    }
    for (let c = -7; c <= 7; c++) keys.push({ x: c * unit, z, w: unit - 0.01 });
  }
  return keys;
}

const hash = (n: number) => {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
};

export function Keyboard({ shadows }: { shadows: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const keys = useMemo(buildKeys, []);
  const lastTick = useRef(-1);

  const resources = useMemo(
    () => ({
      key: new THREE.BoxGeometry(1, 1, 1),
      keyMaterial: new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.55 }),
      base: darkMetal(),
      mouse: new THREE.MeshStandardMaterial({ color: "#1c212b", roughness: 0.4, metalness: 0.2 }),
    }),
    [],
  );

  useEffect(
    () => () => {
      Object.values(resources).forEach((r) => r.dispose());
    },
    [resources],
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const idle = useMemo(() => new THREE.Color("#232a3a"), []);
  const lit = useMemo(() => new THREE.Color("#f2a65a"), []);
  const color = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const tick = Math.floor(frame.time * 11);
    if (tick === lastTick.current) return;
    lastTick.current = tick;
    keys.forEach((key, i) => {
      const pressed = frame.power > 0.5 && hash(i * 7.13 + tick * 3.71) > 0.955 ? 1 : 0;
      dummy.position.set(key.x, 0.036 - pressed * 0.007, key.z);
      dummy.scale.set(key.w, 0.018, 0.048);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, color.copy(idle).lerp(lit, pressed * 0.85));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      <group position={SPOT.keyboard}>
        <RoundedBox args={[0.92, 0.024, 0.32]} radius={0.01} position={[0, 0.012, 0]} material={resources.base} castShadow={shadows} receiveShadow={shadows} />
        <instancedMesh
          ref={mesh}
          args={[resources.key, resources.keyMaterial, keys.length]}
          castShadow={shadows}
          frustumCulled={false}
        />
      </group>
      <mesh position={[SPOT.mouse[0], 0.018, SPOT.mouse[2]]} scale={[0.034, 0.018, 0.058]} material={resources.mouse} castShadow={shadows}>
        <sphereGeometry args={[1, 24, 16]} />
      </mesh>
    </group>
  );
}
