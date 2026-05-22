import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Dot — follows cursor closely
  const dotX = useSpring(mouseX, { damping: 40, stiffness: 500 });
  const dotY = useSpring(mouseY, { damping: 40, stiffness: 500 });

  // Ring — lags behind
  const ringX = useSpring(mouseX, { damping: 28, stiffness: 120 });
  const ringY = useSpring(mouseY, { damping: 28, stiffness: 120 });

  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Ring — slow trailer */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.6)",
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          pointerEvents: "none",
          zIndex: 99999,
        }}
      />

      {/* Dot — fast, stays close to cursor */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 5,
          height: 5,
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.85)",
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          pointerEvents: "none",
          zIndex: 99999,
        }}
      />
    </>
  );
};

export default CustomCursor;
