import { Suspense, lazy, useEffect, useRef } from "react";
import { useInView } from "@/utils/useInView";

const Spline = lazy(() => import("@splinetool/react-spline"));

export function SplineScene({ scene, className }) {
  // Load eagerly and keep mounted (so it never re-fetches the scene); just
  // pause/resume the render loop based on visibility to save CPU/GPU.
  const [ref, inView] = useInView({ rootMargin: "300px" });
  const appRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    if (inView) app.play?.();
    else app.stop?.();
  }, [inView]);

  // Make the 3D scene track the cursor across the whole page (not just over the
  // canvas) by forwarding pointer movement to the canvas when the cursor is
  // outside it. rAF-throttled and only active while the scene is in view.
  useEffect(() => {
    if (!inView) return;
    const wrapper = ref.current;
    if (!wrapper || typeof PointerEvent === "undefined") return;

    let frame = null;
    let x = 0;
    let y = 0;

    const flush = () => {
      frame = null;
      const canvas =
        canvasRef.current ?? (canvasRef.current = wrapper.querySelector("canvas"));
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      // Spline already handles movement when the cursor is over the canvas.
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return;
      const opts = { clientX: x, clientY: y, bubbles: true, cancelable: true };
      canvas.dispatchEvent(new PointerEvent("pointermove", opts));
      canvas.dispatchEvent(new MouseEvent("mousemove", opts));
    };

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(flush);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [inView, ref]);

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
