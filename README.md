# Mohamed Djebiri — Portfolio (React + Three.js)

A redesign of [mohking999.github.io/mystyle-portfolio](https://mohking999.github.io/mystyle-portfolio/) as an
interactive 3D portfolio, built with React, Vite, React Three Fiber, drei, and Framer Motion.

## Summary of what changed

- Rebuilt from a single static page into a modular Vite + React app (see structure below)
- Added a 3D hero scene (React Three Fiber): a low-poly "workspace" — monitor, stand,
  keyboard — with a few floating "app window" cards, built entirely from primitives
  (no external 3D model files to download or optimize)
- Added an optional 3D "project constellation" view (toggle between 2D grid and 3D) that
  reuses the same floating-window component; clicking a window opens the same detail modal
  as the 2D cards
- Kept a fully accessible, keyboard-navigable 2D project grid with filters
  (All / Web / Mobile / SaaS / Java) as the primary, SEO-friendly way to browse projects —
  the 3D view is additive, never a replacement
- Added English / French / Arabic support via `react-i18next`, with full RTL layout for
  Arabic (`dir="rtl"` is set automatically, and Arabic uses the Cairo typeface)
- Added a light/dark theme toggle (dark by default)
- Added a contact form with client-side validation and accessible error messages
- Respects `prefers-reduced-motion` throughout (Framer Motion, the 3D scene's idle
  animation, and CSS transitions all check it)
- Lazy-loads the 3D scenes so `three` / `@react-three/fiber` / `@react-three/drei` are only
  downloaded once a scene actually needs to render (see **Performance** below)
- Provides a graceful non-3D fallback if WebGL isn't available

## Architecture

```
src/
  components/
    layout/       Navbar, MobileMenu, Footer
    ui/           LanguageSwitcher, ThemeToggle, Reveal (scroll-in wrapper)
    sections/     Hero, About, Projects, ProjectCard, ProjectModal, Skills, Contact
    scenes/
      HeroScene/      HeroScene.jsx, Workspace.jsx, AppWindow.jsx
      ProjectsScene/  ProjectsScene.jsx (reuses AppWindow)
      CanvasFallback.jsx
  data/           projects.js, skills.js  (facts only — no translated text)
  hooks/          useTheme, useReducedMotion, useWebGLSupport
  i18n/           index.js, locales/{en,fr,ar}.json
  styles/         theme.css (design tokens / CSS variables)
  App.jsx
  main.jsx
```

3D scene logic is fully separated from normal UI logic (`components/scenes/` vs.
`components/sections/`), and every component is single-purpose and reusable —
`AppWindow` in particular is shared between the hero and the projects scene.

React Router was **not** added: everything is a single scrollable page addressed by
anchor links (`#about`, `#work`, …), which is simpler, keeps every section indexable,
and matches the site's actual structure — a router would add a dependency without a
real benefit here.

## Content notes / assumptions

- All project facts (names, descriptions, tech stacks, live/GitHub links) are carried
  over from the existing site and translated into French and Arabic. Nothing was invented.
- No dates, employers, clients, awards, or certifications are shown, because none were
  provided — the "Journey/timeline" section from the brief was intentionally **left out**
  rather than filled with invented milestones.
- **Contact form**: GitHub Pages has no backend, so the form validates input and opens a
  prefilled email in the visitor's default mail client. A direct `mailto:` link is also
  shown underneath. For server-side form delivery, replace the mailto handler in
  `src/components/sections/Contact.jsx` with a Formspree (or similar) endpoint.
- Placeholder visuals: the hero/3D scene uses abstract geometry and a monogram
  (`<MD />`) rather than a real screenshot or photo, since none were provided.

## The 3D scene, and how it stays fast

- **No external 3D models.** The workspace and app-window shapes are built from
  primitives (`RoundedBox`, planes, boxes), so there's nothing to download, decode, or
  compress beyond the Three.js/R3F/drei libraries themselves.
- **Lazy-loaded.** Both `HeroScene` and `ProjectsScene` are loaded via `React.lazy` +
  `Suspense`, wrapped in a translated loading state, so the 3D libraries are only
  fetched once a scene is about to render — everything else in the initial bundle stays
  small (see the build output below).
- **Separate vendor chunk.** `vite.config.js` puts `three` / `@react-three/fiber` /
  `@react-three/drei` in their own chunk so it's fetched once and cached across both scenes.
- **Adaptive quality.** `<PerformanceMonitor>` from drei watches frame rate and drops
  the canvas `dpr` on lower-end devices/mobile rather than always rendering at full
  device pixel ratio.
- **No orbit controls, no free spinning.** The camera does a small, capped parallax
  ease toward the pointer (`CameraRig`); objects idle-bob and tilt slightly — there is
  no auto-rotation and no user-driven orbiting, per the brief's "elegant, not a video
  game" direction.
- **Respects reduced motion.** All idle animation and camera easing is skipped when
  `prefers-reduced-motion: reduce` is set.
- **WebGL fallback.** `useWebGLSupport` checks for a WebGL context once on mount; if
  it's unavailable, `CanvasFallback` renders a static, translated placeholder instead
  of a blank/broken canvas, and the rest of the page (including the 2D project grid)
  works exactly the same either way.
- **Doesn't block scroll.** The canvas sits behind/beside content with
  `touch-action: pan-y`, and only the clickable app-window meshes intercept pointer
  events — normal page scroll and interaction are never blocked by the canvas.

Latest production build (`npm run build`):

| Chunk | Size (gzip) | Notes |
|---|---|---|
| `index` (app shell, all sections, i18n) | ~67 KB | loaded immediately |
| `three-vendor` (three / fiber / drei) | ~309 KB | loaded only when a 3D scene mounts |
| `HeroScene`, `ProjectsScene`, `AppWindow` | <2 KB each | trivial once the vendor chunk is cached |

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Opens the site locally with hot reload (Vite default: http://localhost:5173).

## Production build

```bash
npm run build
npm run preview   # optional: serve the production build locally to sanity-check it
```

## Deploying to GitHub Pages

GitHub Actions builds the Vite app and publishes `dist/` through `.github/workflows/deploy.yml`.

1. Keep the repository Pages source set to **GitHub Actions**.
2. Push changes to `main`, or run **Deploy to GitHub Pages** from the Actions tab.
3. Keep `base` in `vite.config.js` set to `"/mystyle-portfolio/"` for this repository URL.

## Before you ship

- [x] Contact form opens a prefilled email with a mailto fallback
- [ ] Swap the `<MD />` hero monogram / add a real screenshot if you'd like one
- [ ] Double-check `base` in `vite.config.js` against your actual repo name
- [ ] Run `npm run build` once more and skim the console for warnings
- [ ] Test with a screen reader and keyboard-only navigation (Tab, Escape on modals)
- [ ] Test the language switcher in all three languages, including RTL in Arabic
- [ ] Test on a real low-end/mobile device, not just desktop dev tools
