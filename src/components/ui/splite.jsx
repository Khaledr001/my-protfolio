import { Suspense, lazy, useEffect, useRef } from "react";
import { useInView } from "@/utils/useInView";

const Spline = lazy(() => import("@splinetool/react-spline"));

export function SplineScene({ scene, className }) {
  // Load eagerly and keep mounted (so it never re-fetches the scene); just
  // pause/resume the render loop based on visibility to save CPU/GPU.
  const [ref, inView] = useInView({ rootMargin: "300px" });
  const appRef = useRef(null);

  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    if (inView) app.play?.();
    else app.stop?.();
  }, [inView]);

  return (
    <div ref={ref} className={className}>
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <span className="loader"></span>
          </div>
        }
      >
        <Spline
          scene={scene}
          className="h-full w-full"
          onLoad={(app) => {
            appRef.current = app;
            if (!inView) app.stop?.();
            // Tell the splash screen the 3D scene is ready to reveal.
            window.__splineLoaded = true;
            window.dispatchEvent(new Event("spline:loaded"));
          }}
        />
      </Suspense>
    </div>
  );
}
