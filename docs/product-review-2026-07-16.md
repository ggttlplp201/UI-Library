# Component Style Studio — product review (2026-07-16)

A full walkthrough of the app in a real browser: start screen → Arc Relay sample (canvas,
preview, all pages) → Component Systems → drag-drop editing, inline text editing, page
graph, export menu, import flow.

**Verdict: the bones are genuinely good — the "unfinished" feeling comes from about a
dozen specific, fixable things**, and most of them are trust/reliability issues rather
than visual design. The chrome itself (technical-dark, mono metadata, crisp radii) is
well executed.

## What already works well

- The core loop is real: drop a preset on the canvas → selection handles →
  Controls/Style/Animation panel → generated source in the code pane with
  "original source — no edits yet" status. That's the hard part, and it works.
- The Root page graph (pages as nodes, component ports wired to link targets) is a
  genuinely distinctive feature — this could be the product's signature.
- Preview mode runs the site for real (beams animate, cursor glow works), and the export
  menu ("Demo HTML" / "Source .zip, ready to diff") is exactly the right shape.
- The design token discipline in the studio shell is solid — tinted near-black, one
  near-white "accent," hairline borders, mono for chrome.

## Why it feels rough — in priority order

### 1. The editor doesn't feel safe to use (highest impact)

An editor lives or dies on trust, and right now three things break it:

- **No undo.** Dropping a component and pressing Cmd+Z does nothing. For a visual editor
  this is the single most expected keystroke in existence. Even a simple in-memory
  snapshot stack (composition state before each mutation) would transform the feel.
- **"New import" discards the session instantly, no confirmation.** One stray click in
  the top-right corner and the workspace is gone. It also lands on the *start screen*,
  not the import screen its label promises.
- **Reload = ejected to start screen.** Composition edits persist per project in
  localStorage (good), but *which project is open* doesn't. Any refresh, crash, or
  accidental navigation dumps you at the start. Persist the open project + page and
  restore silently — this one change would make the app feel 10× more solid.

Related: **Esc is unreliable.** The preview banner says "Back to canvas (Esc)," but when
focus is inside the preview iframe, Esc does nothing (the keydown never reaches the
shell). Listen for keys inside the iframe too, or postMessage them up.

### 2. The flagship sample sabotages the pitch

Arc Relay is the first thing anyone opens, and it currently demonstrates bugs instead of
the product:

- **The scroll set-piece never fires.** In preview it's a giant *white* rounded box
  reading "SCROLL DOWN TO SEE EFFECT" that stays blank forever, on a near-black page.
  The console shows why: Motion's `useScroll` warns the container needs non-static
  `position` for scroll offsets. This is the loudest "broken" moment in the whole app —
  fix it or pull the component from the sample.
- **Nav links point at pages that don't exist.** The navbar says Signal / Specs / Access;
  the actual pages are Launch / Specs / Access. Clicking "Signal" (nav or footer) sets an
  active state and goes nowhere — right after the preview banner promised "linked buttons
  navigate." The footer also lists "Press," which exists nowhere. Beyond fixing the
  sample, the product should *show* unlinked nav items on canvas (e.g. a dashed
  underline) so users can see dead links before preview.
- **The pier photo.** A tropical boardwalk captioned "Relay unit, first production run —
  anodized shell, single amber status lamp." Image and caption openly contradict each
  other; it reads as a placeholder someone forgot. Either source a plausible dark
  hardware shot or change the caption to match what's shown.
- **The stat cards are white, light-theme tiles on the dark page** — and all three say
  the identical "↑ 18.2% this month" under 12 / 240 / 99.99. Theme the tiles to the page
  and vary the numbers.
- **The marquee bleeds off the artboard.** On canvas, "SIGNAL OVER HYPE" text renders
  outside the 1280px page frame onto the workspace background. The page container on
  canvas needs `overflow: hidden` (or `contain: paint`).
- **The hero is inconsistent between canvas and preview.** On canvas there's a huge
  "ARC RELAY" kinetic headline; in preview only the small grey subtitle ever appeared,
  with the two CTAs floating at misaligned positions ("Read the specs" above and to the
  right of "Request access"). The sample promises "huge type" and the preview delivers a
  small grey sentence and two stray buttons.
- The **white navbar and white footer on a near-black page** read as a theme mismatch
  rather than a choice — especially with everything between them being dark.

### 3. Rendering churn makes the chrome feel janky

- **Library thumbnails re-render from scratch every single time** a project opens:
  157 tiles flash white with "rendering…" placeholders, and this repeats on every
  session. Cache rendered thumbnails (even just data-URLs in localStorage keyed by
  preset version) and render them dark-on-dark instead of white tiles in a dark UI.
  This is probably the biggest *perceived*-polish win per hour of work.
- Some thumbnails render **blank even when done** (BackgroundBeams, Meteors, Divider are
  near-invisible squares) — dark components on the light artboard or empty crops. Give
  effect-type presets a curated snapshot background.
- **The code pane opens by default at ~40% height showing only an empty state**
  ("Select a component…"). Collapse it until something is selected.
- **Developer strings leak into the UI**: double-clicking a heading surfaced
  `text: Element has no editable text content` in yellow in the code pane header — and
  it *stayed there* after editing stopped. Error copy should be human ("This element's
  text can't be edited directly") and should clear.

### 4. Onboarding undersells the product

- The start screen is text-only. For a *visual* styling tool, the sample cards should
  show mini preview thumbnails — the thumbnail renderer already exists; point it at the
  samples' hero sections.
- The import flow asks the user to **type an absolute folder path into a text field**.
  No browse button, no drag-and-drop of a folder, no recent paths — and **no way back**
  to the start screen once you're there. This is the roughest single screen in the app.
- The import screen repeats the start screen's entire hero ("Style any React component,
  visually.") — the second occurrence should be a compact header, not a re-pitch.

### 5. Copy and cosmetic details

- Em-dashes are used as the universal separator across UI copy ("Cinematic product
  launch — 3 linked pages", "export a working site — or the changed source", "Editorial
  portfolio — imagery first"). Pick plainer constructions; a period or comma reads
  cleaner and less template-y.
- The colored dots on the sample cards (amber/purple/red/green/grey) carry no meaning.
  If they're project accent-color keys, make that true visually inside the samples;
  otherwise drop them.
- Muted text (`#8a8f97` on `#0c0d0f`) is borderline for the smaller 10px labels in the
  export menu and panel captions — worth a contrast pass.
- "Viewing Week" under the segmented control in Component Systems is nearly invisible
  (dim-on-dark).

## Product focus (answered)

Import-a-real-folder is the actual product: users bring their own React project, move
their components around on the canvas to reorganize pages, and export the new code.
Presets/samples are the on-ramp for people without an existing project. That puts the
import flow and the edit→export round-trip on the money path, and re-orders the work:

## Product direction: Canva × Wix

The target feel, stated plainly: **Wix's outcome with Canva's hands.** A real,
exportable, multi-page website (Wix) built through direct, freeform, low-friction
manipulation (Canva) — more freedom than Wix's templates and slots, without giving up
production-grade output.

This resolves the layout-model question from the structural review. Neither extreme
works alone:

- Pure freeform (today's pinboard) exports broken, non-responsive pages.
- Pure flow (classic Wix/Webflow) is exactly the constraint the product wants to escape.

The professional version of "Canva × Wix" is the hybrid the newest site builders
(e.g. Wix Studio) converged on:

1. **Pages are vertical stacks of sections** (flow). Dragging a section reorders the
   stack, and reordering the stack reorders the exported JSX. This is what makes the
   export mergeable.
2. **Inside a section, placement is free** (canvas). Components can sit anywhere,
   overlap, rotate — Canva-style — but their position is stored as responsive
   constraints (anchors/offsets relative to the section grid), not raw pixels, so the
   section can re-solve at other breakpoints.
3. **Deliberate overlays stay freeform** (badges, stickers, floating CTAs) and export as
   intentional absolute positioning within their section, which is legitimate CSS when
   scoped to a positioned parent.

Canvas UX notes toward the "Canva hands" feel (the central function currently feels
uneasy to use):

- Sections should be first-class on the canvas: visible boundaries, insert-between
  affordances, drag handles, duplicate/delete per section.
- Snapping, smart guides, and equal-spacing hints on every drag (some guides exist
  today; they need to be everywhere and confident).
- Click = select, drag = move, double-click = edit text, right-click = context menu.
  No mode switching for the basics.
- Zoom/pan must be effortless (pinch, space-drag) and 60fps before anything else is
  tuned.

## New feature: custom component builder

Let users create their own components from scratch and save them into their library,
instead of only styling the bundled presets or imported source.

**Flow:**

1. **Pick a category first.** Button, dropdown, card, input, navigation bar, badge,
   toggle, accordion, carousel, section/hero, footer — the major types. The category
   choice seeds the builder with the right base skeleton (e.g. a button starts as a
   focusable element with a label slot; a dropdown starts with a trigger + menu), so
   custom components inherit correct semantics, keyboard behavior, and accessibility
   for free rather than being raw divs.
2. **Draw/creation canvas.** A focused editor (same canvas engine, component-sized
   artboard) where the user composes the component visually: draw shapes/containers,
   add text and icon slots, set fills, borders, radii, spacing, and states.
3. **Compose from the existing library.** The current preset list is available as
   building blocks inside the builder — drop an existing badge into a custom card,
   wrap an existing input with a custom label treatment, etc. Custom components are
   compositions, not walled-off drawings.
4. **Define the surface.** The user marks which parts are editable when the component
   is used: text slots, color controls, an optional link target. This is what makes the
   result behave like a first-class preset (shows in the library with a thumbnail,
   Controls tab works, animation attachable).
5. **Save to "My components."** A user section in the library panel, same cards and
   search as presets. Export emits each custom component as its own clean source file,
   so hand-off to code stays honest.

**States and variants (what separates this from a sticker editor):** each category
carries its interactive states (hover, active, focus, disabled; open/closed for
disclosure types). The builder exposes them as tabs on the artboard so users style
states visually rather than discovering later that their button has no hover.

**Scope guard for v1:** categories + compose-from-existing + text/color/spacing/state
editing + save/export. Free-path vector drawing (true pen tool) can come later; the
80% case is composing and restyling primitives, not drawing bezier curves.

## Suggested work sequence

1. **Import screen is the storefront of the real product** — folder browse or
   drag-and-drop (not a typed absolute path), recent projects list, a back link, and a
   real scan experience: progress, file counts as they come in, and human-readable
   errors when a folder has no components or fails to parse.
2. Session restore on reload + confirm before "New import" (small, massive trust gain —
   doubly important when the session holds edits to a user's own source).
3. Undo/redo stack.
4. **Harden the round-trip**: import a real mid-size project → move/restyle components →
   export source → diff. Every rough edge in that loop (lost formatting, broken imports,
   position edits that don't survive) is a direct hit to the core promise. Make this a
   repeatable test, not a one-off.
5. Fix Arc Relay: scroll set-piece position bug, nav→page mismatches, pier photo,
   stat tiles, marquee clipping (still matters — it's the first impression for
   from-scratch users).
6. Thumbnail cache + dark tiles (kills the white-flash churn).
7. Code pane collapsed by default, human error copy.
8. Start-screen sample thumbnails.

The start screen framing can also reflect the priority: "point it at your project" as
the primary action with samples beneath it — right now the samples visually dominate
and "Start building" reads like the secondary path.
