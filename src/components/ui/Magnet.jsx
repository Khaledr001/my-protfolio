import { useRef, useState } from "react";

const Magnet = ({ children, padding = 150, strength = 3 }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < padding) {
      setPos({ x: dx / strength, y: dy / strength });
    } else {
      setPos({ x: 0, y: 0 });
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: "transform 0.3s ease",
        display: "inline-block",
      }}
    >
      {children}
    </div>
  );
};

export default Magnet;
