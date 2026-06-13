import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether the attached element is within (or near) the viewport.
 * Used to pause expensive work (WebGL render loops, 3D scenes) while off-screen.
 *
 * @param {{ rootMargin?: string, once?: boolean }} options
 * @returns {[React.RefObject<HTMLElement>, boolean]} [ref, inView]
 */
export function useInView({ rootMargin = "200px", once = false } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true); // graceful fallback: render rather than hide
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, once]);

  return [ref, inView];
}
