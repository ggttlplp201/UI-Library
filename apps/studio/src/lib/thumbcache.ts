/**
 * Library thumbnail cache: rendered previews serialized once and replayed as
 * instant static snapshots on later sessions, so opening a project doesn't
 * re-render 150+ live iframes ("rendering…" churn) every single time.
 *
 * The document CSS (tailwind utilities) is shared by every snapshot, so it is
 * stored once; each entry stores only its own HTML + measured size. Only
 * bundled presets are cached — imported project sources change under editing.
 */
const VERSION = 'v1'
const CSS_KEY = `css-thumb:${VERSION}:css`
const keyFor = (entryId: string) => `css-thumb:${VERSION}:${entryId}`

export interface ThumbSnap {
  html: string
  css: string
  w: number
  h: number
}

export function readThumb(entryId: string): ThumbSnap | null {
  try {
    const raw = localStorage.getItem(keyFor(entryId))
    const css = localStorage.getItem(CSS_KEY)
    if (!raw || !css) return null
    const snap = JSON.parse(raw) as { html: string; w: number; h: number }
    if (!snap.html || !snap.w || !snap.h) return null
    return { ...snap, css }
  } catch {
    return null
  }
}

export function writeThumb(entryId: string, html: string, css: string, w: number, h: number): void {
  if (!html || w <= 0 || h <= 0) return
  try {
    if (!localStorage.getItem(CSS_KEY)) localStorage.setItem(CSS_KEY, css)
    localStorage.setItem(keyFor(entryId), JSON.stringify({ html, w, h }))
  } catch {
    // Quota exceeded — thumbnails are a cache, not state. Live rendering
    // still works; just stop growing the cache.
  }
}
