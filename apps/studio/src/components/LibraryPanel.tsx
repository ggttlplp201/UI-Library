import { useMemo, useState } from 'react'
import type { RegistryEntry } from '@component-style-studio/registry'
import { LibraryCard } from './LibraryCard'
import { PanelSideToggle, type PanelSide } from './PanelSideToggle'

export function LibraryPanel({
  entries,
  selectedId,
  onSelect,
  rootFor,
  side,
  onToggleSide,
}: {
  entries: RegistryEntry[]
  selectedId: string | null
  onSelect: (id: string) => void
  rootFor: (entry: RegistryEntry) => string
  side: PanelSide
  onToggleSide: () => void
}) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')

  const categories = useMemo(() => {
    const set = new Set(entries.map((e) => e.category ?? 'other'))
    return ['all', ...[...set].sort()]
  }, [entries])

  const filtered = entries.filter((entry) => {
    if (category !== 'all' && (entry.category ?? 'other') !== category) return false
    const query = search.trim().toLowerCase()
    if (!query) return true
    return entry.name.toLowerCase().includes(query) || entry.filePath.toLowerCase().includes(query)
  })

  return (
    <div
      className={`w-[260px] ${side === 'left' ? 'border-r' : 'border-l'} border-border flex flex-col shrink-0 bg-card`}
    >
      <div className="px-3 pt-3 pb-2 shrink-0">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
            Components
          </p>
          <PanelSideToggle side={side} onToggle={onToggleSide} />
        </div>
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
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3 grid grid-cols-2 gap-1.5 auto-rows-[116px] content-start">
        {filtered.map((entry) => (
          <LibraryCard
            key={entry.id}
            entry={entry}
            root={rootFor(entry)}
            selected={selectedId === entry.id}
            onSelect={() => onSelect(entry.id)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 text-[11px] text-muted-foreground px-2 py-2">No matches.</p>
        )}
      </div>
    </div>
  )
}
