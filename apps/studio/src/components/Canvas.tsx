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

// Corner handles scale (Canva-style); edge handles rotate.
const CORNERS = [
  { className: '-top-1.5 -left-1.5', cursor: 'nwse-resize' },
  { className: '-top-1.5 -right-1.5', cursor: 'nesw-resize' },
  { className: '-bottom-1.5 -left-1.5', cursor: 'nesw-resize' },
  { className: '-bottom-1.5 -right-1.5', cursor: 'nwse-resize' },
]
const EDGES = [
  { className: '-top-1.5 left-1/2 -translate-x-1/2' },
  { className: '-bottom-1.5 left-1/2 -translate-x-1/2' },
  { className: 'top-1/2 -left-1.5 -translate-y-1/2' },
  { className: 'top-1/2 -right-1.5 -translate-y-1/2' },
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
  mode: 'scale' | 'rotate'
  centerX: number
  centerY: number
  originDist: number
  originScale: number
  originAngle: number
  originRotation: number
}

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
  onTransform: (id: string, patch: { scale?: number; rotation?: number }) => void
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
        const transform = `transform:rotate(${inst.rotation ?? 0}deg) scale(${inst.scale ?? 1});transform-origin:top left;`
        parts.push(
          `<div style="position:absolute;left:${inst.x}px;top:${inst.y}px;${transform}">${snap.html}</div>`,
        )
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
    mode: 'scale' | 'rotate',
  ) => {
    e.stopPropagation()
    const wrapper = (e.currentTarget as HTMLElement).parentElement as HTMLElement
    const rect = wrapper.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    transformRef.current = {
      id: inst.id,
      mode,
      centerX,
      centerY,
      originDist: Math.hypot(e.clientX - centerX, e.clientY - centerY) || 1,
      originScale: inst.scale ?? 1,
      originAngle: (Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180) / Math.PI,
      originRotation: inst.rotation ?? 0,
    }
  }
  const moveTransform = (e: React.PointerEvent, id: string) => {
    const t = transformRef.current
    if (!t || t.id !== id) return
    if (t.mode === 'scale') {
      const dist = Math.hypot(e.clientX - t.centerX, e.clientY - t.centerY)
      onTransform(id, { scale: clamp((t.originScale * dist) / t.originDist, 0.2, 8) })
    } else {
      const angle = (Math.atan2(e.clientY - t.centerY, e.clientX - t.centerX) * 180) / Math.PI
      onTransform(id, { rotation: Math.round(t.originRotation + (angle - t.originAngle)) })
    }
  }
  const endTransform = (e: React.PointerEvent, id: string) => {
    if (transformRef.current?.id === id) transformRef.current = null
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  }

  return (
    <main className="flex-1 min-w-0 relative overflow-hidden" style={{ background: CANVAS_BG[theme] }}>
      <div
        ref={surfaceRef}
        className="absolute inset-0"
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
          const scale = inst.scale ?? 1
          const rotation = inst.rotation ?? 0
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
                e.currentTarget.releasePointerCapture(e.pointerId)
              }}
            >
              {/* Scale wrapper: sizes to (natural × scale) so handles sit at the
                  visual edges without themselves scaling. */}
              <div
                className={`relative rounded-md ${selected ? 'ring-2 ring-primary' : 'ring-1 ring-transparent hover:ring-border'}`}
                style={
                  natural[inst.id]
                    ? { width: natural[inst.id].w * scale, height: natural[inst.id].h * scale }
                    : undefined
                }
              >
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: natural[inst.id]?.w,
                    height: natural[inst.id]?.h,
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
                      className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 w-6 h-6 rounded-md bg-destructive text-white text-sm leading-none flex items-center justify-center shadow"
                      title="Remove"
                    >
                      ×
                    </button>
                    {EDGES.map((edge, i) => (
                      <span
                        key={`edge-${i}`}
                        className={`absolute z-10 w-2.5 h-2.5 rounded-full bg-white border border-primary ${edge.className}`}
                        style={{ cursor: 'grab' }}
                        title="Drag to rotate"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => startTransform(e, inst, 'rotate')}
                        onPointerMove={(e) => moveTransform(e, inst.id)}
                        onPointerUp={(e) => endTransform(e, inst.id)}
                      />
                    ))}
                    {CORNERS.map((c, i) => (
                      <span
                        key={`corner-${i}`}
                        className={`absolute z-10 w-3 h-3 rounded-sm bg-primary border border-white ${c.className}`}
                        style={{ cursor: c.cursor }}
                        title="Drag to resize"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => startTransform(e, inst, 'scale')}
                        onPointerMove={(e) => moveTransform(e, inst.id)}
                        onPointerUp={(e) => endTransform(e, inst.id)}
                      />
                    ))}
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
