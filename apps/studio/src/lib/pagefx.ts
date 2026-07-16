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

/**
 * Self-contained animated demo of a cursor effect for the page-settings
 * picker: a fake pointer glides in a loop over sample content while the
 * effect element (blend disc / glow dot) trails it. `ACC` = accent color.
 */
export function cursorPreviewHtml(id: string, accent: string): string {
  const fx =
    id === 'blend'
      ? `<div style="position:absolute;top:0;left:0;width:34px;height:34px;border-radius:50%;background:${accent};mix-blend-mode:difference;animation:ss-cursor-path 3.2s ease-in-out infinite;margin:-17px 0 0 -17px"></div>`
      : `<div style="position:absolute;top:0;left:0;width:26px;height:26px;border-radius:50%;background:radial-gradient(circle,${accent}bb,transparent 70%);animation:ss-cursor-path 3.2s ease-in-out infinite;margin:-13px 0 0 -13px"></div>`
  return `
<style>
@keyframes ss-cursor-path {
  0%   { transform: translate(34px, 30px); }
  30%  { transform: translate(150px, 48px); }
  55%  { transform: translate(96px, 66px); }
  80%  { transform: translate(190px, 28px); }
  100% { transform: translate(34px, 30px); }
}
</style>
<div style="position:relative;width:100%;height:100%;overflow:hidden;font-family:system-ui">
  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:10px">
    <span style="color:#e8e8ed;font-size:15px;font-weight:700">Sample</span>
    <span style="padding:3px 10px;border-radius:999px;background:#e8e8ed;color:#111;font-size:11px;font-weight:600">Button</span>
  </div>
  ${fx}
  <svg style="position:absolute;top:0;left:0;width:12px;height:12px;animation:ss-cursor-path 3.2s ease-in-out infinite;filter:drop-shadow(0 1px 1px rgba(0,0,0,.6))" viewBox="0 0 24 24"><path fill="#fff" stroke="#000" stroke-width="1.5" d="M5 3l14 8-6.5 1.5L9 19z"/></svg>
</div>`
}

export const loaderById = (id?: string) => LOADERS.find((l) => l.id === id)
export const cursorById = (id?: string) => CURSORS.find((c) => c.id === id)

/** Loader markup with the accent applied (picker preview + export). */
export function loaderHtml(def: LoaderDef, accent: string): string {
  return def.html.replaceAll('ACC', accent)
}
