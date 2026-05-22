import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Decal, Float, OrbitControls, Preload, useTexture } from "@react-three/drei";
import CanvasLoader from "../Loader";

const COLS = 4;
const SPACING = 5.5; // must exceed ball diameter (scale 2.0 × 2 = 4) to avoid overlap

// Plain mesh — no canvas; shares the parent canvas's render loop
const BallMesh = ({ imgUrl }) => {
  const [decal] = useTexture([imgUrl]);
  return (
    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1}>
      <mesh scale={2.0}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#fff8eb"
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={1}
          map={decal}
          flatShading
        />
      </mesh>
    </Float>
  );
};

// One canvas for ALL balls — 1 WebGL context + 1 render loop instead of N each
const BallCanvas = ({ technologies }) => {
  const rows = Math.ceil(technologies.length / COLS);

  const positions = useMemo(
    () =>
      technologies.map((_, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const colCount = Math.min(COLS, technologies.length);
        const xStart = -((colCount - 1) * SPACING) / 2;
        return [xStart + col * SPACING, -row * SPACING, 0];
      }),
    [technologies]
  );

  const camY = -((rows - 1) * SPACING) / 2;
  const canvasHeight = rows === 1 ? 220 : rows * 210;

  return (
    <Canvas
      frameloop="always"
      dpr={[1, 1.5]}
      camera={{ position: [0, camY, 16], fov: 50 }}
      gl={{ antialias: false, alpha: true }}
      style={{ height: canvasHeight, width: "100%" }}
    >
      <ambientLight intensity={0.3} decay={0} />
      <directionalLight position={[0, 0, 0.05]} />
      <Suspense fallback={<CanvasLoader />}>
        {technologies.map((tech, i) => (
          <group key={tech.name} position={positions[i]}>
            <BallMesh imgUrl={tech.icon} />
          </group>
        ))}
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default BallCanvas;
