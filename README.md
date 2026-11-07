# Eason Gan · Portfolio

Multi page portfolio built around one idea: **every dot is a person**. One persistent WebGL particle field lives behind every page: it forms the name, previews each section on hover, flies between page titles on navigation, fills the experience timeline, draws the world map, and ends every page with "Let's talk."

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · GSAP ScrollTrigger · Lenis · OGL (WebGL particles)

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Production check:

```bash
npm run build && npm start
```

## Edit content

All copy lives in **`content/site.ts`**: hero line, status pill, metrics, projects (card + expanded case study), skills, interests, contact. Wrap a word in `*asterisks*` to render it in Instrument Serif italic. House rule: no em dashes.

Drop your resume at **`public/resume.pdf`** (served at `/resume.pdf`).

## How the particles work

- `lib/particles/engine.ts`: one OGL `Points` mesh, CPU spring physics (6k dots desktop, 2.5k mobile), cursor repel.
- `lib/particles/scenes.ts`: target generators. Text is rasterized from the real DOM heading (same font, same position), the map comes from `lib/world-dots.json`, the grid is computed.
- Scenes are anchored to elements with `data-scene-shape` / `data-scene-driver`. Scroll position decides which pair of scenes is active; between scenes the dots relax into a faint ambient field.
- The real HTML heading renders first (fast LCP, SEO, no-WebGL fallback) and fades once the dots have formed it.
- `prefers-reduced-motion`: no smooth scroll, no morphs (static states with a fade), no marquee.

Regenerate the map dots (needs dev deps): `node scripts/gen-world-dots.mjs`.

## Pages

`/` home (name + category index with particle previews) · `/projects` and `/projects/[slug]` · `/experience` (timeline) · `/about` (journey map) · `/life`.

## Deploy (GitHub Pages)

Live at **https://easongan123.github.io**.

- Source lives on `main`. The site is a static export (`output: "export"` in `next.config.ts`), built to `out/`.
- `npm run deploy` builds and force-pushes `out/` to the `gh-pages` branch, which Pages serves.
- The previous 2022 site is preserved on the `legacy-2022` branch.

Icons and the social preview image are static PNGs in `app/`. Their generators are in `scripts/og-source/` if you want to restyle and regenerate them.
