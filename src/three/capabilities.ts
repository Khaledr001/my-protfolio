export type Quality = "high" | "low";

/** True when the browser can create a WebGL context. */
export function hasWebGL(): boolean {
  try {
    if (new URLSearchParams(window.location.search).has("no3d")) return false;
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

/**
 * A coarse device tier. Touch devices, small screens and machines reporting
 * few cores or little memory get fewer particles, nodes and pixels.
 */
export function detectQuality(): Quality {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  return coarse || small || cores <= 4 || memory <= 4 ? "low" : "high";
}
