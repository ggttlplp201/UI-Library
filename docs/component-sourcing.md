# Component Sourcing Manifest

A build sheet for **Claude Code** to expand `packages/presets` with free, correctly-licensed
components — using a **registry-based ingestion** pipeline and a **compliance sidecar**, instead of
hand-porting files one at a time. Tier 3 (paid block vendors) is excluded.

> **What changed vs. the folder-scan-only approach.** The current pipeline auto-discovers components
> by scanning folders and reading props with `react-docgen-typescript`. That stays — it's correct for
> the *user-import* path. But for the *preset* library, ingesting from dozens of external sources by
> hand has three seams: license/attribution lives only in a prose comment (a legal risk at export
> time), dependencies are implicit (dep-drift), and category is one-dimensional. This manifest fixes
> all three by (A) pulling components through the **shadcn registry CLI** where possible — which wires
> deps automatically — and (B) attaching a **`.meta.json` sidecar** the scan merges into
> `RegistryEntry`, so license, author, attribution obligation, provenance, and tags become real data.

---

## 0. Architecture — read this before adding anything

### 0.1 Two ingestion paths

**Path A - Registry CLI (preferred).** shadcn/ui, Magic UI, React Bits, and Cult UI publish
shadcn-compatible registries. One command drops the component into the preset package **and resolves
its `dependencies` + `registryDependencies` from the registry item JSON** - no manual `package.json`
edits, no reverse-engineering imports:

```bash
# run from repo root; --cwd targets the presets workspace
npx shadcn@latest add <registry-url-or-@namespace/name> --cwd packages/presets
```

After the CLI writes the file, the existing scan (`packages/parser` -> `scanProject`) picks it up
exactly as today. Registry ingest is **additive** - it does not replace the folder scan, it feeds it.

**Path B - Manual port (fallback).** For sources without a registry (UIverse snippets, a plain-CSS
DaisyUI control, a rebuilt-from-scratch effect), create the `.tsx` by hand per section 1 and register
deps in `package.json` yourself.

Either way, **every preset component gets a `.meta.json` sidecar (section 0.2).**

### 0.2 The compliance sidecar

The shadcn registry schema carries deps but **no license/author/attribution field**, and the export
feature must not ship uncredited code. So each preset component gets a sibling metadata file the
parser merges into its `RegistryEntry`. Sidecar (not an in-component `export const meta`) specifically
because presets **serialize into exports** - keeping metadata out of the component source means it
never leaks into the exported HTML/zip, while still being available to the Studio and the NOTICE
generator.

**Format: `.meta.json`, not `.meta.ts`.** The scan runs in Node/Vite; importing an arbitrary `.ts`
sidecar means executing arbitrary code at scan time, which is an unnecessary risk in a path that also
scans user folders. JSON is parsed, not executed - safer, trivial to read in the scan, and impossible
to make do anything surprising. The tradeoff is losing `satisfies PresetMeta` type-checking on the
sidecar itself; that's covered instead by the `build:credits` CI check (section 0.3) validating each
JSON against the required-fields list. Plain JSON + CI check, no schema library.

```jsonc
// packages/presets/src/buttons/ShimmerButton.meta.json
{
  "library": "Magic UI",
  "source": "https://magicui.design/docs/components/shimmer-button",
  "author": "@magicuidesign",
  "license": "MIT",                         // SPDX id
  "attributionRequired": false,             // true -> exporter MUST inject visible credit
  "ingest": "registry",                     // "registry" | "manual-port" | "rebuilt"
  "fetchedFrom": "@magicui/shimmer-button", // provenance for staleness checks
  "tags": ["button", "motion"],             // multi-category; folder is still the primary category
  // --- visual-coherence gate (not legal; product quality) ---
  "styleFamily": "magic-ui",                // design language: "kinetic" | "chrome-console" | "magic-ui" | "uiverse" | ...
  "qualityTier": "vetted",                  // "authored" | "vetted" | "raw"  (authored = repo-native like Chrome Console)
  "previewStatus": "ok"                     // "ok" | "needs-mock" | "broken"  (does it render in Studio yet?)
}
```

Naming: `<ComponentName>.meta.json`, sibling to `<ComponentName>.tsx`. One sidecar per component file.
`walk.ts` only scans `.tsx/.jsx`, so a `.json` sidecar can never accidentally register as a component.

**Why the three coherence fields exist (they are not license fields).** The repo already has strong
*authored* families (Chrome Console, Kinetic). A bulk pour from Magic UI + UIverse + React Bits with
five different design languages would dilute exactly what makes the library worth showing off. So:
- `styleFamily` lets the Studio group/filter by design language and keep a coherent set on screen.
- `qualityTier` separates repo-native authored work (`authored`) from vetted external ports
  (`vetted`) from unreviewed bulk (`raw`), so raw imports never sit next to authored ones by default.
- `previewStatus` records whether it actually renders in Studio, so broken/needs-mock imports don't
  ship silently. Set this during the pilot review (section 0.5), not on import.

### 0.3 Type + parser changes this requires (do these once, first)

Small, additive, and confined to the preset path. Do this **before** bulk-adding components.

1. **Extend the registry types** in `packages/registry/src/index.ts`:
   ```ts
   /** SPDX license id or a short descriptor. */
   export type LicenseId = 'MIT' | 'MIT + Commons Clause' | 'Apache-2.0' | 'CC0-1.0' | 'ISC' | string

   /** Provenance + license + coherence for a preset component (from its `.meta.json` sidecar). */
   export interface PresetMeta {
     // provenance & license
     library: string
     source: string
     author: string
     license: LicenseId
     attributionRequired: boolean
     ingest: 'registry' | 'manual-port' | 'rebuilt'
     fetchedFrom?: string
     tags?: string[]
     // visual-coherence gate (product quality, not license)
     styleFamily?: string                        // design language
     qualityTier?: 'authored' | 'vetted' | 'raw'
     previewStatus?: 'ok' | 'needs-mock' | 'broken'
   }

   export interface RegistryEntry {
     // ...existing fields unchanged...
     /** Present only for `source: 'preset'` entries that have a `.meta.json` sidecar. */
     meta?: PresetMeta
   }
   ```
   `RegistryEntry.meta` is optional, so imported (user) components and existing presets without a
   sidecar keep working unchanged.

2. **Add the sidecar merge** where presets are served. In
   `packages/parser/src/presets-plugin.ts` (the plugin already maps entries to tag `source: 'preset'`),
   extend that map to also load the sidecar - **read + `JSON.parse`, do not `import()`**:
   ```ts
   // for each entry: resolve `${dirname(filePath)}/${ComponentName}.meta.json`;
   // if it exists, JSON.parse it and attach as entry.meta. Missing/invalid sidecar -> leave meta
   // undefined and (optionally) push a ScanError. Never execute the sidecar as code.
   ```
   Keep it non-fatal: a preset without a sidecar scans fine (meta just `undefined`), so migration is
   component-by-component, not big-bang. Optionally have `scanProject` count sidecar-less presets and
   surface them in `ScanStats` so you can track coverage.

3. **Add a `build:credits` script** (`packages/presets`, or a repo-root script): read every
   `*.meta.json`, then
   - **validate** each JSON has the required fields (`library`, `source`, `author`, `license`,
     `attributionRequired`, `ingest`) - this is the only "schema" check; plain JSON, no schema library;
   - **generate `NOTICE.md`** listing every component, its library, author, license, and source URL;
   - **fail** if any component's imports reference a package not in `packages/presets/package.json`
     (dep-drift guard - closes the gap registry-ingest can't cover for manually-ported files);
   - **fail** if any `attributionRequired: true` component lacks a credit header (section 2).
   Wire it into `npm test` / CI so these become enforced invariants, not conventions.

4. **Fix export-time credits FIRST - this is a pre-existing gap, not a future task.** The repo already
   ships Skiper ports whose headers say "attribution required," but the exporter
   (`apps/studio/src/components/Workspace.tsx`, the self-contained HTML build) injects no credit, and
   there is no `NOTICE`/license file in the repo. So the library is **already out of compliance on
   components it already ships** - before adding anything new. Before ingesting a single new
   attribution-bearing component: for every included component whose `meta.attributionRequired === true`,
   inject its credit (library + author + source) into the output - an HTML comment in the single-file
   export and a `CREDITS.md` in the source zip. This turns Skiper's "attribution required when using
   the free version" from a hope into a guarantee, and clears the existing debt.

### 0.4 Per-component checklist (both paths)

- [ ] Component file at `packages/presets/src/<category>/<Name>.tsx`, conventions per section 1.
- [ ] Credit header JSDoc at top of the file (section 2).
- [ ] `<Name>.meta.json` sidecar next to it (section 0.2), license verified against section 4.
- [ ] **No copied visual assets** - images/video/icons/fonts recreated or omitted, not copied (section 0.6).
- [ ] Deps present in `package.json` (registry CLI does this on Path A; do it by hand on Path B).
- [ ] `npm run typecheck && npm run lint && npm test && npm run build:credits` all green.
- [ ] Component renders in the Studio Library with editable props; set `previewStatus` accordingly.

**Do NOT** add a central index (there is none - discovery is by scan), copy a source library's own
tooling/config/demo scaffolding, or inline metadata into the component body.

### 0.5 Build order (machinery first, then a one-source pilot)

Do not start by hunting assets. Ship the enforcement machinery, then add sources in small batches so
visual fit can be reviewed before anything scales. Sequence:

1. Implement `PresetMeta` + the JSON sidecar merge (section 0.3 steps 1-2).
2. Add `NOTICE.md` generation + the `build:credits` CI check; fail CI when metadata is missing (0.3 step 3).
3. **Fix export-time credits for `attributionRequired` (0.3 step 4) - clears the existing Skiper debt.**
4. Land the allowlist/denylist doc (section 0.7).
5. Pilot: add **only 5-10 components from ONE source** (start with shadcn/ui or Magic UI - cleanest license).
6. Review visual fit in Studio (`styleFamily`/`qualityTier`/`previewStatus`) before scaling.
7. Expand **source-by-source**, not component-by-component chaos - one source vetted and merged before the next.

### 0.6 Code vs. visual assets - a hard separation

The license map in section 4 governs **code**. It does **not** govern the images, video, icons,
illustrations, fonts, or Figma assets that ship alongside a component - those carry **different
rights** (the repo already contains third-party image/video assets under `packages/presets/public/`,
which are out of scope for this manifest and separately governed).

Rule when porting a component that references a visual asset:
- **Code** from an MIT-style library: copy with attribution (section 4).
- **Visual assets** (its demo images, hero video, bespoke icons, bundled fonts): **do not copy.**
  Replace with a neutral placeholder, an already-licensed asset in the repo, or a prop the user
  supplies. When in doubt, **recreate the idea, don't copy the asset.**
- Icons: prefer `lucide-react` (already installed, ISC) over copying a library's bespoke icon set.

A permissive *code* license is not permission to redistribute the *pictures* that came with it.

---

## 1. File conventions every component must follow

From the existing presets (`kinetic-ui/KineticButton.tsx`, `scroll/StickyCardsGsap.tsx`,
`effects/ProgressiveBlur.tsx`).

- **Named export**, PascalCase, filename-matched: `export const BlurText = (...) => {...}`.
- **Typed props with a JSDoc per prop** - docgen reads these into the Studio's Configure panel, so
  descriptions are required:
  ```tsx
  export const Thing = ({
    /** Text shown; appears in the prop panel */
    label = 'Primary',
    /** Visual variant */
    variant = 'solid',
  }: { label?: string; variant?: 'solid' | 'ghost' }) => { /* ... */ }
  ```
- **Self-contained styling** so units serialize cleanly on export: a scoped `<style>` tag or inline
  `style={}`, or the source's original Tailwind classes (Tailwind v4 is configured in `apps/studio`).
  Don't invent a third styling system.
- **Shared helpers** from `packages/presets/src/lib/`: `cn()` from `../lib/utils`; theme tokens `KUI`
  (`../lib/kinetic`), `../lib/klab`, `../lib/chrome`. When porting a shadcn file, replace its
  `@/lib/utils` import with `../lib/utils` (identical `cn`).
- **`"use client"`** only when the component uses hooks/refs/browser APIs.
- **Keep logic self-standing.** The AST edit engine rewrites style/text/animation, never logic. A
  component needing `useContext` or external data hooks gets flagged `needsMocking`; prefer
  self-contained components and expose would-be-context values as props.

---

## 2. Credit header format (required on every file)

Match the repo's existing gold-standard headers. JSDoc block at the top:

```tsx
/**
 * <One line: what it does + notable behavior.>
 * Ported from <Library> (<component id>).            // or: Rebuilt from scratch, inspired by <Library>.
 * Source: <direct URL>
 * Author: <@handle or Name> (<url if known>). License: <SPDX id>.<attribution/other clause if any>
 */
```

Existing example that already lives in the repo and is the target quality:

```tsx
/**
 * Progressive blur overlay for scroll edges (top/bottom).
 * Ported from Skiper UI (skiper41), inspired by devouringdetails.com.
 * Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 (https://gxuri.me)
 */
```

Rules: state license by SPDX id; if attribution is legally required (Skiper, some UIverse authors),
say so explicitly; if the component is **rebuilt** rather than copied, write `Rebuilt from scratch,
inspired by ...` and do not claim a port; always keep the **individual** author's name (UIverse).

The header is human-facing; the sidecar (section 0.2) is machine-facing. Both carry the same facts on
purpose - the `build:credits` script cross-checks them.

---

## 3. Dependencies - already installed

`packages/presets/package.json` already ships these; components using them need **no new install**:

| Package | Covers |
| --- | --- |
| `framer-motion` / `motion` ^12.42 | Motion Primitives, Magic UI, Cult UI, most animated bits |
| `gsap` + `@gsap/react` | Skiper-style ScrollTrigger scroll components |
| `lenis` | smooth scroll |
| `@radix-ui/react-tooltip` | Radix tooltip (already in) |
| `@base-ui/react` | Base UI primitives |
| `lucide-react` | icons |
| `clsx` + `tailwind-merge` | `cn()` |
| `tw-animate-css` | Tailwind keyframe utilities |
| `embla-carousel-react` (+autoplay), `swiper` | carousels/sliders |
| `@number-flow/react` | animated numbers |
| `next-themes`, `use-sound` | theme toggles, audio |

**May be added by registry-ingest or manual port** (only when a chosen component needs it):
- specific `@radix-ui/react-*` primitives (`react-dialog`, `-dropdown-menu`, `-popover`, `-select`,
  `-accordion`, `-checkbox`, `-radio-group`, `-tabs`) - shadcn/ui components;
- `class-variance-authority` - shadcn `cva` variants;
- `cmdk` - combobox / command menu;
- `sonner` - toast;
- `three` + `@react-three/fiber` + `@react-three/drei`, `cobe` - **only** React Bits 3D backgrounds
  (heavy; add sparingly - the repo's own design rules warn against gratuitous 3D).

On Path A the registry CLI adds these automatically; on Path B add them to the presets workspace
(`npm i <pkg> --workspace=@component-style-studio/presets`) and let `build:credits` catch omissions.

---

## 4. License map - governs whether we copy or rebuild

| Library | License | Copy 1:1? | Obligation |
| --- | --- | --- | --- |
| shadcn/ui | MIT | YES | keep copyright |
| Magic UI | MIT | YES | credit |
| Motion Primitives | MIT | YES | credit |
| Cult UI | MIT | YES | credit |
| HyperUI | MIT | YES | credit |
| DaisyUI | MIT | YES | credit |
| Radix / Base UI / React Aria | MIT / Apache-2.0 | YES | keep license header |
| UIverse.io | MIT **or** CC0 (per-author - CHECK each) | YES | keep the **individual author's** name |
| React Bits | **MIT + Commons Clause** | YES for a free repo | credit **and** don't sell the lib as-is (see below) |
| Skiper UI (free tier) | **attribution required** | YES | must credit Skiper visibly (repo already does) |
| Aceternity UI (free components) | MIT | PREFER REBUILD | free = MIT, Pro isn't - section 6 |
| Aceternity **Pro** / Shadcnblocks / Shadcn Studio / ogBlocks | paid / restrictive | NO | do not copy; one bans use in AI/generator tools at **$8,000/breach** |

> **React Bits Commons Clause** - free for personal & commercial *use*, but you may not *sell* the
> software where the code is its substantial value. A **free, open** Component Style Studio is fine;
> if the Studio itself is ever monetized on the back of these components, revisit. The sidecar records
> `license: 'MIT + Commons Clause'` so `build:credits` can list it distinctly.

**Decision rule for Claude Code:** copy verbatim **only** from the YES rows. For NO rows, or any
unclear license, **rebuild from scratch**, set `"ingest": "rebuilt"` in the sidecar, and header it
`Rebuilt from scratch, inspired by ...`.

### 4.1 Source allowlist / denylist (the standing decision - keep this current)

This is the authoritative list. If a source is not on the ALLOW list, it is treated as INSPIRATION
(rebuild only) until explicitly reviewed and moved.

**ALLOW - copy code 1:1 with attribution:**
- shadcn/ui (MIT), Magic UI (MIT), Motion Primitives (MIT), Cult UI (MIT), HyperUI (MIT),
  DaisyUI (MIT), Radix / Base UI / React Aria (MIT / Apache-2.0).
- UIverse.io - **per element**, only items whose element page shows MIT or CC0 (verify each; section 7).

**USE WITH CARE - allowed but flagged:**
- React Bits (MIT + Commons Clause) - fine for a free repo; the Commons Clause changes
  monetization/distribution risk, so record it in the sidecar and revisit before any paid model.
- Skiper UI (free tier) - allowed, but **attribution is required** and must be enforced at export
  (section 0.3 step 4). `attributionRequired: true`.

**INSPIRATION ONLY - rebuild, never copy:**
- Aceternity UI free components - unless a specific component's license is *clearly* permissive for
  redistribution in this app, rebuild it (`"ingest": "rebuilt"`).
- Mobbin, Godly, Refero, Screenlane, Savee, Cosmos - reference for *what to build*, never a code/asset source.

**DENY - never ingest, in any form:**
- Aceternity **Pro**, Shadcnblocks, Shadcn Studio, ogBlocks, and any paid/pro block pack.
- **Rationale (load-bearing):** Shadcnblocks' license explicitly prohibits use of its components in
  marketplaces, AI site builders, code-generation tools, and automated component-generation platforms,
  with an $8,000-per-breach penalty. Component Style Studio is squarely in that category. Any source
  that bans generators, marketplaces, redistribution, or derivative component libraries is denied by
  default - the burden is on the source to be *clearly* permissive, not on us to find a loophole.

---

# TIER 1 - Foundation primitives (accessible plumbing)

Fills gaps the preset set lacks: accessible dialog, dropdown, popover, select, combobox, accordion,
checkbox/radio, tabs, date picker. Adds the *accessible-primitive* versions alongside the repo's
bespoke Kinetic ones.

### 1.1 shadcn/ui - accessible core - Path A (registry)
- **Registry:** `npx shadcn@latest add <name> --cwd packages/presets` (deps + Radix primitives wired
  automatically). Source pages: https://ui.shadcn.com/docs/components/<name>. **MIT.** Author: shadcn.
- **After add:** swap `@/lib/utils` -> `../lib/utils`, add credit header + `.meta.json`
  (`"ingest": "registry"`, `"library": "shadcn/ui"`, `"license": "MIT"`).
- **Priority pulls:**

  | Component | Folder | Primitive dep (CLI adds) |
  | --- | --- | --- |
  | Dialog / Modal | `overlays/` (new) | `@radix-ui/react-dialog` |
  | Dropdown Menu | `overlays/` | `@radix-ui/react-dropdown-menu` |
  | Popover | `overlays/` | `@radix-ui/react-popover` |
  | Select | `inputs/` | `@radix-ui/react-select` |
  | Combobox | `inputs/` | `cmdk` + popover |
  | Accordion | `disclosure/` (new) | `@radix-ui/react-accordion` |
  | Checkbox / Radio Group | `inputs/` | `@radix-ui/react-checkbox`, `-radio-group` |
  | Tabs | `navigation/` (new) | `@radix-ui/react-tabs` |
  | Tooltip | `overlays/` | already installed |
  | Sonner (toast) | `feedback/` | `sonner` |

### 1.2 Radix / Base UI / React Aria - headless behavior - Path B
- radix-ui.com/primitives, base-ui.com, react-spectrum.adobe.com/react-aria. **MIT / Apache-2.0.**
- Use to build **Kinetic-styled + accessible** hybrids: wrap a Base UI (already installed)
  `Dialog`/`Menu`/`Select` and style with `KUI`. Target `overlays/` `inputs/` `navigation/`.
  Sidecar `ingest: 'manual-port'`.

### 1.3 DaisyUI - pure-CSS variants - Path B (optional)
- daisyui.com/components. **MIT.** CSS plugin, not React - port only if you want a plain-CSS themed
  control; wrap and credit `DaisyUI (MIT)`.

---

# TIER 2 - Animated "wow" components

Expands `text/` `scroll/` `hover/` `effects/` and a new `backgrounds/`. All MIT (React Bits carries
the Commons-Clause note).

### 2.1 Magic UI - animation system - Path A
- **Registry** (shadcn-compatible): `npx shadcn@latest add "https://magicui.design/r/<name>.json" --cwd packages/presets`.
  Docs: https://magicui.design/docs/components/<name>. Repo `magicuidesign/magicui`. **MIT.** Built on
  `motion` - usually no new dep.
- **Priority pulls:** Marquee, Animated Beam, Border Beam (-> `effects/`); Shimmer Button (->
  `buttons/`); Bento Grid (-> `sections/`); Number Ticker, Animated Gradient Text (-> `text/`); Ripple,
  Dot Pattern, Grid Pattern (-> `backgrounds/` new); Text Reveal (-> `scroll/`).

### 2.2 Motion Primitives - legible motion - Path B (copy from docs)
- https://motion-primitives.com/docs/<name>. Repo `ibelick/motion-primitives`. **MIT.** Author
  @ibelick. Built on `motion`.
- **Priority pulls:** TextEffect, TextShimmer (-> `text/`), AnimatedGroup (stagger, -> `effects/`),
  Cursor (-> `cursor-fx/`), Tilt, Magnetic (-> `hover/`), InfiniteSlider, animated Dialog (->
  `overlays/`), animated Accordion (-> `disclosure/`). Value: simplest to read/modify - supports the
  "code stays honest" story.

### 2.3 React Bits - largest animated set - Path A (Commons Clause)
- **Registry:** `npx shadcn@latest add @react-bits/<Name>-TS-TW --cwd packages/presets` (pick
  **TS-TW** to match the repo). Docs https://reactbits.dev/. Repo `DavidHDev/react-bits`.
  **MIT + Commons Clause** - sidecar must record it; header must note "do not sell the library as-is."
  Author David Haz (@DavidHDev).
- **2D pulls (no new dep):** BlurText, SplitText, ShinyText, GradientText, RotatingText, CountUp (->
  `text/`); AnimatedContent, FadeContent, ClickSpark, StarBorder, SpotlightCard, TiltedCard (->
  `effects/`/`cards/`); PillNav (-> `navigation/`).
- **3D pulls (need three-stack - add sparingly):** Hyperspeed, Iridescence, Aurora, Threads, Silk,
  Beams, Balatro (-> `backgrounds/`).

### 2.4 Cult UI - refined shadcn-native - Path A
- **Registry:** `npx shadcn@latest add "https://cult-ui.com/r/<name>.json" --cwd packages/presets`.
  Docs https://www.cult-ui.com/docs/components/<name>. Repo `nolly-studio/cult-ui`. **MIT.**
- **Priority pulls:** TextureButton, FamilyButton (-> `buttons/`); TextureCard, ShiftCard, MinimalCard
  (-> `cards/`); DynamicIsland, Toolbar, animated Popover (-> `overlays/`). Compare DynamicIsland with
  the repo's existing toggle version.

### 2.5 Skiper UI - extend existing, attribution required - Path B
- https://skiper-ui.com/. Repo already ports skiper17/skiper41. Free tier **attribution required** -
  keep the "Attribution to Skiper UI is required when using the free version" line, and sidecar
  `attributionRequired: true` so the exporter enforces it. Pull more `skiperXX` scroll/card
  interactions into `scroll/`.

### 2.6 Aceternity UI - inspiration-first - rebuild
- Free components are MIT but Pro isn't; for a redistributed library **prefer rebuild** for
  Spotlight, 3D Card, Background Beams, Meteors, Lamp. If a specific free component is copied, verify
  no Pro dependency and credit `Aceternity UI (@mannupaaji), MIT`, sidecar `"ingest": "registry"`.
  Otherwise `ingest: 'rebuilt'` + header `Rebuilt from scratch, inspired by Aceternity UI`.

---

# TIER 4 - Inspiration sources (look, rebuild - don't bulk-copy)

### 4.1 UIverse.io - micro-interaction snippets - Path B (per-author license)
- https://uiverse.io/. Per-element **MIT or CC0** (shown on each page - CHECK, record in sidecar,
  keep the **individual creator's** name). Mostly HTML+CSS -> wrap in a small React component in
  `buttons/` `toggles/` `loaders/` `inputs/`. Best cheap way to expand `loaders/` and `toggles/`.

### 4.2 Mobbin - real-app UX patterns - reference only
- https://mobbin.com/. Never copy assets. Use to decide *what* a component does (empty states,
  onboarding, settings), then build it.

### 4.3 Godly / Refero / Screenlane / Savee / Cosmos - direction only
- godly.website, refero.design, screenlane.com, savee.it, cosmos.so. Inspiration only; feed
  `sections/` and theme design, not source.

### 4.4 The four galleries
- Awwwards, CSS Design Awards, Mindsparkle, Land-book - covered by
  `award-winning-web-design/SKILL.md`. Hero/section direction, not component code.

---

## 5. Folder additions

Each new folder becomes a Studio category automatically on scan:

```
packages/presets/src/
  overlays/      # Dialog, Popover, Dropdown, Tooltip, DynamicIsland   (shadcn / Base UI / Cult UI)
  disclosure/    # Accordion, Collapsible                              (shadcn / Motion Primitives)
  navigation/    # Tabs, PillNav, Toolbar, Breadcrumb                  (shadcn / React Bits / Cult UI)
  backgrounds/   # Marquee bgs, Dot/Grid pattern, Aurora, Beams        (Magic UI / React Bits)
```

Multi-category components (e.g. a magnetic button) live in their primary folder and gain a second
label via `tags` in the sidecar - no file duplication.

Extend existing folders: `text/` (Magic UI, Motion Primitives, React Bits text), `scroll/` (Skiper),
`hover/` (Magnetic, Tilt), `effects/` (beams, sparks, blur), `buttons/` `cards/` `inputs/` `loaders/`
`toggles/` `feedback/` `badges/` (UIverse + Cult UI + shadcn).

---

## 6. The hard rules (safety recap)

1. **Copy source 1:1 only from the YES rows** in section 4. Everything else is **rebuilt from
   scratch** with an honest header and `ingest: 'rebuilt'`.
2. **Never copy** Aceternity Pro, Shadcnblocks, Shadcn Studio, ogBlocks - one forbids use in
   AI/component-generation tools (which the Studio is) at $8,000/breach.
3. **Every component gets both** a credit header (section 2) **and** a `.meta.json` sidecar
   (section 0.2). The `build:credits` script cross-checks them and generates `NOTICE.md`; CI fails if
   a required attribution or a dependency is missing.
4. **Registry ingest (Path A) is preferred** wherever a source publishes one - it wires deps for you.
   Fall back to manual port (Path B) only when there's no registry.
5. Nothing here changes the **user-import** scan path - these changes are scoped to `source: 'preset'`.

---

## 7. UIverse - per-element sourcing procedure

UIverse hosts thousands of community elements across paginated category pages. **Do not bulk-scrape.**
The individual component code is MIT or CC0, but the *site's* terms of service govern how you pull it -
a separate license from the component's own. Curate instead:

1. **Work by category, not the full firehose.** Target the folders you're filling: buttons, toggles,
   checkboxes, switches, loaders, inputs, cards. UIverse sorts each category by most-liked.
2. **Take a curated subset per category** - roughly the top 10-15 that fit the Kinetic / Chrome-Console
   aesthetic. A preset library's value is curation; a dump of thousands of buttons makes it *worse*.
   Aim for ~60-80 quality elements total across categories, not "all."
3. **One element at a time, through the element's own page** (never an automated crawl of listing
   pages). Each element page shows its source **and** its license - read both.
4. **Check the license per element.** It is MIT *or* CC0, and it varies. Record the actual value in the
   sidecar `license` field. CC0 needs no legal attribution, but credit the author anyway.
5. **Keep the individual creator's name.** The author is the person who submitted the element, not
   "UIverse." Credit header + sidecar `author` point at them (matches the repo's existing Skiper
   credit style).
6. **Wrap HTML+CSS in a React shell.** UIverse elements are plain HTML/CSS. To fit the preset system:
   put the markup in a named component, lift the tunable CSS values (color, size, speed) to typed
   props with JSDoc so they appear in the Studio's Configure panel, and scope the CSS via a `<style>`
   tag so it serializes on export. Do **not** redesign the element - only shell + parameterize it.
   Sidecar `ingest: 'manual-port'`, `library: 'UIverse.io'`.

**Before any bulk pull, check for an official API/export.** If UIverse offers a documented data
endpoint, prefer it over page-reading - it respects the site ToS and yields clean per-element metadata.
If none exists, stay with the manual per-element flow above; there is no shortcut that skips reading
each element's license, because the license genuinely varies per element.

---

## 8. Future: shared-database architecture (production)

**Target state.** In production the preset library moves from bundled-in-repo files to a **database
that many users read from** (and, eventually, contribute to). This is a redistribution model, which
raises the licensing stakes - so the sidecar metadata becomes a first-class DB record, not an
afterthought. Everything in sections 0-7 is designed to survive this transition; the sidecar *is* the
schema.

### 8.1 Why the license discipline matters more here

A private/personal library copying MIT components is low-risk. A **multi-user service that serves
those components to other people is redistribution**, and per-component terms bind both the service and
its users:

- **React Bits (MIT + Commons Clause)** - "use" is fine, but the service must not *sell* access to a
  library whose value is substantially that code. A free tier is fine; a paid "component vault" built
  on React Bits is the failure case. Store the flag; gate accordingly.
- **Skiper (attribution required)** - the service must surface the credit to end users, not bury it.
  Every served component and every export must carry it.
- **UIverse (per-author MIT/CC0)** - the author credit travels with the record to every user.
- **Paid vendors (Aceternity Pro, Shadcnblocks, etc.)** - never enter the database at all.

### 8.2 Schema - promote the sidecar to a table

The `PresetMeta` sidecar (section 0.2) maps 1:1 onto a `components` table. Suggested columns:

```
components
  id                uuid  PK
  name              text
  category          text                 -- primary folder/category
  tags              text[]               -- multi-category (from sidecar.tags)
  source_code       text                 -- the .tsx (or a pointer to blob storage)
  prop_spec         jsonb                -- the docgen PropSpec[] (from the scan)
  runtime_flags     jsonb                -- RuntimeFlags (needsMocking, etc.)
  -- provenance & license (was the sidecar) --
  library           text
  source_url        text
  author            text
  license           text                 -- SPDX id, incl. 'MIT + Commons Clause'
  attribution_required   boolean
  ingest            text                 -- 'registry' | 'manual-port' | 'rebuilt'
  fetched_from      text                 -- registry ref / commit for staleness checks
  added_by          uuid  FK -> users    -- for user contributions (below)
  visibility        text                 -- 'public' | 'org' | 'private'
  created_at, updated_at
```

Rules the DB layer must enforce (mirror of section 6, now as constraints/queries):
- **Reject inserts** whose `library` is on the paid/restrictive denylist (Aceternity Pro,
  Shadcnblocks, Shadcn Studio, ogBlocks). A component with no verifiable license cannot be inserted.
- **`attribution_required = true`** -> the read/serve API must include `author`, `library`, and
  `source_url` in every response, and the exporter injects them into output (HTML comment / CREDITS.md).
- **License is not nullable.** No row exists without a known license - this is what keeps the shared
  library clean when thousands of users pull from it.

### 8.3 Multi-user access & contributions

- **Read/serve API** returns component + provenance together; a client can filter
  `WHERE license NOT LIKE '%Commons Clause%'` to get a **commercial-safe** subset, or by `visibility`.
- **User-contributed components** carry the same non-negotiable fields. A submission flow must require
  `library`/`source_url`/`author`/`license` (or `ingest: 'rebuilt'` + "original work" attestation)
  before a row is accepted - the sidecar's required fields become form validation. Never let a user
  upload a component without asserting its provenance; that is how a shared DB accidentally launders
  paid or unlicensed code to everyone.
- **NOTICE generation** (section 0.3's `build:credits`) becomes a query over the table, regenerated on
  every release, so the aggregate attribution file always matches what's actually served.

### 8.4 Migration path (no rewrite)

1. Keep building the file-based preset library now, with sidecars (sections 0-7). The sidecars are the
   seed data.
2. When the DB lands, write a one-shot importer: scan the preset folder, and for each component emit a
   row = scan output (`prop_spec`, `runtime_flags`) + its `.meta.json` sidecar. Because the sidecar
   fields already match the schema, this is a mechanical transform, not a redesign.
3. The Studio's `presets-plugin.ts` swaps its folder-scan source for a DB read behind the same
   `/api/presets` response shape - so nothing downstream changes.

**One-line summary for Claude Code:** build the file library with sidecars today; treat every sidecar
field as a future DB column that *cannot* be null; never let an unlicensed or paid-vendor component
into either the folder or (later) the table, because in the shared model it reaches every user.
