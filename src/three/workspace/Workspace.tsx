import type { Quality } from "../capabilities";
import { CoffeeMug, DeskLamp, Notebook, Plant } from "./Props";
import { Keyboard, Laptop, Monitor } from "./Devices";
import { FloatingPanels } from "./FloatingPanels";
import { Room } from "./Room";

interface WorkspaceProps {
  quality: Quality;
  shadows: boolean;
}

/** A late-night developer desk, built entirely from procedural geometry. */
export function Workspace({ quality, shadows }: WorkspaceProps) {
  return (
    <group>
      <Room shadows={shadows} />
      <Monitor quality={quality} shadows={shadows} />
      <Laptop quality={quality} shadows={shadows} />
      <Keyboard shadows={shadows} />
      <CoffeeMug shadows={shadows} />
      <DeskLamp shadows={shadows} />
      <Plant shadows={shadows} />
      <Notebook shadows={shadows} />
      <FloatingPanels quality={quality} />
    </group>
  );
}
