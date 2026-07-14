import { useCallback, useMemo, useState } from 'react'
import type { RegistryEntry } from '@component-style-studio/registry'
import type { AnimPresetDef } from '../lib/animation'
import { AnimationsMenu } from './AnimationsMenu'
import { LibraryCard } from './LibraryCard'
import { PanelSideToggle, type PanelSide } from './PanelSideToggle'

type LibraryMode = 'components' | 'animations'

/**
 * The right-hand library. Two menus: Components (building blocks placed on
 * the canvas) and Animations (motion presets applied to a placed component).
 */
export function LibraryPanel({
  entries,
  selectedId,
  onSelect,
  rootFor,
  side,
  onToggleSide,
  canApplyAnimation,
  appliedPreset,
  onApplyAnimation,
  onClearAnimation,
}: {
  entries: RegistryEntry[]
  selectedId: string | null
  onSelect: (id: string) => void
  rootFor: (entry: RegistryEntry) => string
  side: PanelSide
  onToggleSide: () => void
  /** True when a canvas instance is selected (animations can be applied) */
  canApplyAnimation: boolean
  /** Animation preset id applied to the current selection */
  appliedPreset?: string
  onApplyAnimation: (preset: AnimPresetDef) => void
  onClearAnimation: () => void
}) {
  const [mode, setMode] = useState<LibraryMode>('components')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  // Ids of components that can't produce a real preview (error / bare text).
  // A card reports this once it renders; we drop those from the grid so every
  // visible component has a working preview.
  const [broken, setBroken] = useState<Set<string>>(new Set())

  const markOutcome = useCallback((id: string, previewable: boolean) => {
    setBroken((prev) => {
      if (previewable === !prev.has(id)) return prev
      const next = new Set(prev)
      if (previewable) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const categories = useMemo(() => {
    const set = new Set(entries.map((e) => e.category ?? 'other'))
    return ['all', ...[...set].sort()]
  }, [entries])

  const matches = entries.filter((entry) => {
    if (category !== 'all' && (entry.category ?? 'other') !== category) return false
    const query = search.trim().toLowerCase()
    if (!query) return true
    return entry.name.toLowerCase().includes(query) || entry.filePath.toLowerCase().includes(query)
  })

  // Drop non-previewable components, then de-duplicate by name (a component name
  // exported from several files, or shared between imported + presets, appears
  // once). Broken entries are skipped before a name is claimed, so a working
  // same-named component can still take the slot. They stay mounted but hidden
  // rather than unmounted — a transient first-load failure (dev server still
  // transforming) can then recover and restore the card.
  const seenNames = new Set<string>()
  const filtered: RegistryEntry[] = []
  const hiddenRetry: RegistryEntry[] = []
  for (const entry of matches) {
    if (broken.has(entry.id)) {
      hiddenRetry.push(entry)
      continue
    }
    if (seenNames.has(entry.name)) continue
    seenNames.add(entry.name)
    filtered.push(entry)
  }

  return (
    <div
      className={`w-[260px] ${side === 'left' ? 'border-r' : 'border-l'} border-border flex flex-col shrink-0 bg-card`}
    >
      <div className="px-3 pt-3 pb-2 shrink-0">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
            Library
          </p>
          <PanelSideToggle side={side} onToggle={onToggleSide} />
        </div>
        <div className="flex gap-0.5 mb-2 rounded-lg bg-secondary/60 p-0.5">
          {(
            [
              { id: 'components', label: 'Components' },
              { id: 'animations', label: 'Animations' },
            ] as { id: LibraryMode; label: string }[]
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`flex-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                mode === m.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        {mode === 'components' && (
          <>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              spellCheck={false}
              className="w-full rounded-md px-2.5 py-1.5 text-xs bg-secondary border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring mb-2"
            />
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors ${
                    category === cat
                      ? 'bg-primary/20 text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {mode === 'animations' ? (
        <AnimationsMenu
          canApply={canApplyAnimation}
          appliedPreset={appliedPreset}
          onApply={onApplyAnimation}
          onClear={onClearAnimation}
        />
      ) : (
        <div className="flex-1 overflow-y-auto px-2 pb-3 grid grid-cols-2 gap-1.5 auto-rows-[116px] content-start">
          {filtered.map((entry) => (
            <LibraryCard
              key={entry.id}
              entry={entry}
              root={rootFor(entry)}
              selected={selectedId === entry.id}
              onSelect={() => onSelect(entry.id)}
              onOutcome={(previewable) => markOutcome(entry.id, previewable)}
            />
          ))}
          {/* Broken previews keep rendering invisibly so a recovered render
              (harness import retry) can bring the card back. */}
          {hiddenRetry.map((entry) => (
            <div key={entry.id} className="hidden">
              <LibraryCard
                entry={entry}
                root={rootFor(entry)}
                selected={false}
                eager
                onSelect={() => onSelect(entry.id)}
                onOutcome={(previewable) => markOutcome(entry.id, previewable)}
              />
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-2 text-[11px] text-muted-foreground px-2 py-2">No matches.</p>
          )}
        </div>
      )}
    </div>
  )
}
