# Syed Khaled Hossain — Portfolio

A scroll-driven 3D portfolio: one persistent React Three Fiber canvas behind
semantic HTML, choreographed by GSAP ScrollTrigger across six scenes. The
scene is a procedurally built late-night developer desk (live-typing editor,
code review on the laptop, coffee with steam, desk lamp, city window) that the
camera explores as you scroll.

## Stack

Vite · React 18 · TypeScript · Three.js / React Three Fiber / Drei · GSAP +
ScrollTrigger · Tailwind CSS. Deployed on Netlify (`public/_redirects` handles
SPA routes).

## Commands

```bash
pnpm install
pnpm dev         # local dev server
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint
pnpm build       # production build → dist/
pnpm preview     # serve the build
pnpm check       # typecheck + lint + build
```

Add `?no3d` to the URL to preview the no-WebGL fallback.

## Where things live

| Path | What |
| --- | --- |
| `src/data/` | All content: profile, projects, experience, skills, chapters |
| `src/components/sections/` | One component per scene of the story |
| `src/components/visuals/` | Project architecture diagrams and the depth panel |
| `src/three/workspace/` | The desk: room, devices, props, floating UI cards, screen content |
| `src/three/workspace/codeContent.ts` | The code shown on the monitor and laptop |
| `src/three/stages.ts` | Camera shot for each scene |
| `src/three/avatar/` | The seated developer: rig (IK arms, hands, face, chair) and one gesture per chapter |
| `src/data/avatar.ts` | The avatar's look: skin, hair, beard, glasses, clothes |
| `src/animations/` | Scroll orchestration (story store, ScrollTrigger hooks) |

Scroll position → `story` (in `src/animations/story.ts`) → the scene eases toward
it every frame. No React re-renders happen on scroll.

The contact form uses EmailJS and only renders when the
`VITE_APP_EMAILJS_*` variables in `.env` are set.
