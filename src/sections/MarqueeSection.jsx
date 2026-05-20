import { useRef, useEffect, useState } from "react";

const ROW1 = [
  "BACKEND", "NESTJS", "NODEJS", "REACT", "TYPESCRIPT", "MONGODB",
  "BACKEND", "NESTJS", "NODEJS", "REACT", "TYPESCRIPT", "MONGODB",
];
const ROW2 = [
  "FULLSTACK", "POSTGRESQL", "REST API", "SOCKET.IO", "TAILWIND", "EXPRESS",
  "FULLSTACK", "POSTGRESQL", "REST API", "SOCKET.IO", "TAILWIND", "EXPRESS",
];

const MarqueeSection = () => {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const o = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(o);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={ref}
      className="py-14 overflow-hidden border-t border-b border-white/5 select-none"
    >
      <div
        className="flex gap-8 mb-5 whitespace-nowrap"
        style={{
          transform: `translateX(${offset - 200}px)`,
          willChange: "transform",
        }}
      >
        {ROW1.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-8">
            <span className="text-[42px] md:text-[56px] font-black text-white/[0.07] uppercase tracking-widest">
              {item}
            </span>
            <span className="text-[42px] md:text-[56px] font-black text-white/[0.04]">
              •
            </span>
          </span>
        ))}
      </div>
      <div
        className="flex gap-8 whitespace-nowrap"
        style={{
          transform: `translateX(${-(offset - 200)}px)`,
          willChange: "transform",
        }}
      >
        {ROW2.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-8">
            <span className="text-[42px] md:text-[56px] font-black text-white/[0.07] uppercase tracking-widest">
              {item}
            </span>
            <span className="text-[42px] md:text-[56px] font-black text-white/[0.04]">
              •
            </span>
          </span>
        ))}
      </div>
    </section>
  );
};

export default MarqueeSection;
