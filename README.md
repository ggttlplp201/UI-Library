# Component Style Studio

Build real, working web pages out of your own React components — visually.

![Component Style Studio — workspace](docs/media/studio-workspace.gif)

## 🌟 Highlights

- 🎨 **Design with real components** — import any React codebase (or use the 130+ bundled presets) and every component renders live, with its actual CSS, Tailwind config, and dependencies
- 🖱️ **A canvas that feels like Canva** — drag anywhere to move, marquee-select groups, scale/stretch/rotate, press **▶ live** to actually click the thing you placed
- 📄 **Multi-page sites, wired like Blender nodes** — pages live in a browser-style tab strip; the Root graph connects them, and every button can lead to its own page
- ⏳ **Page effects, where they belong** — loading screens and cursor effects are set per *page*, not dropped on the canvas
- ▶️ **Preview mode** — run your site inside the studio: loading screens play, buttons navigate, effects work
- 📦 **Export something real** — one self-contained HTML file of the whole site, or a zip of your edited component source, ready to diff
- ✍️ **Code stays honest** — visual edits are written back into the component's real source by an AST engine (style, text, animation — never your logic)

## ℹ️ Overview

Component Style Studio is a local-first visual page builder. Point it at a folder and the
components inside populate a searchable library with live previews — nothing is copied, the
folder is scanned in place. Compose components into pages, restyle them, attach animations with
real triggers (entrance, hover, click, scroll), link buttons to pages, and ship the result.

It sits somewhere between a design tool and a site builder: like Figma you compose visually,
but every block is a *running React component*, so what you preview is what you export.

Made by **Leon** ([@ggttlplp201](https://github.com/ggttlplp201)) as a personal project.

### What's in the box

The bundled preset library includes two complete design themes — **Kinetic UI** (light
editorial kit) and **Kinetic Lab** (dark motion lab) — plus page sections (navbar, hero,
feature grid, CTA, footer), cards, inputs, badges, and effects, alongside credited
components sourced from Magic UI, Cult UI, shadcn/ui, React Bits, and Motion Primitives.

![Component Style Studio — import screen](docs/media/studio-launcher.gif)

## 🚀 Quick start

```bash
npm install
npm run dev        # open http://localhost:5173
```

Point it at a React project folder, or click **"Start with the preset library"** and build
straight away. When you're happy, hit **▶ Preview** to try your site, then **Export**.

```bash
npm test           # unit tests (vitest)
npm run lint       # oxlint
npm run typecheck
```

## 🧭 Finding your way around

| Where | What |
|---|---|
| Library (right) | Components + Animations tabs; drag or click a card to place it |
| Canvas (center) | Your page. Select → move/scale/rotate; **▶ live** to interact for real |
| Configure (left) | Selected component's props, style, links, animation — or, with nothing selected, the **page settings** (loading screen, cursor effect) |
| Tab strip (top) | Every open page, plus **⌘ Root** — the node graph where you wire pages together |
| Code pane (bottom) | The selected component's source with your edits written back in |

## 🏗️ How it works

| Path | What |
|---|---|
| `apps/studio` | The Studio app (Vite + React + TS + Tailwind v4) |
| `packages/parser` | Folder scan → `react-docgen-typescript` prop extraction (`/api/scan`) |
| `packages/preview` | A child dev-server per project + the iframe harness that renders, animates, and reports clicks |
| `packages/presets` | The bundled preset library (themes, sections, effects) |
| `packages/ast-sync` | The AST edit engine, live code (`/api/code`) and source export (`/api/export`) |
| `packages/registry` | Shared registry types |

Scanning and previews run in the studio's local dev server, not the browser — components need
the TypeScript compiler and their own real `node_modules` to render faithfully. Nothing from
your folder is written or copied.
