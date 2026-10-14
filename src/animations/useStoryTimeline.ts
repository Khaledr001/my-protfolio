import { useLayoutEffect, useState, type RefObject } from "react";

import { chapters } from "@/data/chapters";
import { gsap, ScrollTrigger } from "./gsap";
import { notifyStory, story } from "./story";

const sum = (values: number[]) => values.reduce((total, v) => total + v, 0);

/**
 * How much to dim the 3D scene in each chapter: light in the hero and
 * contact, stronger where there is a lot of copy to read.
 */
const SCENE_DIM = [0, 0.22, 0.32, 0.24, 0.32, 0.04];

function applySceneDim(stage: number) {
  const i = Math.min(Math.floor(stage), SCENE_DIM.length - 1);
  const next = SCENE_DIM[Math.min(i + 1, SCENE_DIM.length - 1)];
  const value = SCENE_DIM[i] + (next - SCENE_DIM[i]) * (stage - i);
  document.documentElement.style.setProperty("--scene-dim", value.toFixed(3));
}

/**
 * Turns a list of elements into one continuous index: each element after the
 * first adds 0 → 1 as it scrolls from `start` to `end`. Returns a cleanup-free
 * setup (triggers live inside the caller's gsap.context).
 */
function trackSequence(
  elements: Element[],
  start: string,
  end: string,
  write: (value: number) => void,
) {
  const progress = new Array(Math.max(elements.length - 1, 0)).fill(0);
  elements.slice(1).forEach((element, i) => {
    const update = (self: ScrollTrigger) => {
      progress[i] = self.progress;
      write(sum(progress));
      notifyStory();
    };
    ScrollTrigger.create({
      trigger: element,
      start,
      end,
      onUpdate: update,
      onRefresh: update,
    });
  });
}

/**
 * The narrative timeline. One set of ScrollTriggers derives:
 *  - `story.stage`: which scene the 3D world should be in (continuous),
 *  - `story.work`: which project is being read (continuous),
 *  - the active chapter (for navigation), and the page progress bar.
 *
 * Everything is tied to scroll position: no timers drive scene changes.
 */
export function useStoryTimeline(
  rootRef: RefObject<HTMLElement>,
  progressRef: RefObject<HTMLElement>,
) {
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const sections = chapters
        .map((chapter) => document.getElementById(chapter.id))
        .filter((el): el is HTMLElement => el !== null);

      // Scene transitions happen while the next section rises into view.
      trackSequence(sections, "top bottom", "top 25%", (value) => {
        story.stage = value;
        applySceneDim(value);
      });

      trackSequence(
        gsap.utils.toArray<Element>("[data-work-item]", root),
        "top 75%",
        "top 25%",
        (value) => {
          story.work = value;
        },
      );

      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) setActive(index);
          },
        });
      });

      const bar = progressRef.current;
      if (bar) {
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            bar.style.transform = `scaleX(${self.progress.toFixed(4)})`;
          },
        });
      }
    }, root);

    // Layout shifts once web fonts and images arrive; re-measure then.
    let cancelled = false;
    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      cancelled = true;
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [rootRef, progressRef]);

  return active;
}
