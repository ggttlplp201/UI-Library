import { useRef, useState } from 'react'
import type { Page } from '../lib/canvas'

const NODE_W = 190
const NODE_H = 92

interface EdgeInfo {
  from: string
  to: string
  labels: string[]
}

/**
 * Blender-style node view of the composition's pages. Each page is a node;
 * an edge means "some component on page A navigates to page B" (assigned in
 * the Configure panel's "Navigates to" field). Drag nodes to arrange, double-
 * click a name to rename, double-click a node body to open it on the canvas.
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
}: {
  pages: Page[]
  activePageId: string
  /** Resolve an instance id on a page to a display name for edge labels */
  entryNameFor: (pageId: string, instanceId: string) => string
  onSetActive: (id: string) => void
  onOpenCanvas: (id: string) => void
  onMoveNode: (id: string, x: number, y: number) => void
  onRename: (id: string, name: string) => void
  onAddPage: () => void
  onRemovePage: (id: string) => void
}) {
  const surfaceRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null)
  const [renaming, setRenaming] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const byId = new Map(pages.map((p) => [p.id, p]))

  // Collect edges: source page -> target page with the linking instances' names.
  const edgeMap = new Map<string, EdgeInfo>()
  for (const page of pages) {
    for (const inst of page.instances) {
      if (!inst.linkTo || !byId.has(inst.linkTo)) continue
      const key = `${page.id}->${inst.linkTo}`
      const edge = edgeMap.get(key) ?? { from: page.id, to: inst.linkTo, labels: [] }
      edge.labels.push(entryNameFor(page.id, inst.id))
      edgeMap.set(key, edge)
    }
  }
  const edges = [...edgeMap.values()]

  const anchor = (p: Page, side: 'out' | 'in') => ({
    x: p.nodeX + (side === 'out' ? NODE_W : 0),
    y: p.nodeY + NODE_H / 2,
  })

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
      {/* Edges under the nodes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker id="edge-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0.8 L7,4 L0,7.2 Z" fill="rgba(160,160,180,0.9)" />
          </marker>
        </defs>
        {edges.map((edge) => {
          const from = byId.get(edge.from)
          const to = byId.get(edge.to)
          if (!from || !to) return null
          const a = anchor(from, 'out')
          const b = anchor(to, 'in')
          const dx = Math.max(48, Math.abs(b.x - a.x) / 2)
          const path = `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`
          const midX = (a.x + b.x) / 2
          const midY = (a.y + b.y) / 2 - 8
          return (
            <g key={`${edge.from}->${edge.to}`}>
              <path d={path} fill="none" stroke="rgba(160,160,180,0.55)" strokeWidth="1.5" markerEnd="url(#edge-arrow)" />
              <text x={midX} y={midY} textAnchor="middle" className="fill-neutral-400" fontSize="9">
                {edge.labels.slice(0, 2).join(', ')}
                {edge.labels.length > 2 ? ` +${edge.labels.length - 2}` : ''}
              </text>
            </g>
          )
        })}
      </svg>

      {pages.map((page) => {
        const active = page.id === activePageId
        return (
          <div
            key={page.id}
            className={`absolute rounded-xl border shadow-lg bg-card ${
              active ? 'border-primary/60 ring-1 ring-primary/40' : 'border-border hover:border-neutral-600'
            }`}
            style={{ left: page.nodeX, top: page.nodeY, width: NODE_W, height: NODE_H }}
            onPointerDown={(e) => {
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
            <div className="px-3 pt-2.5 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-primary' : 'bg-neutral-600'}`} />
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
            <div className="px-3 pt-1.5 text-[10px] text-muted-foreground">
              {page.instances.length} component{page.instances.length === 1 ? '' : 's'}
            </div>
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
        Pages — drag to arrange · double-click a node to open its canvas · assign links in Configure → “Navigates to”
      </p>
    </div>
  )
}
