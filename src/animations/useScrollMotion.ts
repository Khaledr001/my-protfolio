import { useLayoutEffect, type RefObject } from "react";

import { FULL_MOTION, gsap } from "./gsap";

/**
 * Runs `build` inside a gsap.matchMedia scoped to `scope`, only when the user
 * has not asked for reduced motion. All tweens and ScrollTriggers created in
 * `build` are reverted on unmount (and StrictMode's double-invoke), so there
 * are no duplicate triggers or leaked listeners.
 *
 * Initial hidden states must be set from inside `build` (never in CSS), so
 * that content stays visible if JavaScript or the animation fails.
 */
export function useScrollMotion(
  scope: RefObject<HTMLElement>,
  build: (helpers: { isDesktop: boolean }) => void,
) {
  useLayoutEffect(() => {
    const element = scope.current;
    if (!element) return;

    const mm = gsap.matchMedia(element);
    mm.add(
      {
        motion: FULL_MOTION,
        isDesktop: "(min-width: 1024px)",
      },
      (context) => {
        const { motion, isDesktop } = context.conditions as {
          motion: boolean;
          isDesktop: boolean;
        };
        if (!motion) return;
        build({ isDesktop });
      },
    );

    return () => mm.revert();
    // `build` is defined inline by callers; the scope is the real dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);
}

/**
 * The shared reveal vocabulary used by every section:
 *  - [data-reveal]        fade + rise as the element enters
 *  - [data-reveal-lines]  masked line-by-line headline reveal
 */
export function revealIn(scope: Element) {
  const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", scope);
  items.forEach((item) => {
    gsap.fromTo(
      item,
      { autoAlpha: 0, y: 36 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        ease: "expo.out",
        delay: Number(item.dataset.revealDelay ?? 0),
        scrollTrigger: { trigger: item, start: "top 88%", once: true },
      },
    );
  });

  gsap.utils.toArray<HTMLElement>("[data-reveal-lines]", scope).forEach((block) => {
    const lines = block.querySelectorAll(".line-mask > span");
    gsap.fromTo(
      lines,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 1.25,
        ease: "expo.out",
        stagger: 0.09,
        scrollTrigger: { trigger: block, start: "top 85%", once: true },
      },
    );
  });
}
