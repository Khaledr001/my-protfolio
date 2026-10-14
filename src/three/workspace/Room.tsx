import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { frame } from "../frame";
import { DESK, SPOT } from "./layout";

/** A walnut-like grain, drawn once into a canvas. */
function createWoodTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#4a3324";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 220; i++) {
    const y = Math.random() * canvas.height;
    const amp = 2 + Math.random() * 6;
    const freq = 0.004 + Math.random() * 0.01;
    const phase = Math.random() * 10;
    ctx.strokeStyle = Math.random() > 0.5 ? "rgba(30, 18, 10, 0.22)" : "rgba(120, 82, 52, 0.16)";
    ctx.lineWidth = 0.6 + Math.random() * 2.2;
    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += 16) {
      const yy = y + Math.sin(x * freq + phase) * amp;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

const windowVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

// A night skyline seen out of focus: buildings, lit windows and bokeh.
const windowFragment = /* glsl */ `
uniform float uTime;
uniform float uDim;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec2 uv = vUv;
  vec3 col = mix(vec3(0.03, 0.045, 0.075), vec3(0.07, 0.09, 0.14), uv.y);

  float id = floor(uv.x * 16.0);
  float height = 0.18 + hash(vec2(id, 1.0)) * 0.5;
  float building = 1.0 - step(height, uv.y);
  col = mix(col, vec3(0.018, 0.024, 0.04), building);

  vec2 grid = vec2(uv.x * 140.0, uv.y * 70.0);
  vec2 cell = floor(grid);
  float on = step(0.8, hash(cell)) * building * step(0.35, fract(grid.x)) * step(0.35, fract(grid.y));
  float twinkle = 0.75 + 0.25 * sin(uTime * 0.4 + hash(cell) * 30.0);
  vec3 warm = vec3(1.0, 0.7, 0.4);
  vec3 cool = vec3(0.55, 0.85, 0.95);
  col += on * mix(warm, cool, step(0.65, hash(cell + 3.0))) * 0.45 * twinkle;

  for (int i = 0; i < 12; i++) {
    float fi = float(i);
    vec2 c = vec2(hash(vec2(fi, 7.0)), 0.08 + hash(vec2(fi, 3.0)) * 0.55);
    float r = 0.03 + hash(vec2(fi, 9.0)) * 0.05;
    float d = length((uv - c) * vec2(1.75, 1.0));
    float disc = 1.0 - smoothstep(r * 0.7, r, d);
    vec3 tint = mix(warm, cool, hash(vec2(fi, 5.0)));
    col += disc * tint * 0.16;
  }

  gl_FragColor = vec4(col * uDim, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

interface RoomProps {
  shadows: boolean;
}

/** Desk, desk mat, wall with a night-city window, and the floor. */
export function Room({ shadows }: RoomProps) {
  const resources = useMemo(() => {
    const wood = createWoodTexture();
    return {
      wood,
      deskMaterial: new THREE.MeshStandardMaterial({ map: wood, roughness: 0.55, metalness: 0.05 }),
      edgeMaterial: new THREE.MeshStandardMaterial({ color: "#2b1e15", roughness: 0.6 }),
      legMaterial: new THREE.MeshStandardMaterial({ color: "#151922", roughness: 0.45, metalness: 0.6 }),
      matMaterial: new THREE.MeshStandardMaterial({ color: "#161c28", roughness: 0.95 }),
      wallMaterial: new THREE.MeshStandardMaterial({ color: "#121827", roughness: 0.95 }),
      floorMaterial: new THREE.MeshStandardMaterial({ color: "#0b0e15", roughness: 0.9 }),
      frameMaterial: new THREE.MeshStandardMaterial({ color: "#0c1018", roughness: 0.6, metalness: 0.3 }),
      windowMaterial: new THREE.ShaderMaterial({
        vertexShader: windowVertex,
        fragmentShader: windowFragment,
        uniforms: { uTime: { value: 0 }, uDim: { value: 0.62 } },
      }),
    };
  }, []);

  useEffect(
    () => () => {
      Object.values(resources).forEach((r) => r.dispose());
    },
    [resources],
  );

  useFrame(() => {
    resources.windowMaterial.uniforms.uTime.value = frame.time;
  });

  // Desk top uses the grain on the top face, a darker edge band elsewhere.
  const deskMaterials = [
    resources.edgeMaterial,
    resources.edgeMaterial,
    resources.deskMaterial,
    resources.edgeMaterial,
    resources.edgeMaterial,
    resources.edgeMaterial,
  ];

  const legHeight = -SPOT.floorY - DESK.thickness;

  return (
    <group>
      <mesh position={[0, -DESK.thickness / 2, 0]} material={deskMaterials} receiveShadow={shadows} castShadow={shadows}>
        <boxGeometry args={[DESK.width, DESK.thickness, DESK.depth]} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * (DESK.width / 2 - 0.12), -DESK.thickness - legHeight / 2, 0]}
          material={resources.legMaterial}
        >
          <boxGeometry args={[0.05, legHeight, DESK.depth - 0.2]} />
        </mesh>
      ))}

      {/* Desk mat under keyboard and mouse */}
      <mesh position={[0.05, 0.002, 0.3]} rotation-x={-Math.PI / 2} material={resources.matMaterial} receiveShadow={shadows}>
        <planeGeometry args={[1.55, 0.56]} />
      </mesh>

      {/* Back wall with a window onto a night skyline */}
      <mesh position={[0, 1.5, SPOT.wallZ]} material={resources.wallMaterial} receiveShadow={shadows}>
        <planeGeometry args={[40, 12]} />
      </mesh>
      <group position={[0.75, 1.35, SPOT.wallZ + 0.01]}>
        <mesh material={resources.windowMaterial}>
          <planeGeometry args={[2.8, 1.6]} />
        </mesh>
        {/* Frame and mullions */}
        {[
          [0, 0.82, 2.92, 0.06],
          [0, -0.82, 2.92, 0.06],
          [-1.43, 0, 0.06, 1.7],
          [1.43, 0, 0.06, 1.7],
          [0, 0, 0.035, 1.6],
        ].map(([x, y, w, h], i) => (
          <mesh key={i} position={[x, y, 0.02]} material={resources.frameMaterial}>
            <boxGeometry args={[w, h, 0.04]} />
          </mesh>
        ))}
      </group>

      <mesh position={[0, SPOT.floorY, 0]} rotation-x={-Math.PI / 2} material={resources.floorMaterial} receiveShadow={shadows}>
        <planeGeometry args={[40, 30]} />
      </mesh>
    </group>
  );
}
