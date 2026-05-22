/**
 * Ripple-navigate: expands a circle from (x, y) to cover the screen,
 * navigates, then fades the overlay out revealing the new page.
 * Matches the pattern from .tmp/news/NewsClient.tsx.
 */
export function rippleNavigate(navigate, x, y, path, afterNavigate) {
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    zIndex: "9999",
    background: "#050816",
    pointerEvents: "none",
    clipPath: `circle(0px at ${x}px ${y}px)`,
  });
  document.body.appendChild(overlay);

  const expand = overlay.animate(
    [
      { clipPath: `circle(0px at ${x}px ${y}px)` },
      { clipPath: `circle(200vmax at ${x}px ${y}px)` },
    ],
    { duration: 550, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" }
  );

  navigate(path);
  afterNavigate?.();

  expand.addEventListener("finish", () => {
    overlay
      .animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 220,
        fill: "forwards",
      })
      .addEventListener("finish", () => overlay.remove());
  });
}
