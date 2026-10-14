// ─────────────────────────────────────────────────────────────────────────────
// How the 3D avatar at the desk looks. These are neutral placeholders — edit
// them so the character resembles you. Colours are any CSS hex value.
// ─────────────────────────────────────────────────────────────────────────────

export type HairStyle = "short" | "buzz" | "curly" | "long" | "none";
export type BeardStyle = "none" | "stubble" | "short" | "full";

export interface AvatarLook {
  skin: string;
  hair: string;
  hairStyle: HairStyle;
  beard: BeardStyle;
  glasses: boolean;
  /** Hoodie / top. */
  top: string;
  pants: string;
  shoes: string;
}

export const avatarLook: AvatarLook = {
  skin: "#c68e68",
  hair: "#1d1612",
  hairStyle: "short",
  beard: "none",
  glasses: false,
  top: "#2c3a56",
  pants: "#1b2030",
  shoes: "#3b4150",
};
