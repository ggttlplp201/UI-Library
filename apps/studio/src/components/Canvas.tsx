import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import type { RegistryEntry } from '@component-style-studio/registry'
import type { Instance } from '../lib/canvas'
import { composeRenderProps } from '../lib/controls'
import { PreviewFrame, type PreviewHandle } from './PreviewFrame'
import { DRAG_MIME } from './LibraryCard'

export type CanvasTheme = 'dark' | 'light'

/** Imperative handle so the header's Export button can snapshot the canvas. */
export interface CanvasHandle {
  exportComposition: () => Promise<string>
}

const CANVAS_BG: Record<CanvasTheme, string> = { dark: '#0c0c0f', light: '#ffffff' }
const DOT_COLOR: Record<CanvasTheme, string> = {
  dark: 'rgba(255,255,255,0.10)',
  light: 'rgba(0,0,0,0.10)',
}

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
  originX: number
  originY: number
}
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
}

type TransformPatch = { scaleX?: number; scaleY?: number; rotation?: number }

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

interface CanvasProps {
  instances: Instance[]
  entryById: (id: string) => RegistryEntry | undefined
  rootFor: (entry: RegistryEntry) => string
  theme: CanvasTheme
  selectedId: string | null
  onSelect: (id: string | null) => void
  onAdd: (entryId: string, x: number, y: number) => void
  onMove: (id: string, x: number, y: number) => void
  onTransform: (id: string, patch: TransformPatch) => void
  onRemove: (id: string) => void
  textOf: (inst: Instance) => string
  onEditText: (id: string, text: string) => void
}

export const Canvas = forwardRef<CanvasHandle, CanvasProps>(function Canvas(
  {
    instances,
    entryById,
    rootFor,
    theme,
    selectedId,
    onSelect,
    onAdd,
    onMove,
    onTransform,
    onRemove,
    textOf,
    onEditText,
  },
  ref,
) {
  const surfaceRef = useRef<HTMLDivElement>(null)
  const moveRef = useRef<MoveState | null>(null)
  const transformRef = useRef<TransformState | null>(null)
  const frameRefs = useRef(new Map<string, PreviewHandle>())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [natural, setNatural] = useState<Record<string, { w: number; h: number }>>({})

  const localPoint = (clientX: number, clientY: number) => {
    const rect = surfaceRef.current?.getBoundingClientRect()
    return { x: clientX - (rect?.left ?? 0), y: clientY - (rect?.top ?? 0) }
  }

  useImperativeHandle(ref, () => ({
    exportComposition: async () => {
      const cssBlocks = new Set<string>()
      const parts: string[] = []
      for (const inst of instances) {
        const snap = (await frameRefs.current.get(inst.id)?.serialize()) ?? null
        if (!snap) continue
        if (snap.css) cssBlocks.add(snap.css)
        const rotation = inst.rotation ?? 0
        const sx = inst.scaleX ?? 1
        const sy = inst.scaleY ?? 1
        const nat = natural[inst.id]
        // Mirror the on-canvas structure: outer wrapper rotates about its
        // center at (natural × scale) size; inner wrapper scales from top-left.
        if (nat) {
          parts.push(
            `<div style="position:absolute;left:${inst.x}px;top:${inst.y}px;width:${nat.w * sx}px;height:${nat.h * sy}px;transform:rotate(${rotation}deg);transform-origin:center center;">` +
              `<div style="width:${nat.w}px;height:${nat.h}px;transform:scale(${sx},${sy});transform-origin:top left;">${snap.html}</div>` +
              `</div>`,
          )
        } else {
          parts.push(
            `<div style="position:absolute;left:${inst.x}px;top:${inst.y}px;transform:rotate(${rotation}deg) scale(${sx},${sy});transform-origin:top left;">${snap.html}</div>`,
          )
        }
      }
      return [
        '<!doctype html>',
        '<html><head><meta charset="utf-8" />',
        '<title>Component Style Studio export</title>',
        `<style>${[...cssBlocks].join('\n')}</style>`,
        `<style>body{margin:0;min-height:100vh;position:relative;background:${CANVAS_BG[theme]}}</style>`,
        '</head><body>',
        parts.join('\n'),
        '</body></html>',
      ].join('\n')
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
    } else {
      // Edge: stretch one axis (length). Left/top handles also shift the origin
      // so the opposite edge stays put (exact when unrotated).
      const dx = e.clientX - t.pointerX
      const dy = e.clientY - t.pointerY
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
    }
  }
  const endTransform = (e: React.PointerEvent, id: string) => {
    if (transformRef.current?.id === id) transformRef.current = null
    const el = e.currentTarget as HTMLElement
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
  }

  return (
    <main className="flex-1 min-w-0 relative overflow-hidden" style={{ background: CANVAS_BG[theme] }}>
      <div
        ref={surfaceRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${DOT_COLOR[theme]} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '-1px -1px',
        }}
        onClick={() => onSelect(null)}
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
          const sx = inst.scaleX ?? 1
          const sy = inst.scaleY ?? 1
          const rotation = inst.rotation ?? 0
          const nat = natural[inst.id]
          return (
            <div
              key={inst.id}
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
                onSelect(inst.id)
                e.currentTarget.setPointerCapture(e.pointerId)
                moveRef.current = {
                  id: inst.id,
                  pointerX: e.clientX,
                  pointerY: e.clientY,
                  originX: inst.x,
                  originY: inst.y,
                }
              }}
              onPointerMove={(e) => {
                const m = moveRef.current
                if (!m || m.id !== inst.id) return
                onMove(
                  inst.id,
                  Math.max(0, m.originX + (e.clientX - m.pointerX)),
                  Math.max(0, m.originY + (e.clientY - m.pointerY)),
                )
              }}
              onPointerUp={(e) => {
                if (moveRef.current?.id === inst.id) moveRef.current = null
                if (e.currentTarget.hasPointerCapture(e.pointerId))
                  e.currentTarget.releasePointerCapture(e.pointerId)
              }}
            >
              {/* Scale wrapper: sizes to (natural × scale) so handles sit at the
                  visual edges without themselves scaling. */}
              <div
                className={`relative rounded-md ${selected ? 'ring-2 ring-primary' : 'ring-1 ring-transparent hover:ring-border'}`}
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
                    replayKey={inst.replay}
                    interactive={false}
                    onSize={(s) =>
                      setNatural((prev) =>
                        prev[inst.id]?.w === s.width && prev[inst.id]?.h === s.height
                          ? prev
                          : { ...prev, [inst.id]: { w: s.width, h: s.height } },
                      )
                    }
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
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemove(inst.id)
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 w-5 h-5 rounded-sm border border-border bg-card text-foreground hover:bg-secondary text-xs leading-none flex items-center justify-center shadow-sm"
                      title="Remove"
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
                        className={`absolute z-10 w-3 h-3 rounded-full bg-primary border border-white ${c.className}`}
                        style={{ cursor: c.cursor }}
                        title="Drag to scale"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => startTransform(e, inst, 'scale')}
                        onPointerMove={(e) => moveTransform(e, inst.id)}
                        onPointerUp={(e) => endTransform(e, inst.id)}
                      />
                    ))}
                    {/* Dedicated rotate handle, below the component. */}
                    <span
                      className="absolute z-10 -bottom-9 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-card border border-primary text-primary text-[11px] leading-none flex items-center justify-center shadow-sm"
                      style={{ cursor: 'grab' }}
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
      </div>
    </main>
  )
})
