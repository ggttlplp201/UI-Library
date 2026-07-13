/**
 * Source of the virtual harness module served inside each preview iframe.
 *
 * Runs in the *imported project's* Vite context (child server), so `react`,
 * `react-dom`, and the project's CSS all resolve from the project's own
 * node_modules and Tailwind setup — no shims, no CDNs. Deliberately written
 * with `React.createElement` (no JSX) so it needs no JSX transform.
 *
 * Protocol (postMessage, both directions, `source: 'preview'`):
 *   parent -> frame: { type: 'render', module, exportName, props }
 *   frame  -> parent: { type: 'ready' }
 *                     { type: 'rendered', width, height }
 *                     { type: 'error', message }
 */
export function harnessModule(cssImportLines: string): string {
  return `${cssImportLines}
import React from 'react'
import { createRoot } from 'react-dom/client'
import { gsap } from 'gsap'

const rootEl = document.getElementById('preview-root')
const root = createRoot(rootEl)

function post(msg) { parent.postMessage({ source: 'preview', ...msg }, '*') }

// GSAP animation presets — mirror lib/animation.ts in the Studio. Each returns
// a from-vars object; 'bounce' overrides the ease.
const ANIM_FROM = {
  fade: { opacity: 0 },
  'slide-up': { opacity: 0, y: 24 },
  scale: { opacity: 0, scale: 0.8 },
  bounce: { opacity: 0, y: -24 },
}

function playAnim(anim) {
  const target = rootEl.firstElementChild
  if (!target || !anim || !anim.preset || anim.preset === 'none') return
  const from = ANIM_FROM[anim.preset]
  if (!from) return
  gsap.fromTo(target, from, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    duration: anim.duration ?? 0.5,
    delay: anim.delay ?? 0,
    ease: anim.preset === 'bounce' ? 'bounce.out' : (anim.easing ?? 'power2.out'),
  })
}

let renderToken = 0
let erroredToken = -1

// A component "previews" meaningfully only if it paints something — a fill,
// border, shadow, image, or form control. Compound wrappers (DialogHeader,
// DropdownMenuGroup, …) with no standalone chrome render as bare text (usually
// just our injected placeholder), which looks broken in the library grid. We
// flag those so the host can show a calm placeholder instead of raw text.
const VISUAL_TAGS = new Set([
  'IMG', 'SVG', 'CANVAS', 'VIDEO', 'PICTURE', 'INPUT', 'TEXTAREA', 'SELECT', 'BUTTON',
])
// Walk el and every descendant (querySelectorAll('*') spans all roots, so a
// fragment with sibling roots is covered), skipping nodes that paint nothing
// because they're hidden.
function eachVisible(el, visit) {
  if (!el) return false
  const nodes = [el]
  for (const n of el.querySelectorAll('*')) nodes.push(n)
  for (const n of nodes) {
    let cs
    try { cs = getComputedStyle(n) } catch (e) { continue }
    if (cs.display === 'none' || cs.visibility === 'hidden') continue
    if (visit(n, cs)) return true
  }
  return false
}

function hasVisualSubstance(el) {
  return eachVisible(el, (n, cs) => {
    if (VISUAL_TAGS.has((n.tagName || '').toUpperCase())) return true
    const bg = cs.backgroundColor
    if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') return true
    if (cs.backgroundImage && cs.backgroundImage !== 'none') return true
    if (cs.boxShadow && cs.boxShadow !== 'none') return true
    const bw =
      parseFloat(cs.borderTopWidth) + parseFloat(cs.borderRightWidth) +
      parseFloat(cs.borderBottomWidth) + parseFloat(cs.borderLeftWidth)
    return bw > 0 && cs.borderStyle !== 'none'
  })
}

// A filled surface or media/control — the stuff that makes a preview worth
// showing. Deliberately excludes borders/shadows: a hairline divider on an
// otherwise text-only wrapper (e.g. DialogFooter's border-t) shouldn't save it.
function hasFillOrMedia(el) {
  return eachVisible(el, (n, cs) => {
    if (VISUAL_TAGS.has((n.tagName || '').toUpperCase())) return true
    const bg = cs.backgroundColor
    if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') return true
    return cs.backgroundImage && cs.backgroundImage !== 'none'
  })
}

class ErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null } }
  static getDerivedStateFromError(err) { return { err } }
  componentDidCatch(err) {
    erroredToken = this.props.token
    post({ type: 'error', message: String((err && err.message) || err) })
  }
  render() { return this.state.err ? null : this.props.children }
}

async function renderComponent({ module, exportName, props, anim }) {
  const token = ++renderToken
  try {
    const mod = await import(/* @vite-ignore */ '/' + module)
    if (token !== renderToken) return
    const Comp = mod[exportName] || mod.default
    if (!Comp) { post({ type: 'error', message: 'Export "' + exportName + '" not found in ' + module }); return }
    root.render(React.createElement(ErrorBoundary, { key: token, token }, React.createElement(Comp, props || {})))
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (token !== renderToken) return
      // The error boundary already reported this render — don't overwrite it.
      if (erroredToken === token) return
      const text = (rootEl.textContent || '').trim()
      // Blank when it paints nothing, or when it just echoes its own export
      // name (our injected placeholder) with no real surface behind it.
      const echoesName = text !== '' && text === exportName && !hasFillOrMedia(rootEl)
      const blank = echoesName || !hasVisualSubstance(rootEl)
      playAnim(anim)
      const r = rootEl.getBoundingClientRect()
      post({ type: 'rendered', width: Math.ceil(r.width), height: Math.ceil(r.height), blank })
    }))
  } catch (e) {
    if (token === renderToken) post({ type: 'error', message: String((e && e.message) || e) })
  }
}

// Collect the document's generated CSS (Tailwind utilities/theme) so an export
// snapshot is self-contained.
function collectCss() {
  let css = ''
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) css += rule.cssText + '\\n'
    } catch (e) {
      // cross-origin sheet — skip
    }
  }
  return css
}

window.addEventListener('message', (ev) => {
  const d = ev.data
  if (!d || d.source !== 'studio') return
  if (d.type === 'render') renderComponent(d)
  else if (d.type === 'serialize') {
    post({ type: 'serialized', nonce: d.nonce, html: rootEl.innerHTML, css: collectCss() })
  }
})

post({ type: 'ready' })
`
}

export const PREVIEW_HTML = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body { margin: 0; padding: 0; height: 100%; background: transparent; }
      body { display: flex; align-items: center; justify-content: center; }
      #preview-root { padding: 0; }
    </style>
  </head>
  <body>
    <div id="preview-root"></div>
    <script type="module" src="/@id/virtual:preview-harness"></script>
  </body>
</html>
`
