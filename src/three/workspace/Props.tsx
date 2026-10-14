import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { frame } from "../frame";
import { simplexNoise } from "../shaders/noise";
import { SPOT, type V3 } from "./layout";

interface PropProps {
  shadows: boolean;
}

// ── Coffee ──────────────────────────────────────────────────────────────────

const steamVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const steamFragment = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform float uSeed;
varying vec2 vUv;
${simplexNoise}

void main() {
  vec2 uv = vUv;
  float sway = snoise(vec3(uv.y * 2.2 - uTime * 0.35, uSeed, uTime * 0.1));
  float x = uv.x - 0.5 + sway * 0.22 * uv.y;
  float column = exp(-x * x * (60.0 - uv.y * 40.0));
  float wisps = snoise(vec3(uv.x * 3.5 + uSeed, uv.y * 3.0 - uTime * 0.8, uTime * 0.15)) * 0.5 + 0.5;
  float fade = smoothstep(0.02, 0.18, uv.y) * (1.0 - smoothstep(0.45, 1.0, uv.y));
  float alpha = column * smoothstep(0.25, 0.95, wisps) * fade * uOpacity;
  gl_FragColor = vec4(vec3(1.0, 0.95, 0.88), alpha * 0.55);
  #include <colorspace_fragment>
}`;

/** Two soft wisps that rise from the mug and always face the camera. */
function Steam() {
  const group = useRef<THREE.Group>(null);
  const camera = useThree((state) => state.camera);
  const materials = useMemo(
    () =>
      [0, 1].map(
        (seed) =>
          new THREE.ShaderMaterial({
            vertexShader: steamVertex,
            fragmentShader: steamFragment,
            uniforms: { uTime: { value: 0 }, uOpacity: { value: 1 }, uSeed: { value: seed * 4.7 } },
            transparent: true,
            depthWrite: false,
          }),
      ),
    [],
  );

  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    // Billboard around the vertical axis only, so the steam stays upright.
    g.rotation.y = Math.atan2(camera.position.x - SPOT.mug[0], camera.position.z - SPOT.mug[2]);
    materials.forEach((m) => {
      m.uniforms.uTime.value = frame.time;
      m.uniforms.uOpacity.value = frame.power;
    });
  });

  return (
    <group ref={group} position={[SPOT.mug[0], 0.62, SPOT.mug[2]]}>
      {materials.map((material, i) => (
        <mesh key={i} position={[i * 0.05 - 0.025, i * 0.04, 0]} material={material}>
          <planeGeometry args={[0.32, 0.62]} />
        </mesh>
      ))}
    </group>
  );
}

export function CoffeeMug({ shadows }: PropProps) {
  const resources = useMemo(() => {
    // Lathe profile: outer wall up, lip, inner wall down.
    const profile = [
      [0, 0],
      [0.13, 0],
      [0.142, 0.012],
      [0.145, 0.27],
      [0.135, 0.28],
      [0.128, 0.03],
      [0, 0.03],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return {
      body: new THREE.LatheGeometry(profile, 48),
      handle: new THREE.TorusGeometry(0.07, 0.016, 12, 32, Math.PI * 1.15),
      ceramic: new THREE.MeshStandardMaterial({ color: "#e4ddd0", roughness: 0.38 }),
      coffee: new THREE.MeshStandardMaterial({ color: "#2a170c", roughness: 0.15 }),
      coaster: new THREE.MeshStandardMaterial({ color: "#7a5a3c", roughness: 0.95 }),
    };
  }, []);

  useEffect(
    () => () => {
      Object.values(resources).forEach((r) => r.dispose());
    },
    [resources],
  );

  return (
    <group>
      <group position={SPOT.mug}>
        <mesh position={[0, 0.006, 0]} material={resources.coaster} receiveShadow={shadows}>
          <cylinderGeometry args={[0.18, 0.18, 0.012, 40]} />
        </mesh>
        <group position={[0, 0.012, 0]}>
          <mesh geometry={resources.body} material={resources.ceramic} castShadow={shadows} receiveShadow={shadows} />
          <mesh position={[0, 0.235, 0]} rotation-x={-Math.PI / 2} material={resources.coffee}>
            <circleGeometry args={[0.13, 40]} />
          </mesh>
          <mesh
            geometry={resources.handle}
            material={resources.ceramic}
            position={[0.14, 0.145, 0]}
            rotation-z={-Math.PI * 0.575}
            castShadow={shadows}
          />
        </group>
      </group>
      <Steam />
    </group>
  );
}

// ── Desk lamp ───────────────────────────────────────────────────────────────

const beamVertex = /* glsl */ `
varying float vAlong;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  // 0 at the bulb end of the cone, 1 where it meets the desk.
  vAlong = 0.5 - position.y / 1.1;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const beamFragment = /* glsl */ `
uniform float uOpacity;
varying float vAlong;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  float facing = abs(dot(normalize(vNormal), normalize(vView)));
  float edgeSoft = smoothstep(0.0, 0.6, facing);
  float fade = (1.0 - smoothstep(0.0, 1.0, vAlong)) * smoothstep(0.0, 0.08, vAlong);
  float alpha = edgeSoft * fade * uOpacity;
  gl_FragColor = vec4(vec3(1.0, 0.72, 0.42), alpha);
  #include <colorspace_fragment>
}`;

const UP = new THREE.Vector3(0, 1, 0);

/** A cylinder spanning two points. */
function Segment({ from, to, radius, material, shadows }: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  radius: number;
  material: THREE.Material;
  shadows: boolean;
}) {
  const { position, quaternion, length } = useMemo(() => {
    const dir = new THREE.Vector3().subVectors(to, from);
    return {
      position: new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize()),
      length: dir.length(),
    };
  }, [from, to]);
  return (
    <mesh position={position} quaternion={quaternion} material={material} castShadow={shadows}>
      <cylinderGeometry args={[radius, radius, length, 12]} />
    </mesh>
  );
}

const v = (p: V3) => new THREE.Vector3(...p);

export function DeskLamp({ shadows }: PropProps) {
  const spot = useRef<THREE.SpotLight>(null);
  const bulbLight = useRef<THREE.PointLight>(null);

  const rig = useMemo(() => {
    const base = v(SPOT.lamp);
    const shoulder = base.clone().add(new THREE.Vector3(0, 0.04, 0));
    const elbow = base.clone().add(new THREE.Vector3(0.14, 0.86, -0.12));
    const head = base.clone().add(new THREE.Vector3(0.58, 1.02, 0.3));
    const target = v(SPOT.lampTarget);
    const dir = new THREE.Vector3().subVectors(target, head).normalize();
    const down = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir);
    return { base, shoulder, elbow, head, target, dir, down };
  }, []);

  const resources = useMemo(
    () => ({
      metal: new THREE.MeshStandardMaterial({ color: "#1d2129", metalness: 0.7, roughness: 0.38 }),
      shadeInner: new THREE.MeshStandardMaterial({
        color: "#f7d9b0",
        emissive: new THREE.Color("#ffb067"),
        emissiveIntensity: 1.2,
        side: THREE.BackSide,
      }),
      bulb: new THREE.MeshBasicMaterial({ color: "#fff1d6" }),
      beam: new THREE.ShaderMaterial({
        vertexShader: beamVertex,
        fragmentShader: beamFragment,
        uniforms: { uOpacity: { value: 0.1 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
      targetObject: new THREE.Object3D(),
    }),
    [],
  );

  useEffect(() => {
    resources.targetObject.position.copy(rig.target);
    if (spot.current) spot.current.target = resources.targetObject;
    return () => {
      resources.metal.dispose();
      resources.shadeInner.dispose();
      resources.bulb.dispose();
      resources.beam.dispose();
    };
  }, [resources, rig]);

  useFrame(() => {
    const lamp = frame.lamp;
    if (spot.current) spot.current.intensity = 22 * lamp;
    if (bulbLight.current) bulbLight.current.intensity = 1.6 * lamp;
    resources.shadeInner.emissiveIntensity = 1.4 * lamp;
    resources.bulb.color.setRGB(1, 0.95 * lamp + 0.05, 0.84 * lamp + 0.05);
    resources.beam.uniforms.uOpacity.value = 0.085 * lamp;
  });

  const shadePos = rig.head.clone().addScaledVector(rig.dir, 0.08);
  const bulbPos = rig.head.clone().addScaledVector(rig.dir, 0.12);
  const beamPos = rig.head.clone().addScaledVector(rig.dir, 0.68);

  return (
    <group>
      <primitive object={resources.targetObject} />
      <mesh position={[rig.base.x, 0.018, rig.base.z]} material={resources.metal} castShadow={shadows} receiveShadow={shadows}>
        <cylinderGeometry args={[0.15, 0.16, 0.036, 40]} />
      </mesh>
      <Segment from={rig.shoulder} to={rig.elbow} radius={0.014} material={resources.metal} shadows={shadows} />
      <Segment from={rig.elbow} to={rig.head} radius={0.012} material={resources.metal} shadows={shadows} />
      {[rig.elbow, rig.head].map((p, i) => (
        <mesh key={i} position={p} material={resources.metal}>
          <sphereGeometry args={[0.026, 16, 12]} />
        </mesh>
      ))}

      {/* Shade: an open cone, dark outside and glowing inside */}
      <group position={shadePos} quaternion={rig.down}>
        <mesh material={resources.metal} castShadow={shadows}>
          <cylinderGeometry args={[0.05, 0.17, 0.2, 40, 1, true]} />
        </mesh>
        <mesh material={resources.shadeInner}>
          <cylinderGeometry args={[0.049, 0.168, 0.198, 40, 1, true]} />
        </mesh>
      </group>
      <mesh position={bulbPos} material={resources.bulb}>
        <sphereGeometry args={[0.045, 20, 16]} />
      </mesh>

      {/* Visible light cone */}
      <mesh position={beamPos} quaternion={rig.down} material={resources.beam}>
        <cylinderGeometry args={[0.17, 0.95, 1.1, 40, 1, true]} />
      </mesh>

      <spotLight
        ref={spot}
        position={bulbPos}
        color="#ffb067"
        angle={0.72}
        penumbra={0.65}
        distance={6}
        decay={2}
        castShadow={shadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <pointLight ref={bulbLight} position={bulbPos} color="#ffb067" distance={2.2} decay={2} />
    </group>
  );
}

// ── Plant and notebook ──────────────────────────────────────────────────────

const LEAVES = Array.from({ length: 9 }, (_, i) => ({
  angle: (i / 9) * Math.PI * 2 + (i % 2) * 0.3,
  tilt: 0.35 + (i % 3) * 0.18,
  length: 0.2 + (i % 4) * 0.035,
}));

export function Plant({ shadows }: PropProps) {
  const leavesRef = useRef<THREE.Group>(null);
  const resources = useMemo(
    () => ({
      pot: new THREE.MeshStandardMaterial({ color: "#b5643e", roughness: 0.85 }),
      soil: new THREE.MeshStandardMaterial({ color: "#2a1d14", roughness: 1 }),
      leaf: new THREE.MeshStandardMaterial({ color: "#4f7d5c", roughness: 0.6, side: THREE.DoubleSide }),
    }),
    [],
  );
  useEffect(
    () => () => {
      Object.values(resources).forEach((r) => r.dispose());
    },
    [resources],
  );

  useFrame(() => {
    if (leavesRef.current) leavesRef.current.rotation.y = Math.sin(frame.time * 0.4) * 0.05;
  });

  return (
    <group position={SPOT.plant}>
      <mesh position={[0, 0.1, 0]} material={resources.pot} castShadow={shadows} receiveShadow={shadows}>
        <cylinderGeometry args={[0.12, 0.09, 0.2, 32]} />
      </mesh>
      <mesh position={[0, 0.19, 0]} rotation-x={-Math.PI / 2} material={resources.soil}>
        <circleGeometry args={[0.112, 24]} />
      </mesh>
      <group ref={leavesRef} position={[0, 0.19, 0]}>
        {LEAVES.map((leaf, i) => (
          <group key={i} rotation-y={leaf.angle}>
            <mesh
              position={[Math.sin(leaf.tilt) * leaf.length * 0.5, Math.cos(leaf.tilt) * leaf.length * 0.5, 0]}
              rotation-z={-leaf.tilt}
              scale={[0.045, leaf.length * 0.5, 0.012]}
              material={resources.leaf}
              castShadow={shadows}
            >
              <sphereGeometry args={[1, 12, 10]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

export function Notebook({ shadows }: PropProps) {
  const resources = useMemo(
    () => ({
      cover: new THREE.MeshStandardMaterial({ color: "#2c3a56", roughness: 0.7 }),
      pages: new THREE.MeshStandardMaterial({ color: "#e8e1d2", roughness: 0.9 }),
      pen: new THREE.MeshStandardMaterial({ color: "#191c22", metalness: 0.4, roughness: 0.35 }),
      tip: new THREE.MeshStandardMaterial({ color: "#d9a35a", metalness: 0.9, roughness: 0.25 }),
    }),
    [],
  );
  useEffect(
    () => () => {
      Object.values(resources).forEach((r) => r.dispose());
    },
    [resources],
  );

  return (
    <group position={SPOT.notebook} rotation-y={0.22}>
      <mesh position={[0, 0.006, 0]} material={resources.pages} castShadow={shadows} receiveShadow={shadows}>
        <boxGeometry args={[0.36, 0.012, 0.5]} />
      </mesh>
      <mesh position={[0, 0.014, 0]} material={resources.cover} castShadow={shadows} receiveShadow={shadows}>
        <boxGeometry args={[0.38, 0.006, 0.52]} />
      </mesh>
      <group position={[0.24, 0.012, 0.04]} rotation-y={0.4}>
        <mesh rotation-x={Math.PI / 2} material={resources.pen} castShadow={shadows}>
          <cylinderGeometry args={[0.008, 0.008, 0.3, 12]} />
        </mesh>
        <mesh position={[0, 0, 0.16]} rotation-x={Math.PI / 2} material={resources.tip}>
          <coneGeometry args={[0.008, 0.025, 12]} />
        </mesh>
      </group>
    </group>
  );
}
