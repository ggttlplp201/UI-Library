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
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(DRAG_MIME, entry.id)
        e.dataTransfer.effectAllowed = 'copy'
      }}
      onClick={onSelect}
      title={`${entry.name} — drag anywhere on the card (or click) to add it to the canvas`}
      className={`group rounded-lg border transition-colors overflow-hidden cursor-grab active:cursor-grabbing select-none ${
        selected
          ? 'border-primary/40 bg-secondary'
          : 'border-border/50 bg-muted/20 hover:border-border'
      }`}
    >
      {/* The WHOLE card is the drag/click handle, so the preview iframe stays
          pointer-transparent here. Components go live once on the canvas. */}
      <div className="relative h-[84px] flex items-center justify-center overflow-hidden bg-artboard">
        {inView && (
          <PreviewFrame
            root={root}
            filePath={entry.filePath}
            exportName={entry.exportName}
            renderProps={defaultProps}
            fit
            interactive={false}
            placeholderOnBlank
            onOutcome={onOutcome}
            className="w-full h-full"
          />
        )}
        {/* Badges overlay the thumbnail so the footer keeps its full width
            for the component NAME (previously truncated to two letters). */}
        {entry.source === 'preset' && (
          <span className="absolute top-1 right-1 text-[7px] font-semibold uppercase tracking-wider px-1 py-px rounded bg-black/45 text-white/80">
            preset
          </span>
        )}
        {entry.flags.needsMocking && (
          <span
            title="Uses context or external hooks — preview mocks them"
            className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-amber-400"
          />
        )}
        <span
          className="absolute bottom-1 right-1 text-[10px] leading-none px-1 py-0.5 rounded bg-black/45 text-white/85 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden
        >
          + add
        </span>
      </div>
      <div className="px-2 py-1.5 border-t border-border/50">
        {/* Spaced camelCase names wrap to two lines instead of truncating. */}
        <span
          className="block text-[11px] leading-tight font-medium break-words [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden"
          title={entry.name}
        >
          {entry.name.replace(/([a-z0-9])([A-Z])/g, '$1​$2')}
        </span>
      </div>
    </div>
  )
}
