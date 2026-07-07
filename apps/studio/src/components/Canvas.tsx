import { useRef } from 'react'
import type { RegistryEntry } from '@component-style-studio/registry'
import type { Instance } from '../lib/canvas'
import { composeRenderProps } from '../lib/controls'
import { PreviewFrame } from './PreviewFrame'
import { DRAG_MIME } from './LibraryCard'

interface DragState {
  id: string
  pointerX: number
  pointerY: number
  originX: number
  originY: number
}

export function Canvas({
  instances,
  entryById,
  rootFor,
  selectedId,
  onSelect,
  onAdd,
  onMove,
  onRemove,
}: {
  instances: Instance[]
  entryById: (id: string) => RegistryEntry | undefined
  rootFor: (entry: RegistryEntry) => string
  selectedId: string | null
  onSelect: (id: string | null) => void
  onAdd: (entryId: string, x: number, y: number) => void
  onMove: (id: string, x: number, y: number) => void
  onRemove: (id: string) => void
}) {
  const surfaceRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)

  const localPoint = (clientX: number, clientY: number) => {
    const rect = surfaceRef.current?.getBoundingClientRect()
    return { x: clientX - (rect?.left ?? 0), y: clientY - (rect?.top ?? 0) }
  }

  return (
    <main className="flex-1 min-w-0 relative bg-background overflow-hidden">
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
          return (
            <div
              key={inst.id}
              className={`absolute rounded-md ${selected ? 'ring-2 ring-primary' : 'ring-1 ring-transparent hover:ring-border'}`}
              style={{ left: inst.x, top: inst.y, touchAction: 'none' }}
              onClick={(e) => {
                e.stopPropagation()
                onSelect(inst.id)
              }}
              onPointerDown={(e) => {
                e.stopPropagation()
                onSelect(inst.id)
                e.currentTarget.setPointerCapture(e.pointerId)
                dragRef.current = {
                  id: inst.id,
                  pointerX: e.clientX,
                  pointerY: e.clientY,
                  originX: inst.x,
                  originY: inst.y,
                }
              }}
              onPointerMove={(e) => {
                const d = dragRef.current
                if (!d || d.id !== inst.id) return
                onMove(
                  inst.id,
                  Math.max(0, d.originX + (e.clientX - d.pointerX)),
                  Math.max(0, d.originY + (e.clientY - d.pointerY)),
                )
              }}
              onPointerUp={(e) => {
                if (dragRef.current?.id === inst.id) dragRef.current = null
                e.currentTarget.releasePointerCapture(e.pointerId)
              }}
            >
              {selected && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(inst.id)
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="absolute -top-2 -right-2 z-10 w-4 h-4 rounded-full bg-destructive text-white text-[10px] leading-none flex items-center justify-center"
                  title="Remove"
                >
                  ×
                </button>
              )}
              <PreviewFrame
                root={rootFor(entry)}
                filePath={entry.filePath}
                exportName={entry.exportName}
                renderProps={composeRenderProps(inst.args, inst.style)}
                anim={inst.anim}
                replayKey={inst.replay}
                interactive={false}
                className="cursor-grab active:cursor-grabbing"
              />
            </div>
          )
        })}
      </div>
    </main>
  )
}
