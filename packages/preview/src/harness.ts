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
      playAnim(anim)
      const r = rootEl.getBoundingClientRect()
      post({ type: 'rendered', width: Math.ceil(r.width), height: Math.ceil(r.height) })
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
      #preview-root { padding: 16px; }
    </style>
  </head>
  <body>
    <div id="preview-root"></div>
    <script type="module" src="/@id/virtual:preview-harness"></script>
  </body>
</html>
`
