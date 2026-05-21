import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Environment, Sphere } from "@react-three/drei";
import * as THREE from "three";

// Global mouse store — shared across all hooks without re-renders
const mouse = { x: 0, y: 0 };

function FloatingOrb({ position, size, speed, color, phase = 0 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phase;
    ref.current.position.x = position[0] + Math.sin(t) * 0.35;
    ref.current.position.y = position[1] + Math.cos(t * 0.75) * 0.25;
    ref.current.position.z = position[2] + Math.sin(t * 0.5) * 0.15;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  );
}

function OrbitalRing({ radius, thickness, rotation, color, speed = 0.15 }) {
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
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

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
    // Slow idle drift + mouse influence
    const targetY = mouse.x * 0.55 + t * 0.04;
    const targetX = -mouse.y * 0.35;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.04
    );
  });

  return (
    <group ref={groupRef}>
      {/* Main head — distorted metallic sphere */}
      <Sphere args={[1.25, 128, 128]}>
        <MeshDistortMaterial
          color="#140720"
          distort={0.32}
          speed={1.8}
          roughness={0.05}
          metalness={0.95}
          envMapIntensity={2}
        />
      </Sphere>

      {/* Inner glow sphere */}
      <Sphere args={[1.15, 32, 32]}>
        <meshStandardMaterial
          color="#B600A8"
          emissive="#B600A8"
          emissiveIntensity={0.08}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Orbital rings */}
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
        <OrbitalRing
          radius={1.95}
          thickness={0.03}
          rotation={[Math.PI * 0.42, 0.3, 0]}
          color="#B600A8"
          speed={0.18}
        />
      </Float>
      <Float speed={1.8} rotationIntensity={0.08} floatIntensity={0.15}>
        <OrbitalRing
          radius={2.4}
          thickness={0.018}
          rotation={[-Math.PI * 0.28, 0.5, 0.2]}
          color="#7621B0"
          speed={-0.12}
        />
      </Float>
      <Float speed={2.2} rotationIntensity={0.06} floatIntensity={0.1}>
        <OrbitalRing
          radius={2.8}
          thickness={0.012}
          rotation={[Math.PI * 0.15, -0.4, 0.6]}
          color="#BE4C00"
          speed={0.08}
        />
      </Float>

      {/* Floating orbs */}
      <FloatingOrb position={[1.9, 0.6, 0.4]}  size={0.07} speed={0.7} color="#B600A8" phase={0} />
      <FloatingOrb position={[-1.7, -0.4, 0.7]} size={0.055} speed={1.1} color="#7621B0" phase={2} />
      <FloatingOrb position={[0.4, 1.9, -0.4]}  size={0.05} speed={1.4} color="#BE4C00" phase={4} />
      <FloatingOrb position={[-0.7, -1.8, 0.3]} size={0.065} speed={0.6} color="#B600A8" phase={1} />
      <FloatingOrb position={[2.1, -1.0, -0.5]} size={0.04} speed={1.7} color="#7621B0" phase={3} />
    </group>
  );
}

const Avatar3D = () => (
  <Canvas
    camera={{ position: [0, 0, 5.5], fov: 38 }}
    gl={{ antialias: true, alpha: true }}
    style={{ background: "transparent" }}
  >
    <ambientLight intensity={0.25} />
    <pointLight position={[4, 3, 3]}  color="#B600A8" intensity={4} />
    <pointLight position={[-3, -2, 2]} color="#7621B0" intensity={3} />
    <pointLight position={[0, 3, -3]} color="#ffffff"  intensity={0.8} />
    <pointLight position={[0, -3, 0]} color="#BE4C00"  intensity={1.5} />
    <Suspense fallback={null}>
      <Scene />
      <Environment preset="night" />
    </Suspense>
  </Canvas>
);

export default Avatar3D;
