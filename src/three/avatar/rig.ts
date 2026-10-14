import * as THREE from "three";

import type { AvatarLook } from "@/data/avatar";

// ─────────────────────────────────────────────────────────────────────────────
// A stylised seated character built from primitives, posed every frame from
// joint positions (no skinned mesh, no downloaded model). Units are real
// metres in "body space": origin on the floor under the seat, +y up, the
// character faces −z. The whole rig is scaled up to match the desk.
// ─────────────────────────────────────────────────────────────────────────────

export interface HandPose {
  /** Wrist position, body space. */
  target: THREE.Vector3;
  /** Direction the fingers point. */
  fingers: THREE.Vector3;
  /** Direction the palm faces. */
  palm: THREE.Vector3;
  /** Elbow hint for the IK solve. */
  pole: THREE.Vector3;
  curl: number;
  index: number;
  thumb: number;
}

export interface Pose {
  yaw: number;
  lean: number;
  twist: number;
  tilt: number;
  recline: number;
  /** Where the head looks, body space. */
  look: THREE.Vector3;
  left: HandPose;
  right: HandPose;
  smile: number;
}

export const createHandPose = (): HandPose => ({
  target: new THREE.Vector3(),
  fingers: new THREE.Vector3(0, 0, -1),
  palm: new THREE.Vector3(0, -1, 0),
  pole: new THREE.Vector3(0, -1, 0),
  curl: 0.3,
  index: 0.3,
  thumb: 0.2,
});

export const createPose = (): Pose => ({
  yaw: 0,
  lean: 0,
  twist: 0,
  tilt: 0,
  recline: 0,
  look: new THREE.Vector3(0, 1.1, -1),
  left: createHandPose(),
  right: createHandPose(),
  smile: 0.3,
});

const mix = THREE.MathUtils.lerp;

function blendHand(out: HandPose, a: HandPose, b: HandPose, t: number) {
  out.target.lerpVectors(a.target, b.target, t);
  out.fingers.lerpVectors(a.fingers, b.fingers, t).normalize();
  out.palm.lerpVectors(a.palm, b.palm, t).normalize();
  out.pole.lerpVectors(a.pole, b.pole, t).normalize();
  out.curl = mix(a.curl, b.curl, t);
  out.index = mix(a.index, b.index, t);
  out.thumb = mix(a.thumb, b.thumb, t);
}

/** out = mix(a, b, t). `out` may alias `a`. */
export function blendPose(out: Pose, a: Pose, b: Pose, t: number) {
  out.yaw = mix(a.yaw, b.yaw, t);
  out.lean = mix(a.lean, b.lean, t);
  out.twist = mix(a.twist, b.twist, t);
  out.tilt = mix(a.tilt, b.tilt, t);
  out.recline = mix(a.recline, b.recline, t);
  out.look.lerpVectors(a.look, b.look, t);
  out.smile = mix(a.smile, b.smile, t);
  blendHand(out.left, a.left, b.left, t);
  blendHand(out.right, a.right, b.right, t);
}

// ── Body measurements (body space, metres) ──────────────────────────────────

export const BODY = {
  pelvis: new THREE.Vector3(0, 0.56, 0.02),
  shoulderOffset: 0.19,
  shoulderHeight: 0.44,
  neckHeight: 0.5,
  headRadius: 0.125,
  upperArm: 0.28,
  forearm: 0.27,
} as const;

/** Upper-body rotation for a lean / twist / tilt. */
export function upperBodyQuaternion(lean: number, twist: number, tilt: number, out = new THREE.Quaternion()) {
  return out.setFromEuler(new THREE.Euler(-lean, twist, tilt, "YXZ"));
}

/** Approximate head centre for a pose (used by gestures that touch the head). */
export function headCentre(lean: number, twist: number, tilt: number, out = new THREE.Vector3()) {
  const q = upperBodyQuaternion(lean, twist, tilt);
  return out.set(0, BODY.neckHeight + BODY.headRadius, 0).applyQuaternion(q).add(BODY.pelvis);
}

export function shoulder(side: 1 | -1, lean: number, twist: number, tilt: number, out = new THREE.Vector3()) {
  const q = upperBodyQuaternion(lean, twist, tilt);
  return out.set(side * BODY.shoulderOffset, BODY.shoulderHeight, 0).applyQuaternion(q).add(BODY.pelvis);
}

// ── Geometry helpers ────────────────────────────────────────────────────────

const Y_AXIS = new THREE.Vector3(0, 1, 0);

/** Places a unit cylinder (radius 1, height 1, along y) between a and b. */
function placeSegment(mesh: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, radius: number) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const length = Math.max(dir.length(), 1e-4);
  mesh.position.copy(a).addScaledVector(dir, 0.5);
  mesh.quaternion.setFromUnitVectors(Y_AXIS, dir.divideScalar(length));
  mesh.scale.set(radius, length, radius);
}

/** Two-bone IK: returns the elbow for shoulder s reaching toward t. */
function solveElbow(s: THREE.Vector3, t: THREE.Vector3, a: number, b: number, pole: THREE.Vector3, out: THREE.Vector3) {
  const toTarget = new THREE.Vector3().subVectors(t, s);
  const d = THREE.MathUtils.clamp(toTarget.length(), Math.abs(a - b) + 1e-3, a + b - 1e-3);
  const n = toTarget.normalize();
  const cosA = THREE.MathUtils.clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1);
  const sinA = Math.sqrt(1 - cosA * cosA);
  const m = pole.clone().addScaledVector(n, -pole.dot(n));
  if (m.lengthSq() < 1e-6) m.set(0, -1, 0);
  m.normalize();
  return out.copy(s).addScaledVector(n, a * cosA).addScaledVector(m, a * sinA);
}

/** Orientation whose −z follows `fingers` and −y follows `palm`. */
function handQuaternion(fingers: THREE.Vector3, palm: THREE.Vector3, out: THREE.Quaternion) {
  const z = fingers.clone().negate().normalize();
  const y = palm.clone().negate();
  y.addScaledVector(z, -y.dot(z));
  if (y.lengthSq() < 1e-6) y.set(0, 1, 0).addScaledVector(z, -z.y);
  y.normalize();
  const x = new THREE.Vector3().crossVectors(y, z);
  return out.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
}

interface Materials {
  skin: THREE.MeshStandardMaterial;
  skinShade: THREE.MeshStandardMaterial;
  top: THREE.MeshStandardMaterial;
  pants: THREE.MeshStandardMaterial;
  shoes: THREE.MeshStandardMaterial;
  hair: THREE.MeshStandardMaterial;
  beard: THREE.MeshStandardMaterial;
  dark: THREE.MeshStandardMaterial;
  lips: THREE.MeshStandardMaterial;
  frame: THREE.MeshStandardMaterial;
  chair: THREE.MeshStandardMaterial;
  chairMetal: THREE.MeshStandardMaterial;
}

interface Hand {
  root: THREE.Group;
  knuckles: THREE.Group[];
  middles: THREE.Group[];
  thumb: THREE.Group;
  thumbTip: THREE.Group;
  side: 1 | -1;
}

/**
 * Builds the character and chair, and poses them from a {@link Pose}.
 * `root` is placed in the world; `swivel` turns with the chair.
 */
export class AvatarRig {
  readonly root = new THREE.Group();
  readonly swivel = new THREE.Group();
  private readonly geometries: THREE.BufferGeometry[] = [];
  private readonly materials: Materials;
  private readonly unitCylinder: THREE.CylinderGeometry;
  private readonly unitSphere: THREE.SphereGeometry;

  private readonly torso: THREE.Mesh;
  private readonly hood: THREE.Mesh;
  private readonly neck: THREE.Mesh;
  private readonly head = new THREE.Group();
  private readonly mouth: THREE.Mesh;
  private readonly backrest = new THREE.Group();
  private readonly arms: {
    side: 1 | -1;
    shoulderBall: THREE.Mesh;
    upper: THREE.Mesh;
    elbowBall: THREE.Mesh;
    fore: THREE.Mesh;
    hand: Hand;
  }[] = [];

  /** World-space grip point of the left hand (for the coffee mug). */
  readonly leftGrip = new THREE.Vector3();
  readonly leftHandQuaternion = new THREE.Quaternion();

  constructor(look: AvatarLook, shadows: boolean) {
    const std = (color: string, roughness = 0.7, metalness = 0) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness });
    const skinShade = new THREE.Color(look.skin).multiplyScalar(0.85);
    this.materials = {
      skin: std(look.skin, 0.62),
      skinShade: new THREE.MeshStandardMaterial({ color: skinShade, roughness: 0.65 }),
      top: std(look.top, 0.85),
      pants: std(look.pants, 0.9),
      shoes: std(look.shoes, 0.6),
      // Hair and beard are open shells, so render both faces.
      hair: new THREE.MeshStandardMaterial({ color: look.hair, roughness: 0.8, side: THREE.DoubleSide }),
      beard: new THREE.MeshStandardMaterial({
        color: new THREE.Color(look.hair).lerp(new THREE.Color(look.skin), look.beard === "stubble" ? 0.45 : 0),
        roughness: 0.9,
        side: THREE.DoubleSide,
      }),
      dark: std("#141214", 0.3),
      lips: std("#7a3f36", 0.6),
      frame: std("#121418", 0.3, 0.6),
      chair: std("#20242f", 0.85),
      chairMetal: std("#2a2f3a", 0.4, 0.7),
    };

    this.unitCylinder = this.track(new THREE.CylinderGeometry(1, 1, 1, 16));
    this.unitSphere = this.track(new THREE.SphereGeometry(1, 24, 16));

    const mesh = (geometry: THREE.BufferGeometry, material: THREE.Material) => {
      const m = new THREE.Mesh(geometry, material);
      m.castShadow = shadows;
      m.receiveShadow = shadows;
      return m;
    };
    const ball = (radius: number, material: THREE.Material) => {
      const m = mesh(this.unitSphere, material);
      m.scale.setScalar(radius);
      return m;
    };
    const segment = (a: THREE.Vector3, b: THREE.Vector3, radius: number, material: THREE.Material) => {
      const m = mesh(this.unitCylinder, material);
      placeSegment(m, a, b, radius);
      return m;
    };

    this.root.add(this.swivel);

    // ── Chair ───────────────────────────────────────────────────────────────
    const base = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const tip = new THREE.Vector3(Math.cos(angle) * 0.3, 0.05, Math.sin(angle) * 0.3);
      base.add(segment(new THREE.Vector3(0, 0.08, 0), tip, 0.018, this.materials.chairMetal));
      const wheel = ball(0.03, this.materials.chair);
      wheel.position.copy(tip).setY(0.03);
      base.add(wheel);
    }
    base.add(segment(new THREE.Vector3(0, 0.08, 0), new THREE.Vector3(0, 0.42, 0), 0.025, this.materials.chairMetal));
    this.root.add(base);

    const seat = mesh(this.track(new THREE.BoxGeometry(0.5, 0.07, 0.48)), this.materials.chair);
    seat.position.set(0, 0.45, 0.02);
    this.swivel.add(seat);
    this.backrest.position.set(0, 0.5, 0.25);
    const back = mesh(this.track(new THREE.BoxGeometry(0.46, 0.56, 0.06)), this.materials.chair);
    back.position.set(0, 0.36, 0.02);
    this.backrest.add(back);
    this.swivel.add(this.backrest);

    // ── Legs (fixed while seated) ───────────────────────────────────────────
    ([-1, 1] as const).forEach((side) => {
      const hip = new THREE.Vector3(side * 0.1, 0.55, 0.02);
      const knee = new THREE.Vector3(side * 0.12, 0.54, -0.42);
      const ankle = new THREE.Vector3(side * 0.13, 0.1, -0.46);
      this.swivel.add(segment(hip, knee, 0.075, this.materials.pants));
      this.swivel.add(segment(knee, ankle, 0.058, this.materials.pants));
      const kneeBall = ball(0.074, this.materials.pants);
      kneeBall.position.copy(knee);
      this.swivel.add(kneeBall);
      const shoe = mesh(this.track(new THREE.CapsuleGeometry(0.05, 0.14, 6, 12)), this.materials.shoes);
      shoe.rotation.x = Math.PI / 2;
      shoe.scale.set(1, 1, 0.75);
      shoe.position.set(side * 0.13, 0.045, -0.53);
      this.swivel.add(shoe);
    });
    const pelvis = ball(1, this.materials.pants);
    pelvis.scale.set(0.17, 0.1, 0.15);
    pelvis.position.copy(BODY.pelvis);
    this.swivel.add(pelvis);

    // ── Torso, hood, neck ───────────────────────────────────────────────────
    this.torso = mesh(this.track(new THREE.CapsuleGeometry(0.15, 0.24, 8, 20)), this.materials.top);
    this.swivel.add(this.torso);
    this.hood = mesh(this.track(new THREE.TorusGeometry(0.085, 0.04, 10, 24)), this.materials.top);
    this.swivel.add(this.hood);
    this.neck = mesh(this.unitCylinder, this.materials.skin);
    this.swivel.add(this.neck);

    // ── Head ────────────────────────────────────────────────────────────────
    this.buildHead(look, mesh, ball);
    this.swivel.add(this.head);

    // ── Arms and hands ──────────────────────────────────────────────────────
    ([-1, 1] as const).forEach((side) => {
      const arm = {
        side,
        shoulderBall: ball(0.066, this.materials.top),
        upper: mesh(this.unitCylinder, this.materials.top),
        elbowBall: ball(0.052, this.materials.top),
        fore: mesh(this.unitCylinder, this.materials.top),
        hand: this.buildHand(side, mesh),
      };
      this.swivel.add(arm.shoulderBall, arm.upper, arm.elbowBall, arm.fore, arm.hand.root);
      this.arms.push(arm);
    });

    this.mouth = this.head.getObjectByName("mouth") as THREE.Mesh;
  }

  private track<T extends THREE.BufferGeometry>(geometry: T): T {
    this.geometries.push(geometry);
    return geometry;
  }

  private buildHead(
    look: AvatarLook,
    mesh: (g: THREE.BufferGeometry, m: THREE.Material) => THREE.Mesh,
    ball: (r: number, m: THREE.Material) => THREE.Mesh,
  ) {
    const r = BODY.headRadius;
    const skull = ball(1, this.materials.skin);
    skull.scale.set(r * 0.95, r * 1.06, r);
    this.head.add(skull);

    const ears = [-1, 1].map((side) => {
      const ear = ball(1, this.materials.skinShade);
      ear.scale.set(0.016, 0.03, 0.024);
      ear.position.set(side * r * 0.93, 0, 0.01);
      return ear;
    });
    this.head.add(...ears);

    // Face
    [-1, 1].forEach((side) => {
      const eye = ball(0.014, this.materials.dark);
      eye.position.set(side * 0.043, 0.014, -r * 0.92);
      const brow = mesh(this.track(new THREE.BoxGeometry(0.04, 0.009, 0.012)), this.materials.hair);
      brow.position.set(side * 0.044, 0.05, -r * 0.9);
      brow.rotation.z = side * -0.1;
      this.head.add(eye, brow);
    });
    const nose = ball(1, this.materials.skinShade);
    nose.scale.set(0.017, 0.022, 0.02);
    nose.position.set(0, -0.012, -r * 0.98);
    this.head.add(nose);
    const mouth = mesh(this.track(new THREE.TorusGeometry(0.024, 0.0038, 6, 16, Math.PI)), this.materials.lips);
    mouth.name = "mouth";
    mouth.rotation.z = Math.PI;
    mouth.position.set(0, -0.045, -r * 0.92);
    this.head.add(mouth);

    // Hair
    const hairCap = (radius: number, thetaLength: number) =>
      mesh(this.track(new THREE.SphereGeometry(radius, 28, 14, 0, Math.PI * 2, 0, thetaLength)), this.materials.hair);
    if (look.hairStyle !== "none") {
      const thickness = look.hairStyle === "buzz" ? 1.02 : 1.08;
      const cap = hairCap(r * thickness, Math.PI * 0.5);
      cap.scale.set(0.97, 1.06, 1);
      cap.rotation.x = 0.35;
      cap.position.y = 0.005;
      this.head.add(cap);
      const back = mesh(
        this.track(new THREE.SphereGeometry(r * thickness * 0.99, 24, 12, 0, Math.PI, Math.PI * 0.35, Math.PI * 0.4)),
        this.materials.hair,
      );
      back.scale.set(0.97, 1.06, 1);
      this.head.add(back);
      if (look.hairStyle === "curly") {
        const bump = new THREE.SphereGeometry(0.03, 10, 8);
        this.track(bump);
        for (let i = 0; i < 26; i++) {
          const y = 1 - (i / 25) * 0.75;
          const rr = Math.sqrt(1 - y * y);
          const t = i * 2.4;
          const m = mesh(bump, this.materials.hair);
          m.position.set(Math.cos(t) * rr * r * 1.05, y * r * 1.1 + 0.01, Math.sin(t) * rr * r * 1.05 + 0.01);
          this.head.add(m);
        }
      }
      if (look.hairStyle === "long") {
        const drape = mesh(this.track(new THREE.CylinderGeometry(r * 1.02, r * 1.1, 0.2, 24, 1, true, 0, Math.PI)), this.materials.hair);
        drape.position.set(0, -0.09, 0.01);
        this.head.add(drape);
      }
    }

    // Beard: a band over the jaw, front half only.
    if (look.beard !== "none") {
      const size = look.beard === "full" ? 1.08 : look.beard === "short" ? 1.04 : 1.015;
      const beard = mesh(
        this.track(new THREE.SphereGeometry(r * size, 24, 12, Math.PI, Math.PI, Math.PI * 0.55, Math.PI * (look.beard === "full" ? 0.4 : 0.33))),
        this.materials.beard,
      );
      beard.scale.set(0.95, 1.06, 1);
      this.head.add(beard);
    }

    if (look.glasses) {
      [-1, 1].forEach((side) => {
        const lens = mesh(this.track(new THREE.TorusGeometry(0.026, 0.0035, 8, 24)), this.materials.frame);
        lens.position.set(side * 0.044, 0.014, -r * 0.99);
        this.head.add(lens);
      });
      const bridge = mesh(this.track(new THREE.BoxGeometry(0.03, 0.004, 0.004)), this.materials.frame);
      bridge.position.set(0, 0.018, -r * 1.0);
      this.head.add(bridge);
    }
  }

  private buildHand(side: 1 | -1, mesh: (g: THREE.BufferGeometry, m: THREE.Material) => THREE.Mesh): Hand {
    const root = new THREE.Group();
    // Hand space: fingers along −z, palm faces −y, thumb toward −x on the right hand.
    const palm = mesh(this.track(new THREE.BoxGeometry(0.078, 0.026, 0.085)), this.materials.skin);
    palm.position.set(0, 0, -0.04);
    root.add(palm);
    const wrist = mesh(this.unitSphere, this.materials.skin);
    wrist.scale.setScalar(0.03);
    root.add(wrist);

    const phalanx = (length: number) => {
      const g = this.track(new THREE.CapsuleGeometry(0.0095, length, 4, 8));
      g.rotateX(Math.PI / 2).translate(0, 0, -length / 2);
      return mesh(g, this.materials.skin);
    };

    // Index → pinky, from the thumb side outward.
    const lengths: [number, number][] = [
      [0.032, 0.026],
      [0.036, 0.028],
      [0.033, 0.026],
      [0.026, 0.021],
    ];
    const knuckles: THREE.Group[] = [];
    const middles: THREE.Group[] = [];
    lengths.forEach(([l1, l2], i) => {
      const knuckle = new THREE.Group();
      knuckle.position.set(-side * (0.028 - i * 0.0187), 0, -0.082);
      knuckle.add(phalanx(l1));
      const middle = new THREE.Group();
      middle.position.set(0, 0, -l1 - 0.006);
      middle.add(phalanx(l2));
      knuckle.add(middle);
      root.add(knuckle);
      knuckles.push(knuckle);
      middles.push(middle);
    });

    const thumb = new THREE.Group();
    thumb.position.set(-side * 0.036, -0.004, -0.022);
    thumb.add(phalanx(0.03));
    const thumbTip = new THREE.Group();
    thumbTip.position.set(0, 0, -0.036);
    thumbTip.add(phalanx(0.024));
    thumb.add(thumbTip);
    root.add(thumb);

    return { root, knuckles, middles, thumb, thumbTip, side };
  }

  /** Applies `pose` to the rig. */
  update(pose: Pose) {
    this.swivel.rotation.y = pose.yaw;
    this.backrest.rotation.x = 0.1 + pose.recline;

    const q = upperBodyQuaternion(pose.lean, pose.twist, pose.tilt);
    const p = BODY.pelvis;
    const at = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z).applyQuaternion(q).add(p);

    this.torso.position.copy(at(0, 0.25, 0));
    this.torso.quaternion.copy(q);
    this.torso.scale.set(1.22, 1, 0.78);

    const neckBase = at(0, 0.44, 0.01);
    const neckTop = at(0, BODY.neckHeight + 0.02, 0);
    placeSegment(this.neck, neckBase, neckTop, 0.045);
    this.hood.position.copy(at(0, 0.45, 0.05));
    this.hood.quaternion.copy(q).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2 - 0.25));

    // Head: look at the target, but never further than a natural neck turn.
    const headCenter = at(0, BODY.neckHeight + BODY.headRadius, 0);
    const lookMatrix = new THREE.Matrix4().lookAt(headCenter, pose.look, new THREE.Vector3(0, 1, 0));
    const lookQ = new THREE.Quaternion().setFromRotationMatrix(lookMatrix);
    const headQ = q.clone().rotateTowards(lookQ, 1.05);
    this.head.position.copy(headCenter);
    this.head.quaternion.copy(headQ);
    this.mouth.scale.set(1, 0.3 + pose.smile * 0.35, 1);

    // Arms: two-bone IK to each wrist target.
    const elbow = new THREE.Vector3();
    this.arms.forEach((arm) => {
      const hand = arm.side === -1 ? pose.left : pose.right;
      const s = at(arm.side * BODY.shoulderOffset, BODY.shoulderHeight, 0);
      solveElbow(s, hand.target, BODY.upperArm, BODY.forearm, hand.pole, elbow);
      const wrist = new THREE.Vector3()
        .subVectors(hand.target, elbow)
        .normalize()
        .multiplyScalar(BODY.forearm)
        .add(elbow);

      arm.shoulderBall.position.copy(s);
      placeSegment(arm.upper, s, elbow, 0.05);
      arm.elbowBall.position.copy(elbow);
      placeSegment(arm.fore, elbow, wrist, 0.043);

      const h = arm.hand;
      h.root.position.copy(wrist);
      handQuaternion(hand.fingers, hand.palm, h.root.quaternion);
      h.knuckles.forEach((knuckle, i) => {
        const curl = i === 0 ? hand.index : hand.curl;
        knuckle.rotation.x = -curl * 1.35;
        h.middles[i].rotation.x = -curl * 1.55;
      });
      h.thumb.rotation.set(-hand.thumb * 0.5, h.side * (0.75 - hand.thumb * 0.55), 0);
      h.thumbTip.rotation.x = -hand.thumb * 0.9;

      if (arm.side === -1) {
        // Grip point: in front of the curled fingers.
        h.root.updateMatrixWorld();
        this.leftGrip.set(0, -0.03, -0.075).applyMatrix4(h.root.matrixWorld);
        h.root.getWorldQuaternion(this.leftHandQuaternion);
      }
    });
  }

  dispose() {
    this.geometries.forEach((g) => g.dispose());
    Object.values(this.materials).forEach((m) => m.dispose());
  }
}
