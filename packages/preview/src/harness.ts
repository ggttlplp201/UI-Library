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
import { FX_CSS, FX_JS } from './fx.js'

export function harnessModule(cssImportLines: string, root = ''): string {
  return `${cssImportLines}
import React from 'react'
import { createRoot } from 'react-dom/client'

// Which project this harness serves — the Studio checks it against the root
// it *meant* to render from, so stale port mappings self-heal.
const SERVED_ROOT = ${JSON.stringify(root)}

const rootEl = document.getElementById('preview-root')
const root = createRoot(rootEl)

function post(msg) { parent.postMessage({ source: 'preview', ...msg }, '*') }

// Interaction effects (magnetic, ripple, tilt, …): behaviors attached to the
// rendered component, shared verbatim with the HTML export runtime.
${FX_JS}
{
  const fxStyle = document.createElement('style')
  fxStyle.textContent = ${JSON.stringify(FX_CSS)}
  document.head.appendChild(fxStyle)
}
let fxCleanup = null
let lastFx = null
function applyFx(fx) {
  lastFx = fx && fx.id ? fx : null
  if (fxCleanup) { fxCleanup(); fxCleanup = null }
  const target = rootEl.firstElementChild
  if (!target || !lastFx) return
  fxCleanup = __ssFxAttach(target, lastFx)
}

// Previews are fully interactive (real hover/click/scroll), but they must
// never NAVIGATE — a link or form submit would unload the harness and kill
// the frame. Block navigation while letting the click itself through.
document.addEventListener('click', (e) => {
  const a = e.target && e.target.closest && e.target.closest('a')
  if (a) e.preventDefault()
  // Tell the Studio a real click landed inside the component — used to run
  // "navigates to page X" links right on the canvas. Components can mark
  // individual buttons with data-link-slot="name" so each one can lead to a
  // different page; the slot rides along with the click.
  const slotEl = e.target && e.target.closest && e.target.closest('[data-link-slot]')
  post({ type: 'clicked', slot: slotEl ? slotEl.getAttribute('data-link-slot') : null })
}, true)
document.addEventListener('submit', (e) => e.preventDefault(), true)

// Animation playback. The Studio compiles the instance's AnimConfig into
// { keyframesCss, animationValue, trigger, once } (see lib/animation.ts) and
// the harness wires the trigger to a REAL user interaction: entrance plays on
// render, hover on pointerenter, click on click, scroll via
// IntersectionObserver. The HTML export generates the same CSS + wiring.
let animStyleEl = null
let animCleanup = null

function applyAnim(anim) {
  if (animCleanup) { animCleanup(); animCleanup = null }
  const target = rootEl.firstElementChild
  if (!target || !anim || !anim.animationValue) return
  if (!animStyleEl) {
    animStyleEl = document.createElement('style')
    animStyleEl.id = '__anim-keyframes'
    document.head.appendChild(animStyleEl)
  }
  animStyleEl.textContent = anim.keyframesCss || ''

  const run = () => {
    target.style.animation = 'none'
    void target.offsetWidth // restartable: flush so re-setting animates again
    target.style.animation = anim.animationValue
  }

  if (anim.trigger === 'hover') {
    target.addEventListener('pointerenter', run)
    animCleanup = () => target.removeEventListener('pointerenter', run)
  } else if (anim.trigger === 'click') {
    target.addEventListener('click', run)
    animCleanup = () => target.removeEventListener('click', run)
  } else if (anim.trigger === 'scroll') {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          run()
          if (anim.once) io.disconnect()
        }
      }
    }, { threshold: 0.25 })
    io.observe(target)
    animCleanup = () => io.disconnect()
  } else {
    run()
  }
  // The Studio's "Preview animation" button: play once right now even when
  // the trigger is an interaction the user hasn't performed yet.
  if (anim.playNow && anim.trigger !== 'entrance') run()
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

// A visual tag only counts when it actually paints something: an SVG that
// holds nothing but <defs> (filter/clip-path providers), a VIDEO with no
// source, an IMG with no src, or an empty media-controller shell are all
// invisible and must not rescue a preview. Returns true/false to count the
// node, or null to skip the node's remaining checks entirely.
function visualTagWeight(n) {
  const tag = (n.tagName || '').toUpperCase()
  if (tag === 'SVG') return n.querySelector(':scope > *:not(defs):not(title):not(desc):not(metadata)') ? true : null
  if (tag === 'VIDEO') return (n.currentSrc || n.getAttribute('src') || n.querySelector('source[src]')) ? true : null
  if (tag === 'IMG') return n.getAttribute('src') ? true : null
  if (tag === 'MEDIA-CONTROLLER') return n.querySelector('video, audio') ? true : null
  if (VISUAL_TAGS.has(tag)) return true
  return false
}

function hasVisualSubstance(el) {
  return eachVisible(el, (n, cs) => {
    const w = visualTagWeight(n)
    if (w !== false) return w === true
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
    const w = visualTagWeight(n)
    if (w !== false) return w === true
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

async function renderComponent({ module, exportName, props, anim, fx, host }) {
  const token = ++renderToken
  try {
    let mod
    try {
      mod = await import(/* @vite-ignore */ '/' + module)
    } catch (e) {
      // First-load races (dev server still transforming a heavy module chain)
      // surface as import failures; one retry beats permanently marking the
      // component broken in the library.
      await new Promise((r) => setTimeout(r, 1200))
      if (token !== renderToken) return
      mod = await import(/* @vite-ignore */ '/' + module)
    }
    if (token !== renderToken) return
    const Comp = mod[exportName] || mod.default
    if (!Comp) { post({ type: 'error', message: 'Export "' + exportName + '" not found in ' + module }); return }
    root.render(React.createElement(ErrorBoundary, { key: token, token }, React.createElement(Comp, props || {})))
    applyHost(host)
    // Double-rAF lets layout settle — but rAF never fires in hidden/background
    // tabs, so race it against a timeout or the preview would report nothing
    // until the tab becomes visible.
    afterPaint(() => {
      if (token !== renderToken) return
      // The error boundary already reported this render — don't overwrite it.
      if (erroredToken === token) return
      const text = (rootEl.textContent || '').trim()
      // Blank when it paints nothing, or when it just echoes its own export
      // name (our injected placeholder) with no real surface behind it.
      // Genuine text content (rolling headlines, tickers, animated numbers)
      // IS a preview — only the name-echo placeholder case stays blank.
      const echoesName = text !== '' && text === exportName && !hasFillOrMedia(rootEl)
      const hasRealText = text !== '' && text !== exportName
      const blank = echoesName || (!hasVisualSubstance(rootEl) && !hasRealText)
      // Style-tab overrides must be visible on every component, including ones
      // that never accept/spread a \`style\` prop (most demo components), so
      // apply them straight to the rendered root element as well.
      applyStyleOverride(props && props.style)
      applyHost(host)
      applyAnim(anim)
      applyFx(fx)
      const r = rootEl.getBoundingClientRect()
      // Report the component's named link slots (buttons marked with
      // data-link-slot) so the Studio can offer a per-button "links to" picker.
      const slots = []
      rootEl.querySelectorAll('[data-link-slot]').forEach((el) => {
        const s = el.getAttribute('data-link-slot')
        if (s && slots.indexOf(s) === -1) slots.push(s)
      })
      post({ type: 'rendered', width: Math.ceil(r.width), height: Math.ceil(r.height), blank, slots })
    })
  } catch (e) {
    if (token === renderToken) post({ type: 'error', message: String((e && e.message) || e) })
  }
}

// Smart-fit resize: the Studio can pin the mount root to an explicit size and
// the component's own root is stamped to fill it, so text/content reflows to
// the box instead of stretching. The inline stamp (not a class) survives
// serialization, so exports keep the resized layout.
function applyHost(host) {
  const w = host && host.w
  const h = host && host.h
  rootEl.style.width = w ? w + 'px' : ''
  rootEl.style.height = h ? h + 'px' : ''
  // The body is a flex row and the iframe starts at the OLD content width —
  // without this the pinned root flex-shrinks back to min-content.
  rootEl.style.flexShrink = w || h ? '0' : ''
  const child = rootEl.firstElementChild
  if (!child) return
  child.style.width = w ? '100%' : ''
  child.style.height = h ? '100%' : ''
  if (w || h) child.style.boxSizing = 'border-box'
}

// Only the Style-tab's CSS keys — never layout/transform, which components
// (framer-motion especially) manage themselves.
const OVERRIDE_KEYS = ['color', 'background', 'backgroundColor', 'fontFamily', 'fontWeight', 'fontSize']

function applyStyleOverride(style) {
  const target = rootEl.firstElementChild
  if (!target || !style || typeof style !== 'object') return
  for (const key of OVERRIDE_KEYS) {
    if (style[key] == null) continue
    const value = key === 'fontSize' && typeof style[key] === 'number' ? style[key] + 'px' : style[key]
    target.style[key] = value
  }
}

function afterPaint(cb) {
  let done = false
  let timer
  const run = () => { if (!done) { done = true; clearTimeout(timer); cb() } }
  requestAnimationFrame(() => requestAnimationFrame(run))
  timer = setTimeout(run, 350)
}

// Live size reporting: content grows/shrinks after the initial measure
// (animated numbers, late-loading images, reflowing inputs), and a stale
// one-shot size leaves the thumbnail clipped or over-zoomed. Report every
// settled size change; the Studio re-fits.
let lastW = -1
let lastH = -1
let sizeRaf = 0
const sizeObserver = new ResizeObserver(() => {
  cancelAnimationFrame(sizeRaf)
  sizeRaf = requestAnimationFrame(() => {
    const r = rootEl.getBoundingClientRect()
    const w = Math.ceil(r.width)
    const h = Math.ceil(r.height)
    if (w === lastW && h === lastH) return
    lastW = w
    lastH = h
    post({ type: 'size', width: w, height: h })
  })
})
sizeObserver.observe(rootEl)

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
    // Serialize the CLEAN host markup: effects mutate the DOM (glare layers,
    // clones, typed text), and the export re-attaches them itself via
    // [data-fx] — detach for the snapshot, then restore.
    const fxToRestore = lastFx
    if (fxCleanup) { fxCleanup(); fxCleanup = null }
    post({ type: 'serialized', nonce: d.nonce, html: rootEl.innerHTML, css: collectCss() })
    if (fxToRestore) applyFx(fxToRestore)
  }
})

post({ type: 'ready', root: SERVED_ROOT })
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
