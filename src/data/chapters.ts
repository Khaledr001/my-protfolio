// The chapters of the page, in order. `id` is the DOM id of each <section>.
// `scene` is the chapter's stage in the 3D timeline; sections with no scene
// (Services) are full-width paper pages that cover the canvas, and the 3D
// simply holds its previous shot while they scroll past.
export const chapters = [
  { id: "top", number: "01", name: "The signal", nav: "Home", scene: 0 },
  { id: "about", number: "02", name: "The engineer", nav: "About", scene: 1 },
  { id: "services", number: "03", name: "The offer", nav: "Services", scene: null },
  { id: "work", number: "04", name: "The systems", nav: "Work", scene: 2 },
  { id: "stack", number: "05", name: "The architecture", nav: "Stack", scene: 3 },
  { id: "journey", number: "06", name: "The journey", nav: "Experience", scene: 4 },
  { id: "contact", number: "07", name: "The invitation", nav: "Contact", scene: 5 },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];

/** Chapters that drive the 3D camera, in stage order. */
export const sceneChapters = chapters.filter((chapter) => chapter.scene !== null);
