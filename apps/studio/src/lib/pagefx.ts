/**
 * Page-level effects: loading screens and cursor effects.
 *
 * Loaders aren't placeable components — nobody lays a spinner ON a design.
 * They're what a page shows while it loads. So the loader presets are hidden
 * from the Components library (categories `loaders` / `cursor-fx`) and picked
 * per PAGE instead (Configure panel with nothing selected). The catalog below
 * carries self-contained HTML/CSS for each effect: it renders the picker
 * preview in the studio and is embedded verbatim in the HTML export, where a
 * tiny runtime shows the overlay on first load and on every page navigation.
 */

/** Categories excluded from the placeable Components library. */
export const PAGE_FX_CATEGORIES = new Set(['loaders', 'cursor-fx'])

export interface LoaderDef {
  id: string
  name: string
  /** Overlay content; ACC is replaced with the accent color */
  html: string
}

/** Shared keyframes for every loader (kept in one block, injected once). */
export const LOADER_CSS = `
@keyframes fx-spin{to{transform:rotate(360deg)}}
@keyframes fx-dots{0%,80%,100%{transform:scale(.5);opacity:.4}40%{transform:scale(1);opacity:1}}
@keyframes fx-bar{0%{left:-40%}100%{left:100%}}
@keyframes fx-blob{0%{border-radius:42% 58% 63% 37%/41% 44% 56% 59%}50%{border-radius:63% 37% 41% 59%/58% 63% 37% 42%}100%{border-radius:42% 58% 63% 37%/41% 44% 56% 59%}}
@keyframes fx-bars{0%,100%{transform:scaleY(.28)}50%{transform:scaleY(1)}}
`

export const LOADERS: LoaderDef[] = [
  {
    id: 'spinner',
    name: 'Spinner',
    html: '<div style="width:40px;height:40px;border:4px solid rgba(128,136,144,.25);border-top-color:ACC;border-radius:50%;animation:fx-spin .7s linear infinite"></div>',
  },
  {
    id: 'dots',
    name: 'Bouncing dots',
    html:
      '<div style="display:flex;gap:8px">' +
      '<span style="width:11px;height:11px;border-radius:50%;background:ACC;animation:fx-dots 1.2s ease-in-out infinite"></span>' +
      '<span style="width:11px;height:11px;border-radius:50%;background:ACC;animation:fx-dots 1.2s ease-in-out .16s infinite"></span>' +
      '<span style="width:11px;height:11px;border-radius:50%;background:ACC;animation:fx-dots 1.2s ease-in-out .32s infinite"></span></div>',
  },
  {
    id: 'bar',
    name: 'Indeterminate bar',
    html:
      '<div style="position:relative;width:240px;height:8px;background:rgba(128,136,144,.25);border-radius:999px;overflow:hidden">' +
      '<div style="position:absolute;top:0;width:40%;height:100%;background:ACC;border-radius:999px;animation:fx-bar 1.3s ease-in-out infinite"></div></div>',
  },
  {
    id: 'blob',
    name: 'Morphing blob',
    html: '<div style="width:40px;height:40px;background:ACC;animation:fx-spin 3s linear infinite,fx-blob 3.5s ease-in-out infinite"></div>',
  },
  {
    id: 'orbit',
    name: 'Orbit',
    html:
      '<div style="position:relative;width:42px;height:42px;animation:fx-spin 1.2s linear infinite">' +
      '<span style="position:absolute;top:0;left:50%;width:9px;height:9px;margin-left:-4.5px;border-radius:50%;background:ACC"></span>' +
      '<span style="position:absolute;bottom:0;left:50%;width:9px;height:9px;margin-left:-4.5px;border-radius:50%;background:ACC"></span>' +
      '<span style="position:absolute;top:50%;left:0;width:9px;height:9px;margin-top:-4.5px;border-radius:50%;background:ACC"></span></div>',
  },
  {
    id: 'equalizer',
    name: 'Equalizer',
    html:
      '<div style="display:flex;gap:5px;align-items:center;height:42px">' +
      '<span style="width:5px;height:34px;border-radius:3px;background:ACC;animation:fx-bars 1s ease-in-out infinite"></span>' +
      '<span style="width:5px;height:34px;border-radius:3px;background:ACC;animation:fx-bars 1s ease-in-out .15s infinite"></span>' +
      '<span style="width:5px;height:34px;border-radius:3px;background:ACC;animation:fx-bars 1s ease-in-out .3s infinite"></span>' +
      '<span style="width:5px;height:34px;border-radius:3px;background:ACC;animation:fx-bars 1s ease-in-out .45s infinite"></span></div>',
  },
]

export interface CursorDef {
  id: string
  name: string
  description: string
}

export const CURSORS: CursorDef[] = [
  {
    id: 'blend',
    name: 'Blend disc',
    description: 'A solid accent disc trails the cursor and inverts whatever it crosses.',
  },
  {
    id: 'glow',
    name: 'Glow dot',
    description: 'A soft accent glow follows the cursor.',
  },
]

export const loaderById = (id?: string) => LOADERS.find((l) => l.id === id)
export const cursorById = (id?: string) => CURSORS.find((c) => c.id === id)

/** Loader markup with the accent applied (picker preview + export). */
export function loaderHtml(def: LoaderDef, accent: string): string {
  return def.html.replaceAll('ACC', accent)
}
