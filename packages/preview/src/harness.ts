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

const rootEl = document.getElementById('preview-root')
const root = createRoot(rootEl)

function post(msg) { parent.postMessage({ source: 'preview', ...msg }, '*') }

class ErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null } }
  static getDerivedStateFromError(err) { return { err } }
  componentDidCatch(err) { post({ type: 'error', message: String((err && err.message) || err) }) }
  render() { return this.state.err ? null : this.props.children }
}

let renderToken = 0

async function renderComponent({ module, exportName, props }) {
  const token = ++renderToken
  try {
    const mod = await import(/* @vite-ignore */ '/' + module)
    if (token !== renderToken) return
    const Comp = mod[exportName] || mod.default
    if (!Comp) { post({ type: 'error', message: 'Export "' + exportName + '" not found in ' + module }); return }
    root.render(React.createElement(ErrorBoundary, { key: token }, React.createElement(Comp, props || {})))
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (token !== renderToken) return
      const r = rootEl.getBoundingClientRect()
      post({ type: 'rendered', width: Math.ceil(r.width), height: Math.ceil(r.height) })
    }))
  } catch (e) {
    if (token === renderToken) post({ type: 'error', message: String((e && e.message) || e) })
  }
}

window.addEventListener('message', (ev) => {
  const d = ev.data
  if (d && d.source === 'studio' && d.type === 'render') renderComponent(d)
})

post({ type: 'ready' })
`
}

export const PREVIEW_HTML = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body { margin: 0; padding: 0; background: transparent; }
      #preview-root { display: inline-block; padding: 16px; }
    </style>
  </head>
  <body>
    <div id="preview-root"></div>
    <script type="module" src="/@id/virtual:preview-harness"></script>
  </body>
</html>
`
