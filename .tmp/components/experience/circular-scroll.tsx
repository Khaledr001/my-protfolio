"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getStrapiMediaUrl } from "@/lib/api/client";
import type { ExperienceStep } from "@/lib/types/strapi";
import Link from "next/link";

interface CircularScrollProps {
  steps: ExperienceStep[];
}

export function CircularScroll({
  steps,
}: CircularScrollProps): React.ReactElement {
  const count = steps.length;

  // Circle geometry — stable for a given step count
  const startAngle = -90 + 360 / count / 2;
  const arcSpan = 180 - 360 / count;
  const anglePerStep = count > 1 ? arcSpan / (count - 1) : 0;

  const [activeIndex, setActiveIndex] = useState(0);
  // Cumulative rotation so framer-motion always animates in the intended direction.
  // Forward navigation always increases this value; backward always decreases it.
  const [rotation, setRotation] = useState(startAngle);
  const canNavigateRef = useRef(true);
  const activeIndexRef = useRef(0); // shadow of activeIndex readable synchronously

  const navigate = useCallback(
    (direction: 1 | -1) => {
      if (!canNavigateRef.current) return;
      canNavigateRef.current = false;

      const prev = activeIndexRef.current;
      const next = ((prev + direction) % count + count) % count;

      // When wrapping (last→first or first→last) we go the long way around the
      // circle so the dot continues in the same rotational direction.
      const isWrapping =
        (direction === 1 && prev === count - 1) ||
        (direction === -1 && prev === 0);
      const delta = isWrapping
        ? direction * (360 - arcSpan)
        : direction * anglePerStep;

      activeIndexRef.current = next;
      setActiveIndex(next);
      setRotation((r) => r + delta);

      setTimeout(() => {
        canNavigateRef.current = true;
      }, 700);
    },
    [count, arcSpan, anglePerStep],
  );

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      navigate(e.deltaY > 0 ? 1 : -1);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") navigate(-1);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 30) navigate(diff > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [navigate]);

  const activeStep = steps[activeIndex];

  const imageUrl = activeStep?.image
    ? getStrapiMediaUrl(activeStep.image)
    : "";

  return (
    <div className="relative h-screen w-full overflow-hidden bg-neutral-950 pt-7">
      {/* Honeycomb background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='%239C27B0' stroke-width='1'/%3E%3Cpath d='M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34' fill='none' stroke='%239C27B0' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "56px 100px",
        }}
      />

      {/* Purple gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-950/60 via-neutral-950/80 to-neutral-950" />

      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
            {/* Left — Circle with image and menu items */}
            <div className="relative flex items-center justify-center">
              <div className="relative h-100 w-100 xl:h-115 xl:w-115">
                <div className="absolute inset-0 rounded-full border border-white/20" />

                {/* Inner circle with image */}
                <div className="absolute inset-8 overflow-hidden rounded-full border-4 border-purple-600/60">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep?.id ?? "empty"}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                      className="relative h-full w-full">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={activeStep?.title ?? ""}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="h-full w-full bg-purple-900/40" />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-purple-900/40 to-transparent" />
                </div>

                {/* Rotating indicator dot */}
                <motion.div
                  className="absolute left-1/2 top-1/2 h-4 w-4"
                  animate={{ rotate: rotation }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{ transformOrigin: "0 0" }}>
                  <div
                    className="absolute h-4 w-4 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50"
                    style={{ left: "196px", top: "-8px", marginLeft: "-8px" }}
                  />
                </motion.div>

                {/* Menu items around the right arc */}
                {steps.map((step, i) => {
                  const angle = startAngle + i * anglePerStep;
                  const rad = (angle * Math.PI) / 180;
                  const radius = 200;
                  const xOffset = Math.cos(rad) * radius;
                  const yOffset = Math.sin(rad) * radius;

                  return (
                    <div
                      key={step.id}
                      className="absolute left-1/2 top-1/2"
                      style={{
                        transform: `translate(${xOffset + 24}px, ${yOffset - 10}px)`,
                      }}>
                      <motion.button
                        type="button"
                        onClick={() => {
                          activeIndexRef.current = i;
                          setActiveIndex(i);
                          setRotation(startAngle + i * anglePerStep);
                        }}
                        animate={{
                          color:
                            activeIndex === i
                              ? "rgb(255,255,255)"
                              : "rgba(255,255,255,0.5)",
                        }}
                        transition={{ duration: 0.3 }}
                        className="cursor-pointer whitespace-nowrap text-base font-medium tracking-wide hover:text-white"
                        style={{
                          fontFamily: "Georgia, 'Times New Roman', serif",
                        }}>
                        {step.title}
                      </motion.button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right — Active step content */}
            <div className="flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep?.id ?? "empty"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}>
                  <h2
                    className="mb-6 text-5xl font-bold tracking-tight text-white lg:text-6xl xl:text-7xl"
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                    }}>
                    {activeStep?.title}
                  </h2>
                  <p className="mb-8 max-w-lg text-xl leading-relaxed text-white/70">
                    {activeStep?.description}
                  </p>
                  <Link
                    href={activeStep?.ctaUrl ?? "#"}
                    className="inline-block bg-purple-800 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-purple-700">
                    {activeStep?.ctaText ?? "Learn More"}
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg
            width="16"
            height="24"
            viewBox="0 0 16 24"
            fill="none"
            className="text-white/40">
            <path
              d="M8 4L8 20M8 20L14 14M8 20L2 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>

      {/* Progress dots */}
      <div className="absolute right-8 top-1/2 flex -translate-y-1/2 flex-col gap-3">
        {steps.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: activeIndex === i ? 1.4 : 1,
              backgroundColor:
                activeIndex === i
                  ? "rgb(147, 51, 234)"
                  : "rgba(255, 255, 255, 0.2)",
            }}
            transition={{ duration: 0.3 }}
            className="h-2 w-2 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
