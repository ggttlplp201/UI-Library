import { useEffect, useMemo, useRef, useState } from 'react'
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
  onOutcome,
  eager = false,
}: {
  entry: RegistryEntry
  root: string
  selected: boolean
  onSelect: () => void
  /** Reports whether this component produced a real preview (for library curation). */
  onOutcome?: (previewable: boolean) => void
  /** Mount the preview immediately (used for hidden retry cards that can never intersect). */
  eager?: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  // Mount the preview iframe once the card scrolls near the viewport, so we
  // don't boot dozens of iframes at once — visible cards render without hover.
  const [inView, setInView] = useState(eager)

  useEffect(() => {
    const el = cardRef.current
    if (!el || inView) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [inView])

  const defaultProps = useMemo(
    () => composeRenderProps(initialArgs(deriveControls(entry))),
    [entry],
  )

  return (
    <div
      ref={cardRef}
      className={`group rounded-lg border transition-colors overflow-hidden ${
        selected
          ? 'border-primary/40 bg-secondary'
          : 'border-border/50 bg-muted/20 hover:border-border'
      }`}
    >
      {/* The preview is LIVE: real hover/click/scroll goes straight into the
          component (scroll demos scroll, toggles toggle). Adding to the canvas
          happens from the name bar below, which stays outside the iframe. */}
      <div className="h-[84px] flex items-center justify-center overflow-hidden bg-artboard">
        {inView && (
          <PreviewFrame
            root={root}
            filePath={entry.filePath}
            exportName={entry.exportName}
            renderProps={defaultProps}
            fit
            interactive
            placeholderOnBlank
            onOutcome={onOutcome}
            className="w-full h-full"
          />
        )}
      </div>
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData(DRAG_MIME, entry.id)
          e.dataTransfer.effectAllowed = 'copy'
        }}
        onClick={onSelect}
        title={`${entry.name} — try the live preview above; drag or click here to add it to the canvas`}
        className="px-2 py-1.5 border-t border-border/50 cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-medium truncate">{entry.name}</span>
          {entry.source === 'preset' && (
            <span className="text-[7px] font-semibold uppercase tracking-wider px-1 rounded bg-primary/20 text-accent-foreground shrink-0">
              preset
            </span>
          )}
          <span className="ml-auto flex items-center gap-1 shrink-0">
            {entry.flags.needsMocking && (
              <span
                title="Uses context or external hooks — preview mocks them"
                className="w-1.5 h-1.5 rounded-full bg-amber-400"
              />
            )}
            <span
              className="text-[10px] leading-none text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              aria-hidden
            >
              + add
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
