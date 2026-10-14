import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { frame } from "./frame";

interface CameraRigProps {
  /** Pointer parallax strength in world units (0 disables it). */
  parallax: number;
}

/**
 * Places the camera from the interpolated shot, adds subtle pointer parallax,
 * and applies the shot's lens shift so the desk can sit beside the text.
 */
export function CameraRig({ parallax }: CameraRigProps) {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);
  const position = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => () => camera.clearViewOffset(), [camera]);

  useFrame(() => {
    position.copy(frame.cameraPosition);
    // Parallax along the camera's own right/up axes.
    right.setFromMatrixColumn(camera.matrixWorld, 0);
    position.addScaledVector(right, frame.pointer.x * parallax);
    position.y += frame.pointer.y * parallax * 0.5;
    // A slow dolly-in during the intro.
    position.multiplyScalar(1 + (1 - frame.power) * 0.12);

    camera.position.copy(position);
    camera.lookAt(frame.cameraTarget);

    const { width, height } = size;
    camera.setViewOffset(
      width,
      height,
      (-frame.viewShift.x * width) / 2,
      (frame.viewShift.y * height) / 2,
      width,
      height,
    );
  });

  return null;
}
