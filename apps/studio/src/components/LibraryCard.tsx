import { useEffect, useMemo, useRef, useState } from 'react'
import type { RegistryEntry } from '@component-style-studio/registry'
import { composeRenderProps, deriveControls, initialArgs } from '../lib/controls'
import { readThumb, writeThumb, type ThumbSnap } from '../lib/thumbcache'
import { PreviewFrame, type PreviewHandle } from './PreviewFrame'

/** MIME-ish key carrying the dragged component's entry id to the Canvas (Phase 4). */
export const DRAG_MIME = 'application/x-css-entry'

/** Instant static replay of a cached thumbnail (no live iframe, no vite round-trip). */
function Snapshot({ snap }: { snap: ThumbSnap }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setScale(Math.min(r.width / snap.w, r.height / snap.h, 1))
  }, [snap])
  const doc = `<!doctype html><html><head><style>html,body{margin:0;padding:0;background:transparent;overflow:hidden}#r{width:max-content}</style><style>${snap.css}</style></head><body><div id="r">${snap.html}</div></body></html>`
  return (
    <div ref={boxRef} className="w-full h-full flex items-center justify-center overflow-hidden">
      <iframe
        title="thumbnail"
        srcDoc={doc}
        style={{
          width: snap.w,
          height: snap.h,
          border: 0,
          colorScheme: 'light',
          pointerEvents: 'none',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      />
    </div>
  )
}

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
  // Cached snapshot from a previous session: shown instantly, no live render.
  const [snap] = useState<ThumbSnap | null>(() =>
    entry.source === 'preset' ? readThumb(entry.id) : null,
  )
  const [ready, setReady] = useState(false)
  const frameRef = useRef<PreviewHandle>(null)
  const sizeRef = useRef<{ w: number; h: number } | null>(null)

  // A cached snapshot only ever exists for a component that previewed fine —
  // report that to the library curation just like a live render would.
  const onOutcomeRef = useRef(onOutcome)
  onOutcomeRef.current = onOutcome
  useEffect(() => {
    if (snap) onOutcomeRef.current?.(true)
  }, [snap])

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
          pointer-transparent here. Components go live once on the canvas.
          While a live render is pending the tile stays dark (no white flash in
          a dark UI); it switches to the artboard surface when content lands. */}
      <div
        className={`relative h-[84px] flex items-center justify-center overflow-hidden transition-colors ${
          snap || ready ? 'bg-artboard' : 'bg-card'
        }`}
      >
        {snap ? (
          <Snapshot snap={snap} />
        ) : (
          inView && (
            <PreviewFrame
              ref={frameRef}
              root={root}
              filePath={entry.filePath}
              exportName={entry.exportName}
              renderProps={defaultProps}
              fit
              interactive={false}
              placeholderOnBlank
              onSize={(s) => {
                sizeRef.current = { w: s.width, h: s.height }
              }}
              onOutcome={(ok) => {
                setReady(true)
                onOutcome?.(ok)
                // Cache the rendered preview for the next session. A short
                // settle delay lets entrance animations land first.
                if (ok && entry.source === 'preset') {
                  setTimeout(async () => {
                    const r = await frameRef.current?.serialize()
                    const size = sizeRef.current
                    if (r?.html && size) writeThumb(entry.id, r.html, r.css, size.w, size.h)
                  }, 800)
                }
              }}
              className="w-full h-full"
            />
          )
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
