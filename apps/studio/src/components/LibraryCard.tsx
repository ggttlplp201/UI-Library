import { useMemo, useState } from 'react'
import type { RegistryEntry } from '@component-style-studio/registry'
import { composeRenderProps, deriveControls, initialArgs } from '../lib/controls'
import { PreviewFrame } from './PreviewFrame'

/** MIME-ish key carrying the dragged component's entry id to the Canvas (Phase 4). */
export const DRAG_MIME = 'application/x-css-entry'

export function LibraryCard({
  entry,
  root,
  selected,
  onSelect,
}: {
  entry: RegistryEntry
  root: string
  selected: boolean
  onSelect: () => void
}) {
  const [hovered, setHovered] = useState(false)

  const defaultProps = useMemo(
    () => composeRenderProps(initialArgs(deriveControls(entry))),
    [entry],
  )

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(DRAG_MIME, entry.id)
        e.dataTransfer.effectAllowed = 'copy'
      }}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group rounded-lg border cursor-grab active:cursor-grabbing transition-colors overflow-hidden ${
        selected
          ? 'border-primary/40 bg-secondary'
          : 'border-border/50 bg-muted/20 hover:border-border'
      }`}
      title={`${entry.name} — drag onto the canvas`}
    >
      <div className="h-[84px] flex items-center justify-center overflow-hidden bg-white">
        {hovered ? (
          <PreviewFrame
            root={root}
            filePath={entry.filePath}
            exportName={entry.exportName}
            renderProps={defaultProps}
            autoSize={false}
            interactive={false}
            className="w-full h-full"
          />
        ) : (
          <span className="text-[10px] text-muted-foreground select-none">hover to preview</span>
        )}
      </div>
      <div className="px-2 py-1.5 border-t border-border/50">
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-medium truncate">{entry.name}</span>
          {entry.source === 'preset' && (
            <span className="text-[7px] font-semibold uppercase tracking-wider px-1 rounded bg-primary/20 text-accent-foreground shrink-0">
              preset
            </span>
          )}
          {entry.flags.needsMocking && (
            <span
              title="Uses context or external hooks — preview mocks them"
              className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 ml-auto"
            />
          )}
        </div>
      </div>
    </div>
  )
}
