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
      const echoesName = text !== '' && text === exportName && !hasFillOrMedia(rootEl)
      const blank = echoesName || !hasVisualSubstance(rootEl)
      playAnim(anim)
      const r = rootEl.getBoundingClientRect()
      post({ type: 'rendered', width: Math.ceil(r.width), height: Math.ceil(r.height), blank })
    })
  } catch (e) {
    if (token === renderToken) post({ type: 'error', message: String((e && e.message) || e) })
  }
}

function afterPaint(cb) {
  let done = false
  let timer
  const run = () => { if (!done) { done = true; clearTimeout(timer); cb() } }
  requestAnimationFrame(() => requestAnimationFrame(run))
  timer = setTimeout(run, 350)
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

// ---------------------------------------------------------------------------
// Hover demo (library cards): plays "what the component does" while the host
// card is hovered. Synthetic pointer events cover framer-motion interactions;
// CSS :hover rules can't be triggered synthetically, so they are cloned into
// .__hover-sim equivalents and the class is toggled instead. Scrollable /
// swiper / typing components get their own drivers. A component can pick its
// driver with data-hover-demo="hover|pointer|click|scroll|swiper|type|replay";
// without the attribute the driver is inferred.

let hoverSimBuilt = false
function buildHoverSimStyles() {
  if (hoverSimBuilt) return
  hoverSimBuilt = true
  let out = ''
  const visit = (rules) => {
    for (const rule of rules) {
      try {
        if (rule.selectorText && rule.selectorText.includes(':hover')) {
          const sel = rule.selectorText.split(':hover').join('.__hover-sim')
          out += sel + '{' + rule.style.cssText + '}\\n'
        } else if (rule.cssRules && rule.cssRules.length) {
          // Grouped rules: keep the original @media/@supports condition so a
          // simulated hover doesn't activate styles gated to other contexts.
          const cond = rule.conditionText
          if (rule.media || rule instanceof CSSMediaRule) {
            out += '@media ' + (cond || 'all') + '{'
            visit(rule.cssRules)
            out += '}'
          } else if (typeof CSSSupportsRule !== 'undefined' && rule instanceof CSSSupportsRule) {
            out += '@supports ' + cond + '{'
            visit(rule.cssRules)
            out += '}'
          } else if (!rule.selectorText) {
            // @layer and other transparent groups — recurse without a wrapper
            visit(rule.cssRules)
          }
        }
      } catch (e) { /* skip hostile rules */ }
    }
  }
  for (const sheet of document.styleSheets) {
    try { visit(sheet.cssRules) } catch (e) { /* cross-origin */ }
  }
  const el = document.createElement('style')
  el.id = '__hover-sim-styles'
  el.textContent = out
  document.head.appendChild(el)
}

const demo = { timers: [], tweens: [], lastTarget: null, active: false, blockNav: null }

function demoDispatchPointer(el, type, x, y) {
  const common = { bubbles: true, cancelable: true, composed: true, clientX: x, clientY: y, view: window }
  try { el.dispatchEvent(new PointerEvent('pointer' + type, { ...common, pointerId: 9, pointerType: 'mouse', isPrimary: true })) } catch (e) {}
  const mouseType = type === 'enter' ? 'enter' : type === 'leave' ? 'leave' : type === 'over' ? 'over' : type === 'out' ? 'out' : 'move'
  try { el.dispatchEvent(new MouseEvent('mouse' + mouseType, { ...common, ...(mouseType === 'enter' || mouseType === 'leave' ? { bubbles: false } : {}) })) } catch (e) {}
}

function demoClick(el, x, y) {
  const common = { bubbles: true, cancelable: true, composed: true, clientX: x, clientY: y, view: window }
  try {
    el.dispatchEvent(new PointerEvent('pointerdown', { ...common, pointerId: 9, pointerType: 'mouse', isPrimary: true }))
    el.dispatchEvent(new MouseEvent('mousedown', common))
    el.dispatchEvent(new PointerEvent('pointerup', { ...common, pointerId: 9, pointerType: 'mouse', isPrimary: true }))
    el.dispatchEvent(new MouseEvent('mouseup', common))
    el.dispatchEvent(new MouseEvent('click', common))
  } catch (e) {}
}

function findScrollable(rootNode) {
  const nodes = [rootNode, ...rootNode.querySelectorAll('*')]
  for (const n of nodes) {
    if (!(n instanceof Element)) continue
    if (n.scrollHeight > n.clientHeight + 8) {
      const cs = getComputedStyle(n)
      if (/(auto|scroll)/.test(cs.overflowY)) return n
    }
  }
  return null
}

function startDemo() {
  if (demo.active) return
  const rootNode = rootEl.firstElementChild
  if (!rootNode) return
  demo.active = true

  // Never let demo clicks navigate away (links or form submits).
  demo.blockNav = (e) => {
    if (e.type === 'submit') { e.preventDefault(); return }
    const a = e.target && e.target.closest && e.target.closest('a')
    if (a) e.preventDefault()
  }
  document.addEventListener('click', demo.blockNav, true)
  document.addEventListener('submit', demo.blockNav, true)

  const attrEl = rootNode.matches('[data-hover-demo]') ? rootNode : rootNode.querySelector('[data-hover-demo]')
  let mode = attrEl ? attrEl.getAttribute('data-hover-demo') : null
  const scrollable = findScrollable(rootNode)
  const swiperEl = rootNode.querySelector('.swiper')
  if (!mode) {
    if (swiperEl && swiperEl.swiper) mode = 'swiper'
    else if (scrollable) mode = 'scroll'
    else mode = 'pointer'
  }

  window.__demoMode = mode // debug handle: which driver the demo picked

  // CSS :hover simulation always runs — it's harmless where unused.
  buildHoverSimStyles()
  const simTargets = [rootNode, ...rootNode.querySelectorAll('*')]
  for (const n of simTargets) { if (n.classList) n.classList.add('__hover-sim') }

  if (mode === 'replay') {
    if (lastRender) renderComponent(lastRender)
    return
  }

  if (mode === 'swiper' && swiperEl && swiperEl.swiper) {
    demo.timers.push(setInterval(() => { try { swiperEl.swiper.slideNext() } catch (e) {} }, 1100))
    return
  }

  if (mode === 'scroll' && scrollable) {
    const max = scrollable.scrollHeight - scrollable.clientHeight
    const t = gsap.to(scrollable, {
      scrollTop: max,
      duration: Math.max(2.5, max / 400),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    })
    demo.tweens.push(t)
    return
  }

  if (mode === 'type') {
    const input = rootNode.querySelector('input, textarea')
    if (input) {
      input.focus()
      const proto = input.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
      const setter = Object.getOwnPropertyDescriptor(proto, 'value').set
      const phrase = 'Hello there'
      let i = 0
      demo.timers.push(setInterval(() => {
        i = (i + 1) % (phrase.length + 6)
        const next = phrase.slice(0, Math.min(i, phrase.length))
        try {
          setter.call(input, next)
          input.dispatchEvent(new Event('input', { bubbles: true }))
        } catch (e) {}
      }, 140))
    }
    return
  }

  if (mode === 'click') {
    const target = rootNode.querySelector('[data-demo-click]') || rootNode.querySelector('button') || attrEl || rootNode
    const clickIt = () => {
      const r = target.getBoundingClientRect()
      demoClick(target, r.left + r.width / 2, r.top + r.height / 2)
    }
    clickIt()
    demo.timers.push(setInterval(clickIt, 1300))
    return
  }

  // 'pointer' / 'hover': sweep a virtual cursor around the component so
  // pointer-driven interactions (framer whileHover/onHoverStart, mouse
  // followers, hover-expand tiles) play on their own.
  const bounds = () => rootNode.getBoundingClientRect()
  let angle = 0
  let last = null
  const step = () => {
    const b = bounds()
    if (b.width === 0 || b.height === 0) return
    angle += 0.045
    const x = b.left + b.width / 2 + (b.width / 2 - 8) * Math.sin(angle)
    const y = b.top + b.height / 2 + (b.height / 2 - 8) * Math.sin(angle * 0.6) * 0.8
    const el = document.elementFromPoint(x, y)
    if (!el || !rootNode.contains(el)) return
    if (last !== el) {
      if (last) { demoDispatchPointer(last, 'out', x, y); demoDispatchPointer(last, 'leave', x, y) }
      demoDispatchPointer(el, 'over', x, y)
      demoDispatchPointer(el, 'enter', x, y)
      last = el
      demo.lastTarget = el
    }
    demoDispatchPointer(el, 'move', x, y)
  }
  demoDispatchPointer(rootNode, 'enter', 0, 0)
  demo.timers.push(setInterval(step, 40))
}

function stopDemo() {
  if (!demo.active) return
  demo.active = false
  for (const t of demo.timers) clearInterval(t)
  demo.timers = []
  for (const t of demo.tweens) t.kill()
  demo.tweens = []
  if (demo.blockNav) {
    document.removeEventListener('click', demo.blockNav, true)
    document.removeEventListener('submit', demo.blockNav, true)
    demo.blockNav = null
  }
  const rootNode = rootEl.firstElementChild
  if (rootNode) {
    for (const n of [rootNode, ...rootNode.querySelectorAll('*')]) {
      if (n.classList) n.classList.remove('__hover-sim')
    }
  }
  if (demo.lastTarget) {
    demoDispatchPointer(demo.lastTarget, 'out', 0, 0)
    demoDispatchPointer(demo.lastTarget, 'leave', 0, 0)
    demo.lastTarget = null
  }
  if (rootNode) { demoDispatchPointer(rootNode, 'leave', 0, 0) }
}

let lastRender = null

window.addEventListener('message', (ev) => {
  const d = ev.data
  if (!d || d.source !== 'studio') return
  if (d.type === 'render') { lastRender = d; stopDemo(); renderComponent(d) }
  else if (d.type === 'serialize') {
    post({ type: 'serialized', nonce: d.nonce, html: rootEl.innerHTML, css: collectCss() })
  } else if (d.type === 'demo') {
    if (d.on) startDemo()
    else stopDemo()
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
