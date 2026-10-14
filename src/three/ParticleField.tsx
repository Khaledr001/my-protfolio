import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { frame } from "./frame";

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
attribute float aSeed;
varying float vAlpha;
varying float vSeed;

void main() {
  vec3 p = position;
  // Slow upward drift with wrap-around, plus a gentle lateral sway.
  // Dust drifting slowly upward through the room, wrapping at the ceiling.
  p.y = mod(p.y + 0.2 + uTime * (0.01 + aSeed * 0.025), 2.6) - 0.2;
  p.x += sin(uTime * 0.2 + aSeed * 6.2831) * 0.06;
  p.z += cos(uTime * 0.17 + aSeed * 4.0) * 0.05;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.35 + aSeed) / -mv.z;

  float twinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 1.4) + aSeed * 40.0);
  float depthFade = smoothstep(-12.0, -3.0, mv.z) * (1.0 - smoothstep(-0.9, -0.3, mv.z));
  vAlpha = twinkle * depthFade;
  vSeed = aSeed;
}`;

const fragmentShader = /* glsl */ `
uniform float uOpacity;
varying float vAlpha;
varying float vSeed;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float alpha = (1.0 - smoothstep(0.0, 0.5, d)) * vAlpha * uOpacity;
  if (alpha < 0.004) discard;
  vec3 warm = vec3(1.0, 0.78, 0.52);
  vec3 cool = vec3(0.62, 0.86, 0.92);
  vec3 color = vSeed > 0.8 ? cool : warm;
  gl_FragColor = vec4(color, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

interface ParticleFieldProps {
  count: number;
}

/** Dust motes catching the lamp light. Animated entirely on the GPU. */
export function ParticleField({ count }: ParticleFieldProps) {
  const dpr = useThree((state) => state.viewport.dpr);

  const resources = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // The volume of air around the desk.
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = Math.random() * 2.6 - 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3.2;
      seeds[i] = Math.random();
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 5 },
        uPixelRatio: { value: 1 },
        uOpacity: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { geometry, material };
  }, [count]);

  useEffect(
    () => () => {
      resources.geometry.dispose();
      resources.material.dispose();
    },
    [resources],
  );

  useFrame(() => {
    const uniforms = resources.material.uniforms;
    uniforms.uTime.value = frame.time;
    uniforms.uPixelRatio.value = dpr;
    uniforms.uOpacity.value = frame.particles * (0.25 + 0.5 * frame.lamp) * frame.power;
  });

  return (
    <points
      geometry={resources.geometry}
      material={resources.material}
      frustumCulled={false}
    />
  );
}
