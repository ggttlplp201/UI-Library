import { useRef, useState } from 'react'
import type { Page } from '../lib/canvas'

const NODE_W = 200
const HEADER_H = 34
const ROW_H = 20
const FOOTER_H = 40
const MAX_ROWS = 5

const rowsShown = (page: Page) =>
  Math.min(page.instances.length, MAX_ROWS) + (page.instances.length > MAX_ROWS ? 1 : 0)
const nodeH = (page: Page) => HEADER_H + Math.max(rowsShown(page), 1) * ROW_H + FOOTER_H

interface WireDrag {
  fromPageId: string
  instanceId: string
  x: number
  y: number
}

/**
 * Blender-style node view of the composition's pages. Each page node lists
 * its components; every component row has an output PORT on the right —
 * drag a wire from a port onto another page node to make that component
 * navigate there (release on empty space to clear the link). The same
 * assignment is available as Configure → "Links to". Drag nodes to arrange,
 * double-click a name to rename, double-click a node to open its canvas.
 */
export function PagesView({
  pages,
  activePageId,
  entryNameFor,
  onSetActive,
  onOpenCanvas,
  onMoveNode,
  onRename,
  onAddPage,
  onRemovePage,
  onLink,
}: {
  pages: Page[]
  activePageId: string
  /** Resolve an instance id on a page to a display name */
  entryNameFor: (pageId: string, instanceId: string) => string
  onSetActive: (id: string) => void
  onOpenCanvas: (id: string) => void
  onMoveNode: (id: string, x: number, y: number) => void
  onRename: (id: string, name: string) => void
  onAddPage: () => void
  onRemovePage: (id: string) => void
  /** Assign (or clear, with undefined) an instance's navigation target */
  onLink: (pageId: string, instanceId: string, targetPageId: string | undefined) => void
}) {
  const surfaceRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null)
  const [renaming, setRenaming] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [wire, setWire] = useState<WireDrag | null>(null)
  const wireRef = useRef<WireDrag | null>(null)
  wireRef.current = wire

  const byId = new Map(pages.map((p) => [p.id, p]))

  const toSurface = (clientX: number, clientY: number) => {
    const rect = surfaceRef.current?.getBoundingClientRect()
    return { x: clientX - (rect?.left ?? 0), y: clientY - (rect?.top ?? 0) }
  }

  const portPos = (page: Page, idx: number) => ({
    x: page.nodeX + NODE_W,
    y: page.nodeY + HEADER_H + idx * ROW_H + ROW_H / 2,
  })
  const inputPos = (page: Page) => ({ x: page.nodeX, y: page.nodeY + nodeH(page) / 2 })

  const pageAtPoint = (x: number, y: number): Page | null =>
    pages.find(
      (p) => x >= p.nodeX && x <= p.nodeX + NODE_W && y >= p.nodeY && y <= p.nodeY + nodeH(p),
    ) ?? null

  // Wire dragging: listeners attach synchronously in the port's pointerdown
  // (not via an effect) so even a same-frame release resolves cleanly — no
  // dangling wire, no stray pointerup clearing a link later.
  const startWire = (fromPageId: string, instanceId: string, clientX: number, clientY: number) => {
    const p = toSurface(clientX, clientY)
    const w: WireDrag = { fromPageId, instanceId, x: p.x, y: p.y }
    wireRef.current = w
    setWire(w)
    const onMove = (e: PointerEvent) => {
      const pt = toSurface(e.clientX, e.clientY)
      setWire((cur) => (cur ? { ...cur, x: pt.x, y: pt.y } : cur))
    }
    const onUp = (e: PointerEvent) => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      const pt = toSurface(e.clientX, e.clientY)
      const target = pageAtPoint(pt.x, pt.y)
      // Dropping on another page links; dropping anywhere else clears.
      onLink(fromPageId, instanceId, target && target.id !== fromPageId ? target.id : undefined)
      wireRef.current = null
      setWire(null)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const bezier = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = Math.max(48, Math.abs(b.x - a.x) / 2)
    return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`
  }

  /**
   * Does the simple bezier from a to b pass through any node box? Samples the
   * cubic; endpoints sit on box edges, so sampling starts inside the span.
   */
  const bezierCrossesNode = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = Math.max(48, Math.abs(b.x - a.x) / 2)
    const p1 = { x: a.x + dx, y: a.y }
    const p2 = { x: b.x - dx, y: b.y }
    for (let t = 0.08; t < 0.93; t += 0.06) {
      const u = 1 - t
      const x = u * u * u * a.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * b.x
      const y = u * u * u * a.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * b.y
      for (const p of pages) {
        if (
          x > p.nodeX + 4 &&
          x < p.nodeX + NODE_W - 4 &&
          y > p.nodeY + 4 &&
          y < p.nodeY + nodeH(p) - 4
        )
          return true
      }
    }
    return false
  }

  /**
   * Edge path that stays OUT of the node boxes. Forward edges (target to the
   * right) keep the simple bezier unless it would cut through a node. Blocked
   * or backward edges detour around the outside: out of the source port,
   * vertically past every node in the crossed span, then back into the
   * target's input — wires may overlap, boxes may not.
   */
  const edgePath = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    if (b.x >= a.x + 48 && !bezierCrossesNode(a, b)) return bezier(a, b)
    // Clearance band: consider every node whose x-range the wire crosses.
    const spanL = Math.min(b.x, a.x) - 24
    const spanR = Math.max(b.x, a.x) + 24
    let top = Infinity
    let bottom = -Infinity
    for (const p of pages) {
      if (p.nodeX + NODE_W < spanL || p.nodeX > spanR) continue
      top = Math.min(top, p.nodeY)
      bottom = Math.max(bottom, p.nodeY + nodeH(p))
    }
    if (!Number.isFinite(top)) return bezier(a, b)
    const below = bottom + 40
    const above = top - 40
    const detourY =
      Math.abs(a.y - below) + Math.abs(b.y - below) <= Math.abs(a.y - above) + Math.abs(b.y - above)
        ? below
        : Math.max(16, above)
    const midX = (a.x + b.x) / 2
    return (
      `M ${a.x} ${a.y} ` +
      `C ${a.x + 64} ${a.y}, ${a.x + 64} ${detourY}, ${midX} ${detourY} ` +
      `C ${b.x - 64} ${detourY}, ${b.x - 64} ${b.y}, ${b.x} ${b.y}`
    )
  }

  // Edges: one per linked instance, anchored at the instance's row port.
  const edges: { key: string; from: { x: number; y: number }; to: { x: number; y: number } }[] = []
  for (const page of pages) {
    page.instances.forEach((inst, idx) => {
      if (!inst.linkTo) return
      const target = byId.get(inst.linkTo)
      if (!target) return
      const from = idx < MAX_ROWS ? portPos(page, idx) : { x: page.nodeX + NODE_W, y: page.nodeY + nodeH(page) / 2 }
      edges.push({ key: `${page.id}:${inst.id}`, from, to: inputPos(target) })
    })
  }

  return (
    <div
      ref={surfaceRef}
      className="relative flex-1 overflow-hidden select-none"
      style={{
        background: '#0c0c0f',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
      onPointerMove={(e) => {
        const d = dragRef.current
        if (!d) return
        onMoveNode(d.id, Math.max(0, d.origX + e.clientX - d.startX), Math.max(0, d.origY + e.clientY - d.startY))
      }}
      onPointerUp={() => {
        dragRef.current = null
      }}
    >
      {/* Edges + live wire under the nodes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker id="edge-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0.8 L7,4 L0,7.2 Z" fill="rgba(160,160,180,0.9)" />
          </marker>
        </defs>
        {edges.map((e) => (
          <path
            key={e.key}
            d={edgePath(e.from, e.to)}
            fill="none"
            stroke="rgba(160,160,180,0.6)"
            strokeWidth="1.5"
            markerEnd="url(#edge-arrow)"
          />
        ))}
        {wire && (() => {
          const page = byId.get(wire.fromPageId)
          if (!page) return null
          const idx = page.instances.findIndex((i) => i.id === wire.instanceId)
          const from = idx >= 0 && idx < MAX_ROWS ? portPos(page, idx) : { x: page.nodeX + NODE_W, y: page.nodeY + nodeH(page) / 2 }
          return (
            <path
              d={bezier(from, { x: wire.x, y: wire.y })}
              fill="none"
              stroke="rgba(124,111,255,0.9)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          )
        })()}
      </svg>

      {pages.map((page) => {
        const active = page.id === activePageId
        const height = nodeH(page)
        const shown = page.instances.slice(0, MAX_ROWS)
        const overflow = page.instances.length - shown.length
        const isWireTarget = wire != null && wire.fromPageId !== page.id
        return (
          <div
            key={page.id}
            className={`absolute rounded-xl border shadow-lg bg-card ${
              isWireTarget
                ? 'border-primary/70 ring-1 ring-primary/50'
                : active
                  ? 'border-primary/60 ring-1 ring-primary/40'
                  : 'border-border hover:border-neutral-600'
            }`}
            style={{ left: page.nodeX, top: page.nodeY, width: NODE_W, height }}
            onPointerDown={(e) => {
              if (wireRef.current) return
              onSetActive(page.id)
              dragRef.current = {
                id: page.id,
                startX: e.clientX,
                startY: e.clientY,
                origX: page.nodeX,
                origY: page.nodeY,
              }
              ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
            }}
            onDoubleClick={() => onOpenCanvas(page.id)}
          >
            {/* Input socket (where wires land) */}
            <span
              className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-neutral-500 bg-card"
              aria-hidden
            />
            <div className="px-3 pt-2.5 flex items-center gap-1.5" style={{ height: HEADER_H }}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? 'bg-primary' : 'bg-neutral-600'}`} />
              {renaming === page.id ? (
                <input
                  autoFocus
                  defaultValue={page.name}
                  onPointerDown={(e) => e.stopPropagation()}
                  onBlur={(e) => {
                    onRename(page.id, e.target.value.trim() || page.name)
                    setRenaming(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                    if (e.key === 'Escape') setRenaming(null)
                  }}
                  className="w-full bg-input border border-border rounded px-1 py-0.5 text-xs text-foreground focus:outline-none"
                />
              ) : (
                <span
                  className="text-xs font-semibold truncate cursor-text"
                  title="Double-click to rename"
                  onDoubleClick={(e) => {
                    e.stopPropagation()
                    setRenaming(page.id)
                  }}
                >
                  {page.name}
                </span>
              )}
              {pages.length > 1 && (
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirmDelete === page.id) {
                      setConfirmDelete(null)
                      onRemovePage(page.id)
                    } else {
                      setConfirmDelete(page.id)
                      setTimeout(() => setConfirmDelete((c) => (c === page.id ? null : c)), 2500)
                    }
                  }}
                  className={`ml-auto text-[10px] leading-none rounded px-1 py-0.5 transition-colors ${
                    confirmDelete === page.id
                      ? 'bg-red-500/20 text-red-300'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title={confirmDelete === page.id ? 'Click again to delete this page' : 'Delete page'}
                >
                  {confirmDelete === page.id ? 'sure?' : '×'}
                </button>
              )}
            </div>

            {/* Component rows, each with an output port to wire to a page */}
            {page.instances.length === 0 ? (
              <p className="px-3 text-[10px] text-muted-foreground" style={{ lineHeight: `${ROW_H}px` }}>
                empty page
              </p>
            ) : (
              shown.map((inst) => {
                const targetName = inst.linkTo ? byId.get(inst.linkTo)?.name : null
                return (
                  <div
                    key={inst.id}
                    className="relative flex items-center gap-1 px-3 text-[10px]"
                    style={{ height: ROW_H }}
                  >
                    <span className="truncate text-foreground/80">{entryNameFor(page.id, inst.id)}</span>
                    {targetName && (
                      <span className="truncate text-primary/80 shrink-0">→ {targetName}</span>
                    )}
                    <span
                      title="Drag onto another page to link this component's click to it (release on empty space to unlink)"
                      onPointerDown={(e) => {
                        e.stopPropagation()
                        startWire(page.id, inst.id, e.clientX, e.clientY)
                      }}
                      className={`absolute -right-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border cursor-crosshair transition-colors ${
                        inst.linkTo
                          ? 'bg-primary border-primary'
                          : 'bg-card border-neutral-500 hover:border-primary hover:bg-primary/40'
                      }`}
                    />
                  </div>
                )
              })
            )}
            {overflow > 0 && (
              <p className="px-3 text-[9px] text-muted-foreground" style={{ lineHeight: `${ROW_H}px` }}>
                +{overflow} more — link them from Configure
              </p>
            )}

            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation()
                onOpenCanvas(page.id)
              }}
              className="absolute bottom-2 left-3 right-3 rounded-md bg-secondary/70 hover:bg-secondary text-[10px] py-1 text-foreground transition-colors"
            >
              Open canvas
            </button>
          </div>
        )
      })}

      <button
        type="button"
        onClick={onAddPage}
        className="absolute bottom-4 left-4 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors shadow-lg"
      >
        + Add page
      </button>
      <p className="absolute top-3 left-4 text-[10px] text-muted-foreground pointer-events-none">
        Pages — drag a component's ○ port onto another page to link its click there · drag nodes to arrange · double-click to open
      </p>
    </div>
  )
}
