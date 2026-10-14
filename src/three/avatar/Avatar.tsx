import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { avatarLook } from "@/data/avatar";
import { frame } from "../frame";
import { stageWeight } from "../stages";
import { MUG_GRIP, MUG_SCALE, SPOT, type V3 } from "../workspace/layout";
import { chapterPoses, sipAmount, type PoseContext } from "./poses";
import { AvatarRig, blendPose, createPose } from "./rig";

/** The rig is modelled in real metres; the desk is built ~1.4× larger. */
export const AVATAR_SCALE = 1.4;

const UP = new THREE.Vector3(0, 1, 0);

/**
 * The developer at the desk. Each chapter of the story has its own gesture
 * (see ./poses.ts); scrolling blends between neighbouring gestures, and the
 * coffee mug is handed between the desk and the left hand.
 */
export function Avatar({ shadows }: { shadows: boolean }) {
  const camera = useThree((state) => state.camera);
  const rig = useMemo(() => new AvatarRig(avatarLook, shadows), [shadows]);

  const keyLight = useMemo(() => {
    const light = new THREE.SpotLight("#ffd9b0", 0, 14, 0.26, 1, 2);
    light.target.position.set(SPOT.avatar[0], 0.45, SPOT.avatar[2]);
    return light;
  }, []);
  useEffect(() => () => keyLight.dispose(), [keyLight]);

  useEffect(() => {
    rig.root.position.set(SPOT.avatar[0], SPOT.floorY, SPOT.avatar[2]);
    rig.root.scale.setScalar(AVATAR_SCALE);
    return () => rig.dispose();
  }, [rig]);

  const scratch = useMemo(
    () => ({
      a: createPose(),
      b: createPose(),
      out: createPose(),
      extra: createPose(),
      camera: new THREE.Vector3(),
      cameraRoot: new THREE.Vector3(),
      deskMug: new THREE.Vector3(...SPOT.mug),
      held: new THREE.Vector3(),
      heldQ: new THREE.Quaternion(),
      tiltQ: new THREE.Quaternion(),
      axis: new THREE.Vector3(),
      identity: new THREE.Quaternion(),
      lightOffset: new THREE.Vector3(0.6, 0.8, 0.2),
    }),
    [],
  );

  useFrame(() => {
    rig.root.updateMatrixWorld(true);
    const { swivel } = rig;

    scratch.camera.copy(camera.position);
    swivel.worldToLocal(scratch.camera);
    scratch.cameraRoot.copy(camera.position);
    rig.root.worldToLocal(scratch.cameraRoot);

    const ctx: PoseContext = {
      time: frame.time,
      local: (world: V3) => swivel.worldToLocal(new THREE.Vector3(...world)),
      camera: scratch.camera,
      yawToCamera: Math.atan2(-scratch.cameraRoot.x, -scratch.cameraRoot.z),
    };

    const last = chapterPoses.length - 1;
    const s = THREE.MathUtils.clamp(frame.stage, 0, last);
    const i0 = Math.floor(s);
    const i1 = Math.min(i0 + 1, last);
    const t = THREE.MathUtils.smoothstep(s - i0, 0, 1);

    chapterPoses[i0](ctx, scratch.a, scratch.extra);
    if (t > 1e-3 && i1 !== i0) {
      chapterPoses[i1](ctx, scratch.b, scratch.extra);
      blendPose(scratch.out, scratch.a, scratch.b, t);
    } else {
      blendPose(scratch.out, scratch.a, scratch.a, 0);
    }
    rig.update(scratch.out);

    keyLight.position.copy(camera.position).add(scratch.lightOffset);
    keyLight.intensity = 26 * frame.power;

    // Coffee: on the desk, or in the left hand while the About chapter plays.
    const hold = THREE.MathUtils.smoothstep(stageWeight(s, 1), 0.72, 0.95);
    if (hold > 0) {
      const sip = sipAmount(frame.time) * hold;
      swivel.getWorldQuaternion(scratch.heldQ);
      // Tip the rim toward the mouth while drinking.
      scratch.axis.set(1, 0, 0.6).applyQuaternion(scratch.heldQ);
      scratch.axis.crossVectors(UP, scratch.axis).normalize();
      scratch.tiltQ.setFromAxisAngle(scratch.axis, sip * 0.75);
      scratch.heldQ.premultiply(scratch.tiltQ);
      scratch.held
        .set(MUG_GRIP[0], MUG_GRIP[1], MUG_GRIP[2])
        .multiplyScalar(MUG_SCALE)
        .applyQuaternion(scratch.heldQ);
      scratch.held.subVectors(rig.leftGrip, scratch.held);
      frame.mugPosition.lerpVectors(scratch.deskMug, scratch.held, hold);
      frame.mugQuaternion.slerpQuaternions(scratch.identity, scratch.heldQ, hold);
    } else {
      frame.mugPosition.copy(scratch.deskMug);
      frame.mugQuaternion.identity();
    }
  });

  return (
    <>
      <primitive object={rig.root} />
      <primitive object={keyLight} />
      <primitive object={keyLight.target} />
    </>
  );
}
