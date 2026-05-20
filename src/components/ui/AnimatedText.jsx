import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const Char = ({ char, progress, start, end }) => {
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {char}
    </motion.span>
  );
};

const AnimatedText = ({ text, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  const chars = text.split("");

  return (
    <span ref={ref} className={className}>
      {chars.map((char, i) => (
        <Char
          key={i}
          char={char}
          progress={scrollYProgress}
          start={i / chars.length}
          end={Math.min((i + 1) / chars.length, 1)}
        />
      ))}
    </span>
  );
};

export default AnimatedText;
