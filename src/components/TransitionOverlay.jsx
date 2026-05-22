import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePageTransition } from "../context/PageTransition";

const TransitionOverlay = () => {
  const { pending, clear } = usePageTransition();
  const navigate = useNavigate();

  const [phase, setPhase] = useState("idle"); // "idle" | "expanding" | "fading"
  const dataRef = useRef({ x: 0, y: 0, path: "/", scrollToId: null });

  useEffect(() => {
    if (!pending || phase !== "idle") return;
    dataRef.current = {
      x: pending.x,
      y: pending.y,
      path: pending.path,
      scrollToId: pending.scrollToId,
    };
    clear();
    setPhase("expanding");
  }, [pending, phase]);

  const handleAnimationComplete = () => {
    if (phase === "expanding") {
      const { path, scrollToId } = dataRef.current;
      navigate(path);
      if (scrollToId) {
        setTimeout(() => {
          document.getElementById(scrollToId)?.scrollIntoView({ behavior: "instant" });
        }, 10);
      }
      setPhase("fading");
    } else if (phase === "fading") {
      setPhase("idle");
    }
  };

  if (phase === "idle") return null;

  const { x, y } = dataRef.current;

  return (
    <motion.div
      initial={{ clipPath: `circle(0px at ${x}px ${y}px)`, opacity: 1 }}
      animate={
        phase === "expanding"
          ? { clipPath: `circle(200vmax at ${x}px ${y}px)`, opacity: 1 }
          : { opacity: 0 }
      }
      transition={
        phase === "expanding"
          ? { duration: 0.55, ease: [0.76, 0, 0.24, 1] }
          : { duration: 0.35, ease: "easeOut" }
      }
      onAnimationComplete={handleAnimationComplete}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        backgroundColor: "#050816",
        pointerEvents: "all",
      }}
    />
  );
};

export default TransitionOverlay;
