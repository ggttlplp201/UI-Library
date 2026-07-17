# Component Style Studio

Build real, working web pages out of your own React components — visually.

![Component Style Studio — workspace](docs/media/studio-workspace.gif)

## 🌟 Highlights

- 🎨 **Design with real components** — import any React codebase (or use the 240+ bundled presets) and every component renders live, with its actual CSS, Tailwind config, and dependencies
- 🖱️ **A canvas that feels like Canva** — drag anywhere to move, marquee-select groups, scale/stretch/rotate, undo/redo, press **▶ live** to actually click the thing you placed
- 📄 **Multi-page sites, wired like Blender nodes** — pages live in a browser-style tab strip; the Root graph connects them, and every button can lead to its own page
- 🖼️ **Page surfaces, set per page** — loading screen, cursor effect, and a **page background** (glow, grids, retro orbs, animated rain) all belong to the page, not the canvas
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

The bundled library is **240+ components** — every one a working component, not a static
mockup: switches toggle, order books tick, terminals type, tabs switch, forms take input.
They're organized into browsable **kits**, each a complete design language:

| Kit | Language |
|---|---|
| **Kinetic UI** | Light editorial — springy indigo controls |
| **Kinetic Lab** | Playful physics — fills, dials, elastic toggles |
| **Cupertino** | Liquid-glass iOS — frosted tints, springs |
| **Glitchtype** | CRT terminal — scanlines, glitch, phosphor type |
| **Chicago 95** | Retro OS — beveled chrome, working windows & dialogs |
| **Spritecraft** | 8-bit game HUD — clickable hearts, XP, hard shadows |
| **Marginalia** | Ink & paper — highlighter swipes, stamps, serifs |
| **Boldcase** | Brutalist poster type — huge grotesk, hard rules |
| **Voltura** | Dark-luxe trading — live tickers, depth, sparklines |
| **Overworld** | Adventure UI — parchment maps, quest chrome |
| **Basics** | Page primitives — text, images, panels, backdrops |

Plus page sections (navbar, hero, feature grid, CTA, footer), interaction components ported
from award-site templates (hover-reveal indexes, morphing nav, scroll-assembling text, film
strips), and credited components sourced from Magic UI, Cult UI, shadcn/ui, React Bits,
Motion Primitives, and UIverse.

**Sample projects** ship ready to open — five full builds, each committed to one visual
direction, showing what the library composes into: *Arc Relay* (brutalist launch, 3 linked
pages), *Component Workbench* (the whole catalog on a cutting mat), *Motion Lab* (scroll-driven
acts), *Control Room* (a dark instrument console), and *Field Notes* (an editorial notebook).

![Component Style Studio — import screen](docs/media/studio-launcher.gif)

## 🚀 Quick start

```bash
npm install
npm run dev        # open http://localhost:5173
```

Point it at a React project folder, or open one of the bundled samples and build straight
away. When you're happy, hit **▶ Preview** to try your site, then **Export**.

```bash
npm test           # unit tests (vitest)
npm run lint       # oxlint
npm run typecheck
```

## 🧭 Finding your way around

| Where | What |
|---|---|
| Library (right) | Components + Animations tabs, grouped into expandable **kits**; drag or click a card to place it |
| Canvas (center) | Your page. Select → move/scale/rotate; **↩ / ↪** undo/redo; **▶ live** to interact for real |
| Configure (left) | Selected component's props, style, links, animation — or, with nothing selected, the **page settings** (page background, loading screen, cursor effect) |
| Tab strip (top) | Every open page, plus **⌘ Root** — the node graph where you wire pages together |
| Code pane (bottom) | The selected component's source with your edits written back in |

## 🏗️ How it works

| Path | What |
|---|---|
| `apps/studio` | The Studio app (Vite + React + TS + Tailwind v4) |
| `packages/parser` | Folder scan → `react-docgen-typescript` prop extraction (`/api/scan`) |
| `packages/preview` | A child dev-server per project + the iframe harness that renders, animates, and reports clicks |
| `packages/presets` | The bundled preset library (kits, sections, effects) |
| `packages/ast-sync` | The AST edit engine, live code (`/api/code`) and source export (`/api/export`) |
| `packages/registry` | Shared registry types |

Scanning and previews run in the studio's local dev server, not the browser — components need
the TypeScript compiler and their own real `node_modules` to render faithfully. Nothing from
your folder is written or copied.
