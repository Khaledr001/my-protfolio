import { useRef, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Environment, Sphere } from "@react-three/drei";
import * as THREE from "three";

const mouse = { x: 0, y: 0 };

// ─── Stars (tiny white/blue-white dots filling the background) ────────────────
function StarField({ count = 800 }) {
  const ref = useRef();

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    // Mostly blue-white stars, a few warm orange ones
    const starColors = [
      new THREE.Color("#e8eeff"), // blue-white
      new THREE.Color("#c7d2fe"), // indigo-white
      new THREE.Color("#f0f9ff"), // pure white
      new THREE.Color("#fef3c7"), // warm white (orange giant)
      new THREE.Color("#a5f3fc"), // cyan-white
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 32;
      pos[i * 3 + 2] = -4 - Math.random() * 20; // all behind the sphere
      const c = starColors[Math.floor(Math.random() * starColors.length)];
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.006;
    ref.current.rotation.x = t * 0.003;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color"    count={count} array={colors}    itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Nebula dust (larger glowing particles — the coloured cosmic gas) ─────────
function NebulaDust({ count = 180 }) {
  const ref = useRef();
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const nebulaColors = [
      new THREE.Color("#7c3aed"), // violet
      new THREE.Color("#4f46e5"), // indigo
      new THREE.Color("#0369a1"), // blue
      new THREE.Color("#0e7490"), // teal
      new THREE.Color("#be185d"), // pink
      new THREE.Color("#7e22ce"), // deep purple
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 36;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 2] = -3 - Math.random() * 12;
      const c = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.009;
    ref.current.rotation.x = t * 0.004;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color"    count={count} array={colors}    itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.45}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Nebula cloud blob (large soft glow planes, Hubble-style) ─────────────────
function NebulaBlob({ position, width, height, color, opacity, rotation = [0, 0, 0] }) {
  const tex = useMemo(() => {
    const s = 256;
    const data = new Uint8Array(s * s * 4);
    const c = new THREE.Color(color);
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const nx = (x / s - 0.5) * 2;
        const ny = (y / s - 0.5) * 2;
        // Irregular elliptical blob with soft turbulence
        const turbX = Math.sin(ny * 5 + 1.2) * 0.15;
        const turbY = Math.cos(nx * 4 + 0.8) * 0.12;
        const d = Math.sqrt((nx + turbX) ** 2 + (ny + turbY) ** 2);
        const v = Math.max(0, 1 - d * 1.15);
        const i = (y * s + x) * 4;
        data[i]     = Math.round(c.r * 255);
        data[i + 1] = Math.round(c.g * 255);
        data[i + 2] = Math.round(c.b * 255);
        data[i + 3] = Math.round(Math.pow(v, 1.8) * opacity);
      }
    }
    const t = new THREE.DataTexture(data, s, s, THREE.RGBAFormat);
    t.needsUpdate = true;
    return t;
  }, [color, opacity]);

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={tex}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ─── Glowing orb ─────────────────────────────────────────────────────────────
function FloatingOrb({ position, size, speed, color, phase = 0 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phase;
    ref.current.position.x = position[0] + Math.sin(t) * 0.4;
    ref.current.position.y = position[1] + Math.cos(t * 0.75) * 0.28;
    ref.current.position.z = position[2] + Math.sin(t * 0.5) * 0.18;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={3}
        toneMapped={false}
      />
    </mesh>
  );
}

// ─── Orbital ring ─────────────────────────────────────────────────────────────
function OrbitalRing({ radius, thickness, rotation, color, speed }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.getElapsedTime() * speed;
  });
  return (
    <mesh ref={ref} rotation={rotation}>
      <torusGeometry args={[radius, thickness, 16, 140]} />
      <meshStandardMaterial
        color={color}
        metalness={1}
        roughness={0}
        emissive={color}
        emissiveIntensity={0.6}
      />
    </mesh>
  );
}

// ─── Main scene ───────────────────────────────────────────────────────────────
function Scene() {
  const groupRef = useRef();

  useEffect(() => {
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y, mouse.x * 0.55 + t * 0.04, 0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, -mouse.y * 0.35, 0.04
    );
  });

  return (
    <>
      {/* ── Background: stars + nebula dust ── */}
      <StarField count={800} />
      <NebulaDust count={180} />

      {/* ── Nebula clouds (Hubble-style additive blending) ── */}
      {/* Large violet nebula, left-centre */}
      <NebulaBlob position={[-4, 1, -10]} width={18} height={12} color="#7c3aed" opacity={160} rotation={[0, 0, 0.3]} />
      {/* Blue nebula, right side behind sphere */}
      <NebulaBlob position={[5, -1, -12]} width={16} height={10} color="#1d4ed8" opacity={140} rotation={[0, 0, -0.2]} />
      {/* Teal/cyan wisp, lower centre */}
      <NebulaBlob position={[0, -4, -8]}  width={12} height={7}  color="#0e7490" opacity={120} rotation={[0, 0, 0.5]} />
      {/* Pink/magenta streak, upper right */}
      <NebulaBlob position={[3, 4, -9]}   width={10} height={6}  color="#be185d" opacity={110} rotation={[0, 0, -0.6]} />
      {/* Deep purple atmospheric glow behind the sphere */}
      <NebulaBlob position={[2.8, 0, -2]} width={10} height={10} color="#4c1d95" opacity={90}  />

      {/* ── Avatar group ── */}
      <group ref={groupRef} position={[2.8, 0, 0]}>
        {/* Cosmic body */}
        <Sphere args={[1.6, 128, 128]}>
          <MeshDistortMaterial
            color="#060318"
            distort={0.34}
            speed={1.8}
            roughness={0.05}
            metalness={0.95}
            envMapIntensity={2.5}
          />
        </Sphere>

        {/* Atmospheric shell — cyan tint like a planet atmosphere */}
        <Sphere args={[1.68, 32, 32]}>
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#0ea5e9"
            emissiveIntensity={0.06}
            transparent
            opacity={0.12}
            side={THREE.BackSide}
          />
        </Sphere>

        {/* Orbital rings */}
        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
          <OrbitalRing radius={2.2}  thickness={0.033} rotation={[Math.PI * 0.42, 0.3, 0]}   color="#818cf8" speed={0.18} />
        </Float>
        <Float speed={1.8} rotationIntensity={0.08} floatIntensity={0.15}>
          <OrbitalRing radius={2.75} thickness={0.02}  rotation={[-Math.PI * 0.28, 0.5, 0.2]} color="#22d3ee" speed={-0.12} />
        </Float>
        <Float speed={2.2} rotationIntensity={0.06} floatIntensity={0.1}>
          <OrbitalRing radius={3.2}  thickness={0.013} rotation={[Math.PI * 0.15, -0.4, 0.6]} color="#a78bfa" speed={0.08} />
        </Float>

        {/* Floating orbs — space colours */}
        <FloatingOrb position={[2.1,  0.7,  0.5]}  size={0.08}  speed={0.7}  color="#818cf8" phase={0} />
        <FloatingOrb position={[-1.9, -0.5,  0.8]}  size={0.065} speed={1.1}  color="#22d3ee" phase={2} />
        <FloatingOrb position={[0.5,   2.1, -0.5]}  size={0.055} speed={1.4}  color="#e879f9" phase={4} />
        <FloatingOrb position={[-0.8, -2.0,  0.3]}  size={0.07}  speed={0.6}  color="#a78bfa" phase={1} />
        <FloatingOrb position={[2.4,  -1.2, -0.6]}  size={0.045} speed={1.7}  color="#38bdf8" phase={3} />
      </group>
    </>
  );
}

// ─── Canvas ───────────────────────────────────────────────────────────────────
const Avatar3D = () => (
  <Canvas
    camera={{ position: [0, 0, 8.5], fov: 50 }}
    gl={{ antialias: true, alpha: true }}
    style={{ width: "100%", height: "100%" }}
  >
    <fog attach="fog" args={["#020818", 22, 45]} />
    <ambientLight intensity={0.12} />
    {/* Blue star — main key light */}
    <pointLight position={[8, 5, 4]}   color="#93c5fd" intensity={5} />
    {/* Violet nebula fill */}
    <pointLight position={[-5, 2, 3]}  color="#7c3aed" intensity={4} />
    {/* Teal rim light */}
    <pointLight position={[0, -4, 2]}  color="#0e7490" intensity={3} />
    {/* Warm orange backlight */}
    <pointLight position={[3, -3, -2]} color="#f97316" intensity={2} />
    {/* Pink top accent */}
    <pointLight position={[-2, 5, 1]}  color="#db2777" intensity={2} />
    <Suspense fallback={null}>
      <Scene />
      <Environment preset="night" />
    </Suspense>
  </Canvas>
);

export default Avatar3D;
