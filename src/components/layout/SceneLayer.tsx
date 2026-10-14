import { Component, lazy, memo, Suspense, useState, type ReactNode } from "react";

import { hasWebGL } from "@/three/capabilities";
import { cn } from "@/lib/utils";
import { StaticBackdrop } from "./StaticBackdrop";

// three.js, R3F and drei load in their own chunk, after the page is usable.
const PortfolioCanvas = lazy(() => import("@/three/PortfolioCanvas"));

interface BoundaryProps {
  children: ReactNode;
  onError: () => void;
}

/** If anything in the 3D scene throws, drop it and keep the static backdrop. */
class SceneErrorBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("3D scene disabled:", error);
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The fixed, decorative layer behind all home-page content. Memoised: it has
 * no props, so navigation state changes never re-render the canvas.
 */
export const SceneLayer = memo(function SceneLayer() {
  const [supported] = useState(hasWebGL);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const live = supported && !failed;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <StaticBackdrop
        className={cn(
          "transition-opacity duration-[1400ms]",
          live && ready ? "opacity-0" : "opacity-100",
        )}
      />
      {live && (
        <SceneErrorBoundary onError={() => setFailed(true)}>
          <Suspense fallback={null}>
            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-[1400ms] ease-out",
                ready ? "opacity-100" : "opacity-0",
              )}
            >
              <PortfolioCanvas onReady={() => setReady(true)} />
            </div>
          </Suspense>
        </SceneErrorBoundary>
      )}
      <div className="scene-scrim absolute inset-0" />
    </div>
  );
});
