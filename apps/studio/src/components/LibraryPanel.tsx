import { useMemo, useState } from 'react'
import type { RegistryEntry } from '@component-style-studio/registry'

export function LibraryPanel({
  entries,
  selectedId,
  onSelect,
}: {
  entries: RegistryEntry[]
  selectedId: string | null
  onSelect: (id: string) => void
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
    <div className="w-[250px] border-r border-border flex flex-col shrink-0 bg-card">
      <div className="px-3 pt-3 pb-2 shrink-0">
        <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">
          Components
        </p>
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

      <ul className="flex-1 overflow-y-auto px-2 pb-3">
        {filtered.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              onClick={() => onSelect(entry.id)}
              className={`w-full text-left rounded-md px-2.5 py-2 mb-0.5 border transition-colors ${
                selectedId === entry.id
                  ? 'border-primary/35 bg-secondary'
                  : 'border-transparent hover:bg-secondary/60'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className="text-xs font-medium truncate">{entry.name}</span>
                {entry.flags.needsMocking && (
                  <span
                    title="Uses context or external hooks — preview will mock"
                    className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"
                  />
                )}
              </span>
              <span className="block text-[10px] text-muted-foreground truncate">
                {entry.filePath}
              </span>
            </button>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-[11px] text-muted-foreground px-2.5 py-2">No matches.</li>
        )}
      </ul>
    </div>
  )
}
