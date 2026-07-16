# Recreated kits — art direction + build plan

Seven original sets *inspired by* (never copied from) UIverse UI kits, per Leon's brief:
each set follows the reference's art style, carries its own themed animations, registers
its `styleFamily` (already listed in LibraryPanel KITS), and lives in
`packages/presets/src/<family>/`. Sidecars: `ingest: "rebuilt"`, author Leon, MIT,
`styleFamily` as below. After all sets land: de-duplicate the sample pages (each page
gets unique components) — task #42/#43 tie-in.

Every set ships ~8 components + 2 themed animation presets (lib/animation.ts) or
loaders where noted. Components must be self-contained (inline styles / scoped <style>,
fonts via Google Fonts import in the component's <style> if non-system).

## 1. glitchtype — "Glitchtype" (reference: bad-dolphin-14)
Light retro-terminal. Cream paper `#f3efe4`, ink `#141310`, hairline 1px ink borders,
hard-edged blocks (radius 0–2px), VT323 / IBM Plex Mono type, acid-yellow `#f5e04b`
highlight blocks, chromatic RGB aberration (red/cyan offset text-shadows) on hover/keyframe.
Components: GlitchButton, GlitchHeading (RGB split), TerminalCard (spec-sheet border +
corner ticks), GlitchInput (block caret), GlitchToggle (ON/OK flips), GlitchBadge
(yellow highlight), ScanlinePanel (CRT scanline overlay), GlitchMarquee (ticker with
aberration). Animations: `glitch-in` (RGB split entrance), `crt-flicker`.

## 2. chicago95 — "Chicago 95" (reference: plastic-fly-44)
Retro desktop OS. Silver chrome `#c0c0c0`, classic bevels (light top-left `#fff`, dark
bottom-right `#404040` 2px), navy title bars `#000080` with white bold system type,
pixel-tight Tahoma/`'Pixelated MS Sans Serif', system-ui`. Components: Win95Window
(title bar + close/min buttons + content slot), Win95Button (bevel press), Win95Checkbox,
Win95Dialog (warning icon + OK/Cancel), Win95ProgressBar (chunked blue blocks),
Win95Taskbar (Start + clock), Win95Tabs, Win95Tooltip (yellow). Animations:
`bevel-press` (inset on click), `boot-blink`.

## 3. spritecraft — "Spritecraft" (reference: plastic-mule-29)
Light pixel-art game UI. Parchment `#f4e7c8`, chunky 4px stepped "pixel" borders
(box-shadow staircase, no radius), grass green `#57a63a` / sky `#4aa3e0` / coin gold
`#f2b632`, Press Start 2P / pixel type (small sizes). Components: SpriteButton (hard
shadow drops on press), HeartBar (HP hearts), CoinCounter (spinning coin), SpritePanel
(9-slice-look border), XPBar (segmented fill), SpriteToggle (lever), QuestBadge,
DialogBox (typewriter text). Animations: `pixel-pop` (steps() scale), `blink-8bit`.

## 4. marginalia — "Marginalia" (reference: big-shrimp-86)
School notebook. Ruled cream paper (repeating-linear-gradient blue rules every 28px),
red margin rule at left, ink blue `#2b4a9b`, pencil gray, Caveat / Shadows Into Light
handwriting accents over a serif body. Components: NotebookCard (ruled bg + margin),
StickyNote (rotated, shadow), InkButton (underline wobble), MarginTab (tabbed page edge),
Checklist (hand-drawn checks), RedStamp ("GRADED" rubber stamp), PaperClipBadge,
HighlighterText (marker highlight). Animations: `scribble-in` (clip-path write-on),
`sticky-drop`.

## 5. boldcase — "Boldcase" (reference: boldcase)
Editorial bento for creative studios. Warm paper `#efe9df`, oversized grotesk display
(Archivo Black / Anton), halftone dot overlays on photos, pop accents `#F91814` red /
`#2b46ff` blue / `#ffd750` yellow, bento cards with hard 2px ink borders and offset
shadows. Components: BentoCard, DisplayHeadline (clamped huge type), HalftonePhoto
(dot overlay), PopButton (offset-shadow press), IndexChip (numbered 01/02), StudioStat
(big number + rule), TapeLabel (angled tape), BentoGrid demo. Animations: `stamp-in`
(scale from 1.15 with hard ease), `offset-hover`.

## 6. voltura — "Voltura" (reference: voltura)
Dark-luxe trading workspace. Citrine field `#d8c26a` page, inky olive panels `#1d2016` /
`#262a1c`, acid-lime `#c8f542` single focal accent, tabular numerals (Space Grotesk /
IBM Plex Mono), thin 1px olive-light hairlines, soft 24px radii. Components:
VolturaPanel, TickerRow (green/red deltas), FocalCard (acid-lime, the one loud card),
SparkStat (mini sparkline SVG), VolturaButton, PositionBadge (LONG/SHORT), DepthMeter
(stacked bars), VolturaTabs. Animations: `charge-in` (lime underline sweep), `tick-flash`
(delta flash green/red).

## 7. overworld — "Overworld" (reference: overworld)
Pixel-art editorial for worldbuilders. Warm parchment `#ecdcb8`, 16-bit landscape strips
(CSS gradient terraces in dusk palette `#7a4a8a/#c86a4a/#e8a25a`), oversized blocky
display type (Silkscreen / Press Start 2P at LARGE sizes), thick ink outlines. Components:
WorldBanner (landscape strip + huge title), MapCard (parchment + corner compass),
QuestLogRow, BiomeBadge, PixelDivider (stepped), TravelButton, LorePanel (drop-cap),
CoordinateTag. Animations: `sunrise-in` (bg-position dawn sweep), `step-walk`
(steps() horizontal enter).

## Library registration
KITS in `apps/studio/src/components/LibraryPanel.tsx` already lists these families
(glitchtype, chicago95, spritecraft, marginalia, boldcase, voltura, overworld) — sets
appear automatically once components with matching `styleFamily` sidecars exist.

## Verification per set (required)
Typecheck → harness render probe (no ERR/BLANK) → open the studio, expand the kit in
the library, screenshot → drop 2–3 units on a canvas and screenshot → commit.
