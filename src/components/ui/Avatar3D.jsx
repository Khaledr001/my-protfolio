import { useRef, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Environment, Sphere } from "@react-three/drei";
import * as THREE from "three";

const mouse = { x: 0, y: 0 };

// ─── Particle field ──────────────────────────────────────────────────────────
function Particles({ count = 260 }) {
  const ref = useRef();

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#B600A8"),
      new THREE.Color("#7621B0"),
      new THREE.Color("#BE4C00"),
      new THREE.Color("#ffffff"),
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 28;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.012;
    ref.current.rotation.x = t * 0.006;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color"    count={count} array={colors}    itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.55} sizeAttenuation />
    </points>
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
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} toneMapped={false} />
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
      <meshStandardMaterial color={color} metalness={1} roughness={0} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  );
}

// ─── Soft radial glow plane behind the sphere ─────────────────────────────────
function GlowPlane() {
  const tex = useMemo(() => {
    const size = 256;
    const data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = (x / size) - 0.5;
        const dy = (y / size) - 0.5;
        const d  = Math.sqrt(dx * dx + dy * dy);
        const v  = Math.max(0, 1 - d * 2.6);
        const i  = (y * size + x) * 4;
        data[i]     = 182;   // R  #B600A8
        data[i + 1] = 0;     // G
        data[i + 2] = 168;   // B
        data[i + 3] = Math.round(v * v * 80);
      }
    }
    const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    t.needsUpdate = true;
    return t;
  }, []);

  return (
    <mesh position={[2.8, 0, -1.5]}>
      <planeGeometry args={[9, 9]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

// ─── Main avatar group ────────────────────────────────────────────────────────
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
      <Particles />
      <GlowPlane />

      {/* Avatar group — sits in the right half of the viewport */}
      <group ref={groupRef} position={[2.8, 0, 0]}>
        {/* Core distorted sphere */}
        <Sphere args={[1.6, 128, 128]}>
          <MeshDistortMaterial
            color="#140720"
            distort={0.34}
            speed={1.8}
            roughness={0.04}
            metalness={0.96}
            envMapIntensity={2.2}
          />
        </Sphere>

        {/* Inner glow shell */}
        <Sphere args={[1.5, 32, 32]}>
          <meshStandardMaterial
            color="#B600A8"
            emissive="#B600A8"
            emissiveIntensity={0.1}
            transparent
            opacity={0.18}
            side={THREE.BackSide}
          />
        </Sphere>

        {/* Orbital rings */}
        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
          <OrbitalRing radius={2.2} thickness={0.033} rotation={[Math.PI * 0.42, 0.3, 0]}  color="#B600A8" speed={0.18} />
        </Float>
        <Float speed={1.8} rotationIntensity={0.08} floatIntensity={0.15}>
          <OrbitalRing radius={2.75} thickness={0.02}  rotation={[-Math.PI * 0.28, 0.5, 0.2]}  color="#7621B0" speed={-0.12} />
        </Float>
        <Float speed={2.2} rotationIntensity={0.06} floatIntensity={0.1}>
          <OrbitalRing radius={3.2}  thickness={0.013} rotation={[Math.PI * 0.15, -0.4, 0.6]}  color="#BE4C00" speed={0.08} />
        </Float>

        {/* Floating orbs */}
        <FloatingOrb position={[2.1,  0.7,  0.5]}  size={0.08}  speed={0.7}  color="#B600A8" phase={0} />
        <FloatingOrb position={[-1.9, -0.5,  0.8]}  size={0.065} speed={1.1}  color="#7621B0" phase={2} />
        <FloatingOrb position={[0.5,   2.1, -0.5]}  size={0.055} speed={1.4}  color="#BE4C00" phase={4} />
        <FloatingOrb position={[-0.8, -2.0,  0.3]}  size={0.07}  speed={0.6}  color="#B600A8" phase={1} />
        <FloatingOrb position={[2.4,  -1.2, -0.6]}  size={0.045} speed={1.7}  color="#7621B0" phase={3} />
      </group>
    </>
  );
}

// ─── Canvas export ────────────────────────────────────────────────────────────
const Avatar3D = () => (
  <Canvas
    camera={{ position: [0, 0, 8.5], fov: 50 }}
    gl={{ antialias: true, alpha: true }}
    style={{ background: "transparent", width: "100%", height: "100%" }}
  >
    <fog attach="fog" args={["#0c0c0c", 18, 40]} />
    <ambientLight intensity={0.2} />
    <pointLight position={[7, 4, 4]}   color="#B600A8" intensity={6} />
    <pointLight position={[-3, -2, 3]}  color="#7621B0" intensity={4} />
    <pointLight position={[3, 4, -3]}   color="#ffffff"  intensity={1} />
    <pointLight position={[2, -4, 0]}   color="#BE4C00"  intensity={2} />
    <Suspense fallback={null}>
      <Scene />
      <Environment preset="night" />
    </Suspense>
  </Canvas>
);

export default Avatar3D;
