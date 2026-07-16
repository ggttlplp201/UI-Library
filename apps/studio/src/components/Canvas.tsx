import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { RegistryEntry } from '@component-style-studio/registry'
import { compileAnim } from '../lib/animation'
import { MIN_BOARD_HEIGHT, type Instance } from '../lib/canvas'
import { composeRenderProps } from '../lib/controls'
import { PreviewFrame, type PreviewHandle } from './PreviewFrame'
import { DRAG_MIME } from './LibraryCard'

export type CanvasTheme = 'dark' | 'light'

/** One page's serialized composition, ready for the multi-page assembler. */
export interface PageSnapshot {
  /** Absolutely-positioned instance markup for the page body */
  body: string
  /** Component CSS blocks (Tailwind output etc.) to dedupe across pages */
  cssBlocks: string[]
  /** Animation @keyframes used on this page */
  animCss: string[]
  /** How many instances actually serialized (readiness signal for retries) */
  serialized: number
  /** Content-driven board height (bottom-most instance edge + padding) */
  contentHeight: number
}

/** Imperative handle so the header's Export button can snapshot the canvas. */
export interface CanvasHandle {
  /** Serialize the CURRENTLY mounted page's instances. */
  snapshotPage: () => Promise<PageSnapshot>
}

// The artboard is the page the user designs; the gutter is the studio floor
// around it (Canva-style). Board bg matches the exported page background.
const BOARD_BG: Record<CanvasTheme, string> = { dark: '#0c0c0f', light: '#ffffff' }
const GUTTER_BG: Record<CanvasTheme, string> = { dark: '#1a1a1f', light: '#e8e8ec' }
const DOT_COLOR: Record<CanvasTheme, string> = {
  dark: 'rgba(255,255,255,0.10)',
  light: 'rgba(0,0,0,0.10)',
}
/** Breathing room around the artboard inside the scrollable viewport. */
const BOARD_MARGIN = 48

// Corner handles scale both axes proportionally (Canva-style); edge handles
// stretch one axis (length); a dedicated handle rotates.
const CORNERS = [
  { className: '-top-1.5 -left-1.5', cursor: 'nwse-resize' },
  { className: '-top-1.5 -right-1.5', cursor: 'nesw-resize' },
  { className: '-bottom-1.5 -left-1.5', cursor: 'nesw-resize' },
  { className: '-bottom-1.5 -right-1.5', cursor: 'nwse-resize' },
]
type Edge = 'n' | 's' | 'e' | 'w'
const EDGES: { edge: Edge; className: string; cursor: string }[] = [
  { edge: 'n', className: '-top-1.5 left-1/2 -translate-x-1/2', cursor: 'ns-resize' },
  { edge: 's', className: '-bottom-1.5 left-1/2 -translate-x-1/2', cursor: 'ns-resize' },
  { edge: 'w', className: 'top-1/2 -left-1.5 -translate-y-1/2', cursor: 'ew-resize' },
  { edge: 'e', className: 'top-1/2 -right-1.5 -translate-y-1/2', cursor: 'ew-resize' },
]

interface MoveState {
  id: string
  pointerX: number
  pointerY: number
  /** Drag origin of every instance moving with this gesture (group move). */
  origins: [string, { x: number; y: number }][]
  moved: boolean
}

interface MarqueeState {
  x0: number
  y0: number
  x1: number
  y1: number
  moved: boolean
}

// Components that render tiny (icon buttons, dots) get auto-upscaled on insert
// so they're visible/grabbable; the user can always rescale afterwards.
const TINY_DIM = 64
const TINY_MAX_SCALE = 3
interface TransformState {
  id: string
  mode: 'scale' | 'rotate' | 'resize'
  edge?: Edge
  centerX: number
  centerY: number
  pointerX: number
  pointerY: number
  originDist: number
  originScaleX: number
  originScaleY: number
  originAngle: number
  originRotation: number
  originX: number
  originY: number
  naturalW: number
  naturalH: number
  /** Smart-fit resize: displayed box at drag start ((w ?? nat.w) × scale) */
  originDisplayW: number
  originDisplayH: number
  /** Whether edge handles stretch (text locked) or resize the real box */
  textLock: boolean
}

type TransformPatch = { scaleX?: number; scaleY?: number; rotation?: number; w?: number; h?: number }

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

interface CanvasProps {
  instances: Instance[]
  entryById: (id: string) => RegistryEntry | undefined
  rootFor: (entry: RegistryEntry) => string
  theme: CanvasTheme
  selectedId: string | null
  onSelect: (id: string | null) => void
  /** Full (possibly multi) selection; marquee select reports through this. */
  selectedIds: string[]
  onSelectMany: (ids: string[]) => void
  onAdd: (entryId: string, x: number, y: number) => void
  onMove: (id: string, x: number, y: number) => void
  onTransform: (id: string, patch: TransformPatch) => void
  onRemove: (id: string) => void
  textOf: (inst: Instance) => string
  onEditText: (id: string, text: string) => void
  /** Export href for an instance's page link (e.g. "#/pricing"), if any */
  linkHrefFor?: (inst: Instance) => string | null
  /** Export href for one of an instance's named button slots, if configured */
  slotHrefFor?: (inst: Instance, slot: string) => string | null
  /** Follow an instance's page link (clicked live on the canvas) */
  onNavigate?: (pageId: string) => void
  /** A component reported its named link slots (data-link-slot buttons) */
  onSlotsReported?: (instanceId: string, slots: string[]) => void
  /** Artboard (page) width for the active page */
  artboardWidth: number
  /** Explicit artboard height the user dragged out (content can exceed it) */
  boardHeight?: number
  onBoardHeightChange?: (h: number) => void
}

export const Canvas = forwardRef<CanvasHandle, CanvasProps>(function Canvas(
  {
    instances,
    entryById,
    rootFor,
    theme,
    selectedId,
    onSelect,
    selectedIds,
    onSelectMany,
    onAdd,
    onMove,
    onTransform,
    onRemove,
    textOf,
    onEditText,
    linkHrefFor,
    slotHrefFor,
    onNavigate,
    onSlotsReported,
    artboardWidth,
    boardHeight,
    onBoardHeightChange,
  },
  ref,
) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const moveRef = useRef<MoveState | null>(null)
  // Whether the last pointer gesture actually dragged (suppresses the click).
  const moveRefMoved = useRef(false)
  const transformRef = useRef<TransformState | null>(null)
  const frameRefs = useRef(new Map<string, PreviewHandle>())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [natural, setNatural] = useState<Record<string, { w: number; h: number }>>({})
  // Live mode: the selected instance receives real pointer events (toggles
  // toggle, links navigate). Off by default so dragging anywhere moves it.
  const [liveId, setLiveId] = useState<string | null>(null)
  const [marquee, setMarquee] = useState<MarqueeState | null>(null)
  const marqueeRef = useRef<MarqueeState | null>(null)
  const autoScaled = useRef(new Set<string>())

  // Zoom: the artboard renders at `zoom` inside a scrollable viewport.
  // Default fits the artboard's width to the panel (never above 100%).
  const [zoom, setZoom] = useState(1)
  const zoomRef = useRef(zoom)
  zoomRef.current = zoom
  // Viewport width as state so the layout centers correctly on first paint
  // and follows panel resizes.
  const [vpWidth, setVpWidth] = useState(0)
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    const ro = new ResizeObserver(() => setVpWidth(vp.clientWidth))
    ro.observe(vp)
    setVpWidth(vp.clientWidth)
    return () => ro.disconnect()
  }, [])
  const fitZoom = () => {
    const vw = viewportRef.current?.clientWidth ?? 0
    if (vw > 0) setZoom(clamp((vw - BOARD_MARGIN * 2) / artboardWidth, 0.15, 1))
  }
  // Refit when the page's artboard width changes or the panel first measures.
  const vpReady = vpWidth > 0
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fitZoom, [artboardWidth, vpReady])
  // Cmd/Ctrl+scroll zooms (native listener: React's wheel handler is passive,
  // so preventDefault to stop browser page-zoom only works here).
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      setZoom((z) => clamp(z * (1 - e.deltaY * 0.0022), 0.15, 2))
    }
    vp.addEventListener('wheel', onWheel, { passive: false })
    return () => vp.removeEventListener('wheel', onWheel)
  }, [])

  // Selection handles live inside the zoomed board — compensate so they stay
  // a grabbable size on screen at any zoom.
  const handlePx = Math.round(12 / Math.max(zoom, 0.35))

  // Canva-style snapping: while dragging, edges/centers pull toward the
  // artboard's edges/center and other elements' edges/centers, drawing pink
  // guide lines. Alt disables. Threshold is constant on screen (6px).
  const [guides, setGuides] = useState<{ v: number[]; h: number[] }>({ v: [], h: [] })
  const boxOf = (i: Instance) => {
    const nat = natural[i.id]
    return { w: (nat?.w ?? 0) * (i.scaleX ?? 1), h: (nat?.h ?? 0) * (i.scaleY ?? 1) }
  }
  const applySnap = (
    movingIds: string[],
    x: number,
    y: number,
    w: number,
    h: number,
    disabled: boolean,
  ): { x: number; y: number; v: number[]; hz: number[] } => {
    if (disabled) return { x, y, v: [], hz: [] }
    const th = 6 / Math.max(zoomRef.current, 0.15)
    const vTargets: number[] = [0, artboardWidth / 2, artboardWidth]
    const hTargets: number[] = [0, boardH]
    for (const other of instances) {
      if (movingIds.includes(other.id)) continue
      const ob = boxOf(other)
      if (ob.w === 0) continue
      vTargets.push(other.x, other.x + ob.w / 2, other.x + ob.w)
      hTargets.push(other.y, other.y + ob.h / 2, other.y + ob.h)
    }
    let bestV: { d: number; t: number; edge: number } | null = null
    for (const t of vTargets)
      for (const edge of [0, w / 2, w]) {
        const d = Math.abs(x + edge - t)
        if (d < th && (!bestV || d < bestV.d)) bestV = { d, t, edge }
      }
    let bestH: { d: number; t: number; edge: number } | null = null
    for (const t of hTargets)
      for (const edge of [0, h / 2, h]) {
        const d = Math.abs(y + edge - t)
        if (d < th && (!bestH || d < bestH.d)) bestH = { d, t, edge }
      }
    return {
      x: bestV ? bestV.t - bestV.edge : x,
      y: bestH ? bestH.t - bestH.edge : y,
      v: bestV ? [bestV.t] : [],
      hz: bestH ? [bestH.t] : [],
    }
  }

  // Artboard height: ONLY the bottom-edge grip grows the page — the board
  // must not chase components being dragged near its bottom edge. Content can
  // hang past the edge (bleed); the stage still scrolls far enough to reach it.
  const contentBottom = instances.reduce((b, i) => {
    const nat = natural[i.id]
    return Math.max(b, i.y + (nat ? nat.h * (i.scaleY ?? 1) : 0))
  }, 0)
  const boardH = Math.max(MIN_BOARD_HEIGHT, boardHeight ?? 0)
  const heightDrag = useRef<{ startY: number; startH: number } | null>(null)

  /** Client → artboard coordinates (compensates zoom). */
  const localPoint = (clientX: number, clientY: number) => {
    const rect = surfaceRef.current?.getBoundingClientRect()
    const z = zoomRef.current || 1
    return { x: (clientX - (rect?.left ?? 0)) / z, y: (clientY - (rect?.top ?? 0)) / z }
  }

  useImperativeHandle(ref, () => ({
    snapshotPage: async () => {
      const cssBlocks = new Set<string>()
      const animCss = new Set<string>()
      const parts: string[] = []
      let serialized = 0
      for (const inst of instances) {
        const snap = (await frameRefs.current.get(inst.id)?.serialize()) ?? null
        if (!snap) continue
        serialized += 1
        if (snap.css) cssBlocks.add(snap.css)
        // Per-button links: stamp configured slots with data-nav="#/slug" so
        // the export runtime can navigate them (a nested <a> can't wrap just
        // one button of serialized markup safely).
        let html = snap.html
        if (inst.links && slotHrefFor && html.includes('data-link-slot')) {
          const doc = new DOMParser().parseFromString(`<div id="__slot-wrap">${html}</div>`, 'text/html')
          let touched = false
          doc.querySelectorAll('[data-link-slot]').forEach((el) => {
            const slot = el.getAttribute('data-link-slot')
            const href = slot ? slotHrefFor(inst, slot) : null
            if (href) {
              el.setAttribute('data-nav', href)
              touched = true
            }
          })
          if (touched) html = doc.getElementById('__slot-wrap')?.innerHTML ?? html
        }
        const rotation = inst.rotation ?? 0
        const sx = inst.scaleX ?? 1
        const sy = inst.scaleY ?? 1
        const nat = natural[inst.id]

        // Animation: same compiled CSS the preview harness ran, replayed in
        // the export by a tiny runtime that wires the REAL trigger events.
        const compiled = compileAnim(inst.anim)
        let animAttr = ''
        if (compiled) {
          animCss.add(compiled.keyframesCss)
          const cfg = { value: compiled.animationValue, trigger: compiled.trigger, once: compiled.once }
          animAttr = ` data-anim="${JSON.stringify(cfg).replace(/"/g, '&quot;')}"`
        }
        // Interaction effect: the export runtime re-attaches the same behavior
        // (shared FX_JS) to this wrapper when its page shows.
        if (inst.fx?.id) {
          animAttr += ` data-fx="${JSON.stringify(inst.fx).replace(/"/g, '&quot;')}"`
        }

        // Mirror the on-canvas structure: outer wrapper rotates about its
        // center at (natural × scale) size; inner wrapper scales from top-left.
        // The animation rides on its OWN nested div — animation keyframes set
        // `transform`, which would otherwise clobber the rotation/scale.
        const animated = (inner: string) => (animAttr ? `<div${animAttr}>${inner}</div>` : inner)
        let markup: string
        if (nat) {
          markup =
            `<div style="position:absolute;left:${inst.x}px;top:${inst.y}px;width:${nat.w * sx}px;height:${nat.h * sy}px;transform:rotate(${rotation}deg);transform-origin:center center;">` +
            animated(
              `<div style="width:${nat.w}px;height:${nat.h}px;transform:scale(${sx},${sy});transform-origin:top left;">${html}</div>`,
            ) +
            `</div>`
        } else {
          markup = `<div style="position:absolute;left:${inst.x}px;top:${inst.y}px;transform:rotate(${rotation}deg) scale(${sx},${sy});transform-origin:top left;">${animated(html)}</div>`
        }

        // Page link: wrap in a real anchor so the exported site navigates.
        const href = linkHrefFor?.(inst)
        if (href) {
          markup = `<a href="${href}" style="display:contents;color:inherit;text-decoration:none;cursor:pointer;">${markup}</a>`
        }
        parts.push(markup)
      }
      const contentHeight =
        instances.reduce((b, i) => {
          const nat = natural[i.id]
          return Math.max(b, i.y + (nat ? nat.h * (i.scaleY ?? 1) : 0))
        }, 0) + 80
      return {
        body: parts.join('\n'),
        cssBlocks: [...cssBlocks],
        animCss: [...animCss],
        serialized,
        contentHeight: Math.ceil(contentHeight),
      }
    },
  }))

  const startTransform = (
    e: React.PointerEvent,
    inst: Instance,
    mode: 'scale' | 'rotate' | 'resize',
    edge?: Edge,
  ) => {
    e.stopPropagation()
    const wrapper = (e.currentTarget as HTMLElement).parentElement as HTMLElement
    const rect = wrapper.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const sx = inst.scaleX ?? 1
    const sy = inst.scaleY ?? 1
    const nat = natural[inst.id]
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    transformRef.current = {
      id: inst.id,
      mode,
      edge,
      centerX,
      centerY,
      pointerX: e.clientX,
      pointerY: e.clientY,
      originDist: Math.hypot(e.clientX - centerX, e.clientY - centerY) || 1,
      originScaleX: sx,
      originScaleY: sy,
      originAngle: (Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180) / Math.PI,
      originRotation: inst.rotation ?? 0,
      originX: inst.x,
      originY: inst.y,
      naturalW: nat?.w || rect.width / sx || 1,
      naturalH: nat?.h || rect.height / sy || 1,
      originDisplayW: (inst.w ?? nat?.w ?? (rect.width / sx || 1)) * sx,
      originDisplayH: (inst.h ?? nat?.h ?? (rect.height / sy || 1)) * sy,
      textLock: inst.textLock ?? false,
    }
  }
  const moveTransform = (e: React.PointerEvent, id: string) => {
    const t = transformRef.current
    if (!t || t.id !== id) return
    if (t.mode === 'scale') {
      // Corner: scale both axes by the same ratio, preserving current aspect.
      const ratio = Math.hypot(e.clientX - t.centerX, e.clientY - t.centerY) / t.originDist
      onTransform(id, {
        scaleX: clamp(t.originScaleX * ratio, 0.1, 12),
        scaleY: clamp(t.originScaleY * ratio, 0.1, 12),
      })
    } else if (t.mode === 'rotate') {
      const angle = (Math.atan2(e.clientY - t.centerY, e.clientX - t.centerX) * 180) / Math.PI
      onTransform(id, { rotation: Math.round(t.originRotation + (angle - t.originAngle)) })
    } else if (t.textLock) {
      // Text locked: edges stretch the scale — text distorts with the box.
      const z = zoomRef.current || 1
      const dx = (e.clientX - t.pointerX) / z
      const dy = (e.clientY - t.pointerY) / z
      if (t.edge === 'e') {
        onTransform(id, { scaleX: clamp(t.originScaleX + dx / t.naturalW, 0.1, 12) })
      } else if (t.edge === 'w') {
        onTransform(id, { scaleX: clamp(t.originScaleX - dx / t.naturalW, 0.1, 12) })
        onMove(id, Math.max(0, t.originX + dx), t.originY)
      } else if (t.edge === 's') {
        onTransform(id, { scaleY: clamp(t.originScaleY + dy / t.naturalH, 0.1, 12) })
      } else if (t.edge === 'n') {
        onTransform(id, { scaleY: clamp(t.originScaleY - dy / t.naturalH, 0.1, 12) })
        onMove(id, t.originX, Math.max(0, t.originY + dy))
      }
    } else {
      // Smart fit (default): edges resize the REAL box — the component
      // re-renders at the new size and its text reflows instead of stretching.
      const z = zoomRef.current || 1
      const dx = (e.clientX - t.pointerX) / z
      const dy = (e.clientY - t.pointerY) / z
      const minPx = 24
      if (t.edge === 'e') {
        onTransform(id, { w: Math.max(minPx, (t.originDisplayW + dx) / t.originScaleX) })
      } else if (t.edge === 'w') {
        const newW = Math.max(minPx, (t.originDisplayW - dx) / t.originScaleX)
        onTransform(id, { w: newW })
        onMove(id, Math.max(0, t.originX + (t.originDisplayW - newW * t.originScaleX)), t.originY)
      } else if (t.edge === 's') {
        onTransform(id, { h: Math.max(minPx, (t.originDisplayH + dy) / t.originScaleY) })
      } else if (t.edge === 'n') {
        const newH = Math.max(minPx, (t.originDisplayH - dy) / t.originScaleY)
        onTransform(id, { h: newH })
        onMove(id, t.originX, Math.max(0, t.originY + (t.originDisplayH - newH * t.originScaleY)))
      }
    }
  }
  const endTransform = (e: React.PointerEvent, id: string) => {
    if (transformRef.current?.id === id) transformRef.current = null
    const el = e.currentTarget as HTMLElement
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
  }

  return (
    <main className="flex-1 min-w-0 relative overflow-hidden" style={{ background: GUTTER_BG[theme] }}>
      <div ref={viewportRef} className="absolute inset-0 overflow-auto">
        {/* Stage sizes the scrollable area; the artboard centers within it. */}
        <div
          className="relative"
          style={{
            width: Math.max(vpWidth, artboardWidth * zoom + BOARD_MARGIN * 2),
            height: Math.max(boardH, contentBottom) * zoom + BOARD_MARGIN * 2 + 40,
          }}
        >
      <div
        ref={surfaceRef}
        data-artboard
        className="absolute shadow-[0_2px_24px_rgba(0,0,0,0.35)]"
        style={{
          left: Math.max(BOARD_MARGIN, (vpWidth - artboardWidth * zoom) / 2),
          top: BOARD_MARGIN,
          width: artboardWidth,
          height: boardH,
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
          background: BOARD_BG[theme],
          backgroundImage: `radial-gradient(${DOT_COLOR[theme]} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '-1px -1px',
        }}
        onPointerDown={(e) => {
          // Marquee select: drag on empty canvas draws a selection box.
          if (e.target !== e.currentTarget) return
          const { x, y } = localPoint(e.clientX, e.clientY)
          const m: MarqueeState = { x0: x, y0: y, x1: x, y1: y, moved: false }
          marqueeRef.current = m
          e.currentTarget.setPointerCapture(e.pointerId)
        }}
        onPointerMove={(e) => {
          const m = marqueeRef.current
          if (!m) return
          const { x, y } = localPoint(e.clientX, e.clientY)
          m.x1 = x
          m.y1 = y
          if (Math.abs(x - m.x0) + Math.abs(y - m.y0) > 4) m.moved = true
          setMarquee(m.moved ? { ...m } : null)
        }}
        onPointerUp={(e) => {
          const m = marqueeRef.current
          marqueeRef.current = null
          setMarquee(null)
          if (e.currentTarget.hasPointerCapture(e.pointerId))
            e.currentTarget.releasePointerCapture(e.pointerId)
          if (!m) return
          setLiveId(null)
          if (!m.moved) {
            // Plain click on empty canvas: clear the selection.
            onSelectMany([])
            return
          }
          // Select every instance whose box intersects the marquee.
          const surfRect = surfaceRef.current?.getBoundingClientRect()
          if (!surfRect) return
          const z = zoomRef.current || 1
          const L = Math.min(m.x0, m.x1)
          const R = Math.max(m.x0, m.x1)
          const T = Math.min(m.y0, m.y1)
          const B = Math.max(m.y0, m.y1)
          const hits: string[] = []
          surfaceRef.current?.querySelectorAll<HTMLElement>('[data-inst]').forEach((el) => {
            const r = el.getBoundingClientRect()
            const l = (r.left - surfRect.left) / z
            const t = (r.top - surfRect.top) / z
            if (l < R && l + r.width / z > L && t < B && t + r.height / z > T) {
              const id = el.dataset.inst
              if (id) hits.push(id)
            }
          })
          onSelectMany(hits)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'copy'
        }}
        onDrop={(e) => {
          e.preventDefault()
          const entryId = e.dataTransfer.getData(DRAG_MIME)
          if (!entryId) return
          const { x, y } = localPoint(e.clientX, e.clientY)
          onAdd(entryId, Math.max(0, x - 20), Math.max(0, y - 16))
        }}
      >
        {/* Snap guides (Canva's pink lines) — full-height/width hairlines. */}
        {guides.v.map((gx) => (
          <div
            key={`gv-${gx}`}
            className="absolute z-30 pointer-events-none"
            style={{ left: gx, top: 0, bottom: 0, width: Math.max(1, 1 / zoom), background: '#ec4899' }}
          />
        ))}
        {guides.h.map((gy) => (
          <div
            key={`gh-${gy}`}
            className="absolute z-30 pointer-events-none"
            style={{ top: gy, left: 0, right: 0, height: Math.max(1, 1 / zoom), background: '#ec4899' }}
          />
        ))}
        {marquee && (
          <div
            className="absolute z-20 border border-primary/70 bg-primary/10 rounded-sm pointer-events-none"
            style={{
              left: Math.min(marquee.x0, marquee.x1),
              top: Math.min(marquee.y0, marquee.y1),
              width: Math.abs(marquee.x1 - marquee.x0),
              height: Math.abs(marquee.y1 - marquee.y0),
            }}
          />
        )}
        {instances.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-xs text-muted-foreground text-center">
              Drag a component here, or click one in the library.
            </p>
          </div>
        )}

        {instances.map((inst) => {
          const entry = entryById(inst.entryId)
          if (!entry) return null
          const selected = inst.id === selectedId
          const multiSelected = selectedIds.includes(inst.id)
          const live = selected && liveId === inst.id
          const sx = inst.scaleX ?? 1
          const sy = inst.scaleY ?? 1
          const rotation = inst.rotation ?? 0
          const nat = natural[inst.id]
          return (
            <div
              key={inst.id}
              data-inst={inst.id}
              className="absolute"
              style={{
                left: inst.x,
                top: inst.y,
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                touchAction: 'none',
              }}
              onClick={(e) => {
                e.stopPropagation()
                // A drag that moved shouldn't collapse a multi-selection.
                if (moveRefMoved.current) return
                if (inst.id !== selectedId) setLiveId(null)
                onSelect(inst.id)
              }}
              onDoubleClick={(e) => {
                e.stopPropagation()
                onSelect(inst.id)
                setEditingId(inst.id)
              }}
              onPointerDown={(e) => {
                if (editingId === inst.id) return
                e.stopPropagation()
                moveRefMoved.current = false
                const group =
                  multiSelected && selectedIds.length > 1
                    ? selectedIds
                    : [inst.id]
                if (!multiSelected) {
                  if (inst.id !== selectedId) setLiveId(null)
                  onSelect(inst.id)
                }
                e.currentTarget.setPointerCapture(e.pointerId)
                moveRef.current = {
                  id: inst.id,
                  pointerX: e.clientX,
                  pointerY: e.clientY,
                  origins: group.map((gid) => {
                    const gi = instances.find((i) => i.id === gid)
                    return [gid, { x: gi?.x ?? 0, y: gi?.y ?? 0 }]
                  }),
                  moved: false,
                }
              }}
              onPointerMove={(e) => {
                const m = moveRef.current
                if (!m || m.id !== inst.id) return
                const z = zoomRef.current || 1
                let dx = (e.clientX - m.pointerX) / z
                let dy = (e.clientY - m.pointerY) / z
                if (Math.abs(dx) + Math.abs(dy) > 2) {
                  m.moved = true
                  moveRefMoved.current = true
                }
                // Snap the grabbed instance; the rest of the group rides the
                // same (snapped) delta so relative layout is preserved.
                const primary = m.origins.find(([gid]) => gid === inst.id)?.[1]
                if (primary) {
                  const b = boxOf(inst)
                  const snapped = applySnap(
                    m.origins.map(([gid]) => gid),
                    primary.x + dx,
                    primary.y + dy,
                    b.w,
                    b.h,
                    e.altKey,
                  )
                  dx = snapped.x - primary.x
                  dy = snapped.y - primary.y
                  setGuides((g) =>
                    g.v.length === snapped.v.length &&
                    g.h.length === snapped.hz.length &&
                    g.v[0] === snapped.v[0] &&
                    g.h[0] === snapped.hz[0]
                      ? g
                      : { v: snapped.v, h: snapped.hz },
                  )
                }
                for (const [gid, o] of m.origins) {
                  onMove(gid, Math.max(0, o.x + dx), Math.max(0, o.y + dy))
                }
              }}
              onPointerUp={(e) => {
                if (moveRef.current?.id === inst.id) moveRef.current = null
                setGuides((g) => (g.v.length || g.h.length ? { v: [], h: [] } : g))
                if (e.currentTarget.hasPointerCapture(e.pointerId))
                  e.currentTarget.releasePointerCapture(e.pointerId)
              }}
            >
              {/* Scale wrapper: sizes to (natural × scale) so handles sit at the
                  visual edges without themselves scaling. */}
              <div
                className={`relative rounded-md ${
                  selected
                    ? 'ring-2 ring-primary'
                    : multiSelected
                      ? 'ring-2 ring-primary/50'
                      : 'ring-1 ring-transparent hover:ring-border'
                }`}
                style={nat ? { width: nat.w * sx, height: nat.h * sy } : undefined}
              >
                <div
                  style={{
                    transform: `scale(${sx}, ${sy})`,
                    transformOrigin: 'top left',
                    width: nat?.w,
                    height: nat?.h,
                  }}
                >
                  <PreviewFrame
                    ref={(h) => {
                      if (h) frameRefs.current.set(inst.id, h)
                      else frameRefs.current.delete(inst.id)
                    }}
                    root={rootFor(entry)}
                    filePath={entry.filePath}
                    exportName={entry.exportName}
                    renderProps={composeRenderProps(inst.args, inst.style)}
                    anim={inst.anim}
                    fx={inst.fx}
                    host={inst.w || inst.h ? { w: inst.w, h: inst.h } : undefined}
                    replayKey={inst.replay}
                    interactive={live}
                    onUserClick={
                      onNavigate && (inst.linkTo || inst.links)
                        ? (slot) => {
                            const target = (slot && inst.links?.[slot]) || inst.linkTo
                            if (target) onNavigate(target)
                          }
                        : undefined
                    }
                    onSlots={onSlotsReported ? (sl) => onSlotsReported(inst.id, sl) : undefined}
                    onSize={(s) => {
                      setNatural((prev) =>
                        prev[inst.id]?.w === s.width && prev[inst.id]?.h === s.height
                          ? prev
                          : { ...prev, [inst.id]: { w: s.width, h: s.height } },
                      )
                      // Auto-upscale tiny inserts once, and only while the user
                      // hasn't set a scale of their own.
                      const dim = Math.max(s.width, s.height)
                      if (
                        dim > 0 &&
                        dim < TINY_DIM &&
                        inst.scaleX === undefined &&
                        inst.scaleY === undefined &&
                        inst.w === undefined &&
                        inst.h === undefined &&
                        !autoScaled.current.has(inst.id)
                      ) {
                        autoScaled.current.add(inst.id)
                        const f = Math.min(TINY_DIM / dim, TINY_MAX_SCALE)
                        onTransform(inst.id, { scaleX: f, scaleY: f })
                      }
                    }}
                    className="cursor-grab active:cursor-grabbing"
                  />
                </div>

                {editingId === inst.id && (
                  <input
                    autoFocus
                    value={textOf(inst)}
                    onChange={(e) => onEditText(inst.id, e.target.value)}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === 'Escape') setEditingId(null)
                    }}
                    className="absolute inset-x-1 top-1 z-20 rounded px-1.5 py-0.5 text-xs bg-popover border border-primary text-foreground focus:outline-none"
                  />
                )}

                {selected && (
                  <>
                    {/* Move mode (default): drag anywhere on the component to
                        move it. Live mode: real clicks/scroll/hover go into the
                        component, so moving happens from the grab strips just
                        outside the ring, or the handles. */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setLiveId((cur) => (cur === inst.id ? null : inst.id))
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      title={
                        live
                          ? 'Live: clicks go into the component — press to go back to moving'
                          : 'Try the component for real (toggles toggle, links navigate)'
                      }
                      className={`absolute -top-8 left-0 z-10 rounded-sm border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider shadow-sm select-none transition-colors ${
                        live
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {live ? '■ live · drag frame to move' : '▶ live'}
                    </button>
                    {[
                      '-top-2.5 left-0 right-0 h-2.5',
                      '-bottom-2.5 left-0 right-0 h-2.5',
                      '-left-2.5 top-0 bottom-0 w-2.5',
                      '-right-2.5 top-0 bottom-0 w-2.5',
                    ].map((cls) => (
                      <div
                        key={cls}
                        className={`absolute ${cls} cursor-grab active:cursor-grabbing`}
                        title="Drag to move"
                      />
                    ))}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemove(inst.id)
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 w-5 h-5 rounded-sm border border-border bg-card text-foreground hover:bg-secondary text-xs leading-none flex items-center justify-center shadow-sm"
                      title="Remove (Delete) — Esc deselects, arrows nudge"
                    >
                      ×
                    </button>
                    {/* Side handles: drag to change length (stretch one axis). */}
                    {EDGES.map((edge) => (
                      <span
                        key={`edge-${edge.edge}`}
                        className={`absolute z-10 w-3 h-3 rounded-sm bg-white border border-primary ${edge.className}`}
                        style={{ cursor: edge.cursor }}
                        title="Drag to change length"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => startTransform(e, inst, 'resize', edge.edge)}
                        onPointerMove={(e) => moveTransform(e, inst.id)}
                        onPointerUp={(e) => endTransform(e, inst.id)}
                      />
                    ))}
                    {/* Corner handles: scale both axes proportionally. */}
                    {CORNERS.map((c, i) => (
                      <span
                        key={`corner-${i}`}
                        className={`absolute z-10 rounded-full bg-primary border border-white ${c.className}`}
                        style={{ cursor: c.cursor, width: handlePx, height: handlePx }}
                        title="Drag to scale"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => startTransform(e, inst, 'scale')}
                        onPointerMove={(e) => moveTransform(e, inst.id)}
                        onPointerUp={(e) => endTransform(e, inst.id)}
                      />
                    ))}
                    {/* Dedicated rotate handle, below the component. */}
                    <span
                      className="absolute z-10 -bottom-9 left-1/2 -translate-x-1/2 rounded-full bg-card border border-primary text-primary leading-none flex items-center justify-center shadow-sm"
                      style={{ cursor: 'grab', width: handlePx * 1.6, height: handlePx * 1.6, fontSize: handlePx * 0.9 }}
                      title="Drag to rotate"
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => startTransform(e, inst, 'rotate')}
                      onPointerMove={(e) => moveTransform(e, inst.id)}
                      onPointerUp={(e) => endTransform(e, inst.id)}
                    >
                      ↻
                    </span>
                  </>
                )}
              </div>
            </div>
          )
        })}

        {/* Bottom-edge grip: drag to make the page taller (or shorter, down
            to its content). Sits on the artboard's bottom edge. */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
          style={{ bottom: -14, width: 120, height: 28, cursor: 'ns-resize', touchAction: 'none' }}
          title="Drag to change page height"
          onPointerDown={(e) => {
            e.stopPropagation()
            ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
            heightDrag.current = { startY: e.clientY, startH: boardH }
          }}
          onPointerMove={(e) => {
            const d = heightDrag.current
            if (!d) return
            const z = zoomRef.current || 1
            onBoardHeightChange?.(Math.round(Math.max(MIN_BOARD_HEIGHT, d.startH + (e.clientY - d.startY) / z)))
          }}
          onPointerUp={(e) => {
            heightDrag.current = null
            const el = e.currentTarget as HTMLElement
            if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
          }}
        >
          <span className="w-16 h-1.5 rounded-full bg-primary/70 border border-white/40" />
        </div>
      </div>
        </div>
      </div>

      {/* Zoom controls — fixed to the panel, outside the scroll. */}
      <div className="absolute bottom-3 right-3 z-30 flex items-center gap-0.5 rounded-lg bg-card/95 border border-border shadow-md px-1 py-0.5">
        <button
          type="button"
          className="px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground"
          title="Zoom out"
          onClick={() => setZoom((z) => clamp(z / 1.2, 0.15, 2))}
        >
          −
        </button>
        <button
          type="button"
          className="px-1 py-0.5 text-[11px] tabular-nums text-muted-foreground hover:text-foreground min-w-[3.2rem]"
          title="Reset to 100%"
          onClick={() => setZoom(1)}
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          className="px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground"
          title="Zoom in"
          onClick={() => setZoom((z) => clamp(z * 1.2, 0.15, 2))}
        >
          +
        </button>
        <button
          type="button"
          className="px-1.5 py-0.5 text-[11px] text-muted-foreground hover:text-foreground border-l border-border ml-0.5"
          title="Fit page width"
          onClick={fitZoom}
        >
          Fit
        </button>
      </div>
    </main>
  )
})
