# Component Style Studio

A standalone visual tool for importing an existing React codebase, browsing its components, composing them on a canvas, editing style/animation, and exporting the changed files. See `component-style-studio-implementation-plan.md` (session outputs) for the full plan.

## Status

All 10 phases (0–9) are complete.

- **Phase 0 — Scaffold**: done (lean: npm workspaces, no CI remote yet)
- **Phase 1 — Import & component detection**: done
- **Phase 2 — Controls / Style**: done
- **Phase 3 — Library panel**: done
- **Phase 4 — Canvas**: done (move / scale / stretch / rotate, keyboard nudge & delete)
- **Phase 5 — Edit panel**: done
- **Phase 6 — Animation system**: done (GSAP)
- **Phase 7 — AST sync engine**: done (narrow transforms write canvas edits back to source)
- **Phase 8 — Export**: done (HTML demo export + edited-source zip export)
- **Phase 9 — Polish & test**: done (cross-component AST regression matrix, canvas keyboard UX)

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
