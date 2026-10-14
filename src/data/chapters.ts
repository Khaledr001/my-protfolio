// The six scenes of the scroll story. `id` is the DOM id of each <section>,
// and the array index is the scene's "stage" in the 3D timeline.
export const chapters = [
  { id: "top", number: "01", name: "The signal", nav: "Home" },
  { id: "about", number: "02", name: "The engineer", nav: "About" },
  { id: "work", number: "03", name: "The systems", nav: "Work" },
  { id: "stack", number: "04", name: "The architecture", nav: "Stack" },
  { id: "journey", number: "05", name: "The journey", nav: "Experience" },
  { id: "contact", number: "06", name: "The invitation", nav: "Contact" },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];
