# Component Style Studio

A standalone visual tool for importing an existing React codebase, browsing its components, composing them on a canvas, editing style/animation, and exporting the changed files. See `component-style-studio-implementation-plan.md` (session outputs) for the full plan.

## Status

- **Phase 0 — Scaffold**: done (lean: npm workspaces, no CI remote yet)
- **Phase 1 — Import & component detection**: done
- Phases 2–9: not started

## Layout

| Path | What |
|---|---|
| `apps/studio` | The Studio app (Vite + React + TS + Tailwind v4) |
| `packages/registry` | Shared registry schema types (imported + preset components) |
| `packages/parser` | Import pipeline: file walk, `react-docgen-typescript` extraction, runtime-dependency flagging, and the Vite `/api/scan` dev-server endpoint |

## Run

```bash
npm install
npm run dev        # studio at http://localhost:5173
npm test           # parser unit tests (vitest)
npm run lint       # oxlint
npm run typecheck
```

## Phase 1 architecture note

Component scanning runs in the Studio's **local Vite dev server** (Node), not the browser: `react-docgen-typescript` needs the TypeScript compiler plus the target folder's real `node_modules`/`tsconfig.json` for full-fidelity prop extraction. The UI posts a folder path to `/api/scan`; nothing from the scanned folder is copied into this project (per plan §7.3 / Phase 1).
