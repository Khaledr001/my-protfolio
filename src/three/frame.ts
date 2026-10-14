import { createFrameState } from "./stages";

/**
 * The single interpolated scene state for the one persistent canvas. Written
 * once per frame by <SceneDirector/> (which renders first) and read by every
 * other scene component in their own useFrame callbacks.
 */
export const frame = createFrameState();
