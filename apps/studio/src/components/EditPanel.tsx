import { useState } from 'react'
import type { RegistryEntry } from '@component-style-studio/registry'
import type { ControlSpec, StyleOverride } from '../lib/controls'
import { ARTBOARD_WIDTHS, DEFAULT_ARTBOARD_WIDTH, type PageFx } from '../lib/canvas'
import { CURSORS, LOADERS, LOADER_CSS, loaderById, loaderHtml } from '../lib/pagefx'
import { ControlInput } from './controls/ControlInput'
import { StyleTab } from './StyleTab'
import { PanelSideToggle, type PanelSide } from './PanelSideToggle'

type Tab = 'controls' | 'style' | 'animation'

export function EditPanel({
  side,
  onToggleSide,
  entry,
  controls,
  args,
  onArgChange,
  style,
  onStyleChange,
  position,
  onPositionChange,
  sizeW,
  sizeH,
  onSizeChange,
  textLock,
  onTextLockChange,
  pages,
  linkTo,
  onLinkToChange,
  linkSlots = [],
  links = {},
  onLinkSlotChange,
  animationSlot,
  pageName,
  pageFx,
  onPageFxChange,
  artboardWidth,
  onArtboardWidthChange,
  selectionCount = 0,
}: {
  side: PanelSide
  onToggleSide: () => void
  /** Null when nothing is selected — the bar stays mounted and shows an empty state. */
  entry: RegistryEntry | null
  controls: ControlSpec[]
  args: Record<string, unknown>
  onArgChange: (name: string, value: unknown) => void
  style: StyleOverride
  onStyleChange: (next: StyleOverride) => void
  position: { x: number; y: number }
  onPositionChange: (x: number, y: number) => void
  /** Explicit smart-fit size (undefined = auto/content-sized) */
  sizeW?: number
  sizeH?: number
  onSizeChange?: (w: number | undefined, h: number | undefined) => void
  /** Edge-resize stretches text (true) vs re-fits it (false, default) */
  textLock?: boolean
  onTextLockChange?: (locked: boolean) => void
  /** Pages the selected instance can navigate to (export renders a real link) */
  pages: { id: string; name: string }[]
  linkTo?: string
  onLinkToChange: (pageId: string | undefined) => void
  /** Named button slots the component exposes (data-link-slot) */
  linkSlots?: string[]
  /** Per-slot page targets */
  links?: Record<string, string>
  onLinkSlotChange?: (slot: string, pageId: string | undefined) => void
  animationSlot?: React.ReactNode
  /** Active page name (page settings shown when nothing is selected) */
  pageName?: string
  /** Active page's effects (loading screen, cursor) */
  pageFx?: PageFx
  onPageFxChange?: (fx: PageFx) => void
  /** Active page's design width (artboard) */
  artboardWidth?: number
  onArtboardWidthChange?: (w: number) => void
  /** How many instances are selected (multi-select shows a group hint, not page settings) */
  selectionCount?: number
}) {
  const [tab, setTab] = useState<Tab>('controls')
  const posClass =
    'w-full rounded-md px-2 py-1 text-xs bg-input border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring'

  const borderClass = side === 'left' ? 'border-r' : 'border-l'

  const tabs: { id: Tab; label: string }[] = [
    { id: 'controls', label: 'Controls' },
    { id: 'style', label: 'Style' },
    { id: 'animation', label: 'Animation' },
  ]

  return (
    <div className={`w-[280px] ${borderClass} border-border flex flex-col shrink-0 bg-card`}>
      <div className="px-3 pt-3 pb-2 border-b border-border shrink-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
            Configure
          </p>
          <PanelSideToggle side={side} onToggle={onToggleSide} />
        </div>
        {entry ? (
          <>
            <p className="text-xs font-semibold tracking-tight truncate mt-1">{entry.name}</p>
            <p className="text-[10px] font-mono text-muted-foreground truncate mb-2">{entry.filePath}</p>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
                Pos
              </span>
              <label className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground">X</span>
                <input
                  type="number"
                  value={Math.round(position.x)}
                  onChange={(e) => onPositionChange(Number(e.target.value), position.y)}
                  className={posClass}
                />
              </label>
              <label className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground">Y</span>
                <input
                  type="number"
                  value={Math.round(position.y)}
                  onChange={(e) => onPositionChange(position.x, Number(e.target.value))}
                  className={posClass}
                />
              </label>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
                Size
              </span>
              <label className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground">W</span>
                <input
                  type="number"
                  min={24}
                  placeholder="auto"
                  value={sizeW != null ? Math.round(sizeW) : ''}
                  onChange={(e) =>
                    onSizeChange?.(e.target.value === '' ? undefined : Number(e.target.value), sizeH)
                  }
                  className={posClass}
                />
              </label>
              <label className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground">H</span>
                <input
                  type="number"
                  min={24}
                  placeholder="auto"
                  value={sizeH != null ? Math.round(sizeH) : ''}
                  onChange={(e) =>
                    onSizeChange?.(sizeW, e.target.value === '' ? undefined : Number(e.target.value))
                  }
                  className={posClass}
                />
              </label>
            </div>
            <label
              className="flex items-center gap-1.5 mt-1.5 cursor-pointer select-none"
              title="Locked: stretching the box also stretches the text (it can distort). Unlocked: the text re-fits itself when you resize."
            >
              <input
                type="checkbox"
                checked={textLock ?? false}
                onChange={(e) => onTextLockChange?.(e.target.checked)}
                className="accent-[var(--primary,#7c6fff)]"
              />
              <span className="text-[10px] text-muted-foreground">
                Lock text to shape (stretch instead of re-fit)
              </span>
            </label>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest shrink-0"
                title="Clicking this component in the exported site navigates to the chosen page"
              >
                Links to
              </span>
              <select
                value={linkTo ?? ''}
                onChange={(e) => onLinkToChange(e.target.value || undefined)}
                className={posClass}
              >
                <option value="">— no link —</option>
                {pages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Per-button links: one picker per named slot the component exposes.
                A slot target beats the whole-component link for that button. */}
            {linkSlots.map((slot) => (
              <div key={slot} className="flex items-center gap-2 mt-1.5">
                <span
                  className="text-[9px] font-semibold text-primary/80 uppercase tracking-widest shrink-0 max-w-[88px] truncate"
                  title={`Where the "${slot}" button navigates (overrides Links to for that button)`}
                >
                  ↳ {slot}
                </span>
                <select
                  value={links[slot] ?? ''}
                  onChange={(e) => onLinkSlotChange?.(slot, e.target.value || undefined)}
                  className={posClass}
                >
                  <option value="">— no link —</option>
                  {pages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </>
        ) : null}
      </div>

      {!entry && selectionCount > 1 ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-[11px] text-muted-foreground text-center">
            {selectionCount} components selected — drag to move them together, Delete removes them,
            arrows nudge. Select one to edit its props.
          </p>
        </div>
      ) : !entry ? (
        <div className="flex-1 overflow-y-auto p-3">
          {/* PAGE settings: effects that belong to the page itself, not to a
              placeable component — the loading screen shown while the page
              loads, and the cursor effect. */}
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
            Page — {pageName ?? 'current'}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1 mb-3">
            Select a component to edit it — or set what this page does on its own:
          </p>

          <p
            className="text-[10px] font-semibold mb-1.5"
            title="The page's design width. Visitors on smaller screens see the page scaled to fit."
          >
            Page width
          </p>
          <select
            value={artboardWidth ?? DEFAULT_ARTBOARD_WIDTH}
            onChange={(e) => onArtboardWidthChange?.(Number(e.target.value))}
            className="w-full rounded-md px-2 py-1 mb-3 text-xs bg-input border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {ARTBOARD_WIDTHS.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>

          <p className="text-[10px] font-semibold mb-1.5" title="Shown while the page loads (and on navigation) in the exported site">
            Loading screen
          </p>
          <select
            value={pageFx?.loader ?? ''}
            onChange={(e) => onPageFxChange?.({ ...pageFx, loader: e.target.value || undefined })}
            className="w-full rounded-md px-2 py-1 text-xs bg-input border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">— none —</option>
            {LOADERS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
          {pageFx?.loader && loaderById(pageFx.loader) && (
            <>
              <div
                className="mt-2 h-[92px] rounded-lg border border-border flex items-center justify-center overflow-hidden"
                style={{ background: '#0c0c0f' }}
                dangerouslySetInnerHTML={{
                  __html: `<style>${LOADER_CSS}</style>${loaderHtml(loaderById(pageFx.loader)!, pageFx.loaderAccent || '#4B3BFF')}`,
                }}
              />
              <div className="flex items-center gap-2 mt-2">
                <label className="flex items-center gap-1.5 flex-1">
                  <span className="text-[10px] text-muted-foreground">Color</span>
                  <input
                    type="color"
                    value={pageFx.loaderAccent || '#4B3BFF'}
                    onChange={(e) => onPageFxChange?.({ ...pageFx, loaderAccent: e.target.value })}
                    className="w-7 h-6 rounded border border-border bg-input p-0.5 cursor-pointer"
                  />
                </label>
                <label className="flex items-center gap-1.5 flex-1">
                  <span className="text-[10px] text-muted-foreground shrink-0">Secs</span>
                  <input
                    type="number"
                    min={0.2}
                    max={10}
                    step={0.2}
                    value={((pageFx.loaderMs ?? 1400) / 1000).toFixed(1)}
                    onChange={(e) =>
                      onPageFxChange?.({ ...pageFx, loaderMs: Math.round(Number(e.target.value) * 1000) })
                    }
                    className="w-full rounded-md px-2 py-1 text-xs bg-input border border-border text-foreground focus:outline-none"
                  />
                </label>
              </div>
            </>
          )}

          <p className="text-[10px] font-semibold mb-1.5 mt-4" title="Custom cursor effect on this page in the exported site">
            Cursor effect
          </p>
          <select
            value={pageFx?.cursor ?? ''}
            onChange={(e) => onPageFxChange?.({ ...pageFx, cursor: e.target.value || undefined })}
            className="w-full rounded-md px-2 py-1 text-xs bg-input border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">— default cursor —</option>
            {CURSORS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {pageFx?.cursor && (
            <div className="flex items-center gap-2 mt-2">
              <label className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground">Color</span>
                <input
                  type="color"
                  value={pageFx.cursorAccent || '#E3B23C'}
                  onChange={(e) => onPageFxChange?.({ ...pageFx, cursorAccent: e.target.value })}
                  className="w-7 h-6 rounded border border-border bg-input p-0.5 cursor-pointer"
                />
              </label>
              <p className="text-[10px] text-muted-foreground flex-1">
                {CURSORS.find((c) => c.id === pageFx.cursor)?.description}
              </p>
            </div>
          )}
          <p className="text-[10px] text-muted-foreground mt-3">
            Both play in the exported site: the loading screen on load and on navigation to this page,
            the cursor while it's open.
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-0.5 px-2 pt-2 shrink-0">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex-1 px-2 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {tab === 'controls' && (
              // Keyed by component so the filter query and Advanced disclosure
              // reset when the selection changes (a hidden lingering filter
              // would silently blank the next component's controls).
              <ControlsTab
                key={entry?.id ?? 'none'}
                controls={controls}
                args={args}
                onArgChange={onArgChange}
              />
            )}
            {tab === 'style' && <StyleTab value={style} onChange={onStyleChange} />}
            {tab === 'animation' && animationSlot}
          </div>
        </>
      )}
    </div>
  )
}

/**
 * Controls tab: primary (component-authored) props up front; inherited
 * plumbing collapsed under "Advanced"; a filter box once the list is long.
 */
function ControlsTab({
  controls,
  args,
  onArgChange,
}: {
  controls: ControlSpec[]
  args: Record<string, unknown>
  onArgChange: (name: string, value: unknown) => void
}) {
  const [query, setQuery] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  if (controls.length === 0) {
    return <p className="text-[11px] text-muted-foreground">No editable props detected.</p>
  }

  const q = query.trim().toLowerCase()
  const matches = (c: ControlSpec) =>
    q === '' ||
    c.name.toLowerCase().includes(q) ||
    (c.description ?? '').toLowerCase().includes(q)

  const primary = controls.filter((c) => !c.advanced && matches(c))
  const advanced = controls.filter((c) => c.advanced && matches(c))
  // While searching, matches from Advanced surface directly — a filter that
  // hides its own results behind a second click would read as "no results".
  const advancedOpen = showAdvanced || q !== ''

  const renderControl = (control: ControlSpec) => (
    <ControlInput
      key={control.name}
      control={control}
      value={args[control.name]}
      onChange={(v) => onArgChange(control.name, v)}
    />
  )

  return (
    <div>
      {controls.length > 8 && (
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter controls…"
          className="w-full rounded-md px-2 py-1 mb-3 text-[11px] bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      )}
      {primary.map(renderControl)}
      {primary.length === 0 && advanced.length === 0 && (
        <p className="text-[11px] text-muted-foreground">No controls match "{query}".</p>
      )}
      {advanced.length > 0 && (
        <div className={primary.length > 0 ? 'mt-2 pt-2 border-t border-border' : ''}>
          {q === '' && (
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="w-full flex items-center gap-1 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <span
                className={`inline-block transition-transform ${advancedOpen ? 'rotate-90' : ''}`}
              >
                ▸
              </span>
              Advanced ({advanced.length})
            </button>
          )}
          {advancedOpen && <div className={q === '' ? 'mt-1' : ''}>{advanced.map(renderControl)}</div>}
        </div>
      )}
    </div>
  )
}
