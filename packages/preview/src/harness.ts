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

// Keys and pointer position are invisible to the parent while focus/hover is
// inside this iframe — forward what the Studio needs: Escape (close preview)
// and pointer moves (page cursor effects must keep tracking over components).
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return
  // Escape inside an editable field belongs to the field, not the preview.
  const t = e.target
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return
  // Defer the check: if a component (open menu/dialog) consumed this Escape
  // it will have preventDefault'ed by the time handlers finish — closing its
  // own layer should NOT also close the Studio's preview.
  setTimeout(() => { if (!e.defaultPrevented) post({ type: 'esc' }) }, 0)
})
document.addEventListener('pointermove', (e) => {
  post({ type: 'pointer', x: e.clientX, y: e.clientY })
}, { passive: true })

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

async function renderComponent({ module, exportName, props, anim, fx, host, theme }) {
  const token = ++renderToken
  // Match the page's theme: on dark pages the token-driven components
  // (text-foreground, bg-card, …) must resolve their .dark values or their
  // near-black text simply vanishes into the background.
  document.documentElement.classList.toggle('dark', theme === 'dark')
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
      const r = measureBounds()
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
  // Stamp every rendered element child to fill the pinned root — skipping
  // <style>/<script> tags many presets render before their real markup.
  // CRITICAL: only clear styles WE stamped earlier. Blindly resetting
  // width/height wiped components that size themselves with inline styles
  // (panels, dividers, figures) whenever no explicit size was set.
  for (const child of rootEl.children) {
    const tag = child.tagName
    if (tag === 'STYLE' || tag === 'SCRIPT' || tag === 'LINK' || tag === 'META') continue
    if (w || h) {
      child.style.width = w ? '100%' : child.style.width
      child.style.height = h ? '100%' : child.style.height
      child.style.boxSizing = 'border-box'
      child.__ssHostStamped = true
    } else if (child.__ssHostStamped) {
      child.style.width = ''
      child.style.height = ''
      child.style.boxSizing = ''
      delete child.__ssHostStamped
    }
  }
}

// Only the Style-tab's CSS keys — never layout/transform, which components
// (framer-motion especially) manage themselves.
const OVERRIDE_KEYS = ['color', 'background', 'backgroundColor', 'fontFamily', 'fontWeight', 'fontSize', 'fontStyle', 'letterSpacing', 'lineHeight']

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
// Visual bounds: transformed children (skewed sheens, rotated layers) often
// overflow the root's layout box and would be clipped by a frame sized to it.
// Union the descendants' rects rightward/downward, capped so components with
// long translated tracks (marquees) don't balloon their reported size.
function measureBounds() {
  const base = rootEl.getBoundingClientRect()
  let right = base.right
  let bottom = base.bottom
  for (const el of rootEl.querySelectorAll('*')) {
    const tag = el.tagName
    if (tag === 'STYLE' || tag === 'SCRIPT' || tag === 'LINK') continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 && r.height === 0) continue
    if (r.right > right) right = r.right
    if (r.bottom > bottom) bottom = r.bottom
  }
  const maxW = base.width * 1.5 + 40
  const maxH = base.height * 1.5 + 40
  let width = Math.min(right - base.left, maxW)
  let height = Math.min(bottom - base.top, maxH)
  // Open overlays (Radix dialogs, menus, popovers) portal to <body>, OUTSIDE
  // the root — without measuring them the frame stays trigger-sized and the
  // open content renders cropped. Union them in uncapped: the 1.5x cap only
  // exists for translated marquee tracks inside the root.
  for (const el of document.body.children) {
    if (el === rootEl) continue
    const tag = el.tagName
    if (tag === 'STYLE' || tag === 'SCRIPT' || tag === 'LINK') continue
    for (const n of [el, ...el.querySelectorAll('*')]) {
      const r = n.getBoundingClientRect()
      if (r.width === 0 && r.height === 0) continue
      if (r.right - base.left > width) width = r.right - base.left
      if (r.bottom - base.top > height) height = r.bottom - base.top
      // Viewport-centered overlays (fixed 50%/50% dialogs) overflow the TOP of
      // a trigger-sized frame — extending right/bottom alone under-reports.
      // The frame must be at least the overlay's own size for it to fit.
      if (r.width > width) width = r.width
      if (r.height > height) height = r.height
    }
  }
  return { width, height }
}

// (animated numbers, late-loading images, reflowing inputs), and a stale
// one-shot size leaves the thumbnail clipped or over-zoomed. Report every
// settled size change; the Studio re-fits.
let lastW = -1
let lastH = -1
let sizeRaf = 0
let sizeTimer = 0
const reportSize = () => {
  // rAF for coalescing — but raced against a timeout, because rAF never fires
  // in a hidden/background tab and a size change must not stall until the tab
  // is foregrounded again.
  cancelAnimationFrame(sizeRaf)
  clearTimeout(sizeTimer)
  let done = false
  const run = () => {
    if (done) return
    done = true
    clearTimeout(sizeTimer)
    const r = measureBounds()
    const w = Math.ceil(r.width)
    const h = Math.ceil(r.height)
    // Nothing rendered yet — a 0×0 report would shrink the Studio's frame to
    // zero and the component would then mount into a zero-width box.
    if (w === 0 && h === 0) return
    if (w === lastW && h === lastH) return
    lastW = w
    lastH = h
    post({ type: 'size', width: w, height: h })
  }
  sizeRaf = requestAnimationFrame(run)
  sizeTimer = setTimeout(run, 80)
}
const sizeObserver = new ResizeObserver(reportSize)
sizeObserver.observe(rootEl)
// Portals mount straight into <body>, invisible to the root's ResizeObserver —
// watch the body so an opening menu/dialog grows the frame to fit. And when
// the Studio then RESIZES this iframe, fixed-positioned overlays re-center to
// the new viewport — re-measure so the reported size converges.
new MutationObserver(reportSize).observe(document.body, { childList: true, subtree: true })
window.addEventListener('resize', reportSize)

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
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Inter+Tight:wght@400;600;800&family=Space+Grotesk:wght@400;500;700&family=Manrope:wght@400;600;800&family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;600;800&family=Archivo:wght@400;600;800&family=Syne:wght@400;600;800&family=Archivo+Black&family=Bebas+Neue&family=Playfair+Display:wght@400;600;800&family=Fraunces:wght@400;600;900&family=EB+Garamond:wght@400;600&family=IBM+Plex+Mono:wght@400;600&family=JetBrains+Mono:wght@400;600&family=Space+Mono:wght@400;700&family=Caveat:wght@500;700&display=swap" />
    <style>
      html, body { margin: 0; padding: 0; height: 100%; background: transparent; }
      /* flex-start (not center): the frame can be wider than the root when
         children overflow it (marquee tracks) — centering would shift the
         visible content right/down of the instance's canvas position. When the
         frame exactly fits the content the two are identical. */
      body { display: flex; align-items: flex-start; justify-content: flex-start; }
      /* max-content: the component lays out at its natural width even when the
         iframe is transiently narrow (first mount is 0/300px wide) — otherwise
         text wraps to min-content and the wrapped size gets reported back and
         locked in. An explicit host width (inline style) still overrides this. */
      /* flex-shrink 0: the body is a flex row, and without it the root gets
         squeezed below max-content to min-content whenever the iframe is
         narrower than the content — same wrap, different mechanism. */
      #preview-root { padding: 0; width: max-content; flex-shrink: 0; }
    </style>
  </head>
  <body>
    <div id="preview-root"></div>
    <script type="module" src="/@id/virtual:preview-harness"></script>
  </body>
</html>
`
