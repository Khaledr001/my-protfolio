import { Suspense, lazy } from "react";
import { useInView } from "@/utils/useInView";

const Spline = lazy(() => import("@splinetool/react-spline"));

export function SplineScene({ scene, className }) {
  // Mount the heavy WebGL scene only while near the viewport; unmounting when
  // scrolled far away frees its continuous render loop.
  const [ref, inView] = useInView({ rootMargin: "400px" });

  return (
    <div ref={ref} className={className}>
      {inView ? (
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <span className="loader"></span>
            </div>
          }
        >
          <Spline scene={scene} className="h-full w-full" />
        </Suspense>
      ) : (
        <div className="h-full w-full" />
      )}
    </div>
  );
}
