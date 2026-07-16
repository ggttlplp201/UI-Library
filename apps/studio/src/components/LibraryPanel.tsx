import { useCallback, useMemo, useState } from 'react'
import type { RegistryEntry } from '@component-style-studio/registry'
import type { AnimPresetDef } from '../lib/animation'
import { AnimationsMenu } from './AnimationsMenu'
import type { FxDef } from '@component-style-studio/preview/fx'
import { LibraryCard } from './LibraryCard'
import { PanelSideToggle, type PanelSide } from './PanelSideToggle'

type LibraryMode = 'components' | 'animations'

/**
 * Curated sets shown as expandable "kits": clicking one unfolds the list of
 * its components. A kit is any styleFamily registered here — recreated sets
 * add a row and appear automatically.
 */
const KITS: { family: string; title: string; accent: string; blurb: string }[] = [
  { family: 'kinetic', title: 'Kinetic UI', accent: '#4B3BFF', blurb: 'Light editorial kit — springy indigo controls' },
  { family: 'kinetic-lab', title: 'Kinetic Lab', accent: '#E08600', blurb: 'Playful physics — fills, dials, elastic toggles' },
  { family: 'basics', title: 'Basics', accent: '#8a8f98', blurb: 'Page primitives — text, images, panels, backdrops' },
  { family: 'cupertino', title: 'Cupertino', accent: '#0A84FF', blurb: 'Liquid-glass iOS kit — frosted tints, springs' },
  { family: 'glitchtype', title: 'Glitchtype', accent: '#00E5A0', blurb: 'CRT terminal — scanlines, glitch, phosphor type' },
  { family: 'chicago95', title: 'Chicago 95', accent: '#008080', blurb: 'Retro OS — beveled chrome, pixel dialogs' },
  { family: 'spritecraft', title: 'Spritecraft', accent: '#FFD750', blurb: '8-bit game HUD — blocky sprites, hard shadows' },
  { family: 'marginalia', title: 'Marginalia', accent: '#B8524D', blurb: 'Ink & paper — annotations, stamps, serifs' },
  { family: 'boldcase', title: 'Boldcase', accent: '#F91814', blurb: 'Brutalist poster type — huge grotesk, hard rules' },
  { family: 'voltura', title: 'Voltura', accent: '#BF5AF2', blurb: 'Electric dark — voltage gradients, neon edges' },
  { family: 'overworld', title: 'Overworld', accent: '#30D158', blurb: 'Adventure UI — parchment maps, quest chrome' },
]

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
  appliedFx,
  onApplyFx,
  onClearFx,
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
  appliedFx?: string
  onApplyFx: (fx: FxDef) => void
  onClearFx: () => void
  /** Animation preset id applied to the current selection */
  appliedPreset?: string
  onApplyAnimation: (preset: AnimPresetDef) => void
  onClearAnimation: () => void
}) {
  const [mode, setMode] = useState<LibraryMode>('components')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [openKit, setOpenKit] = useState<string | null>(null)
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

  // Kits: curated styleFamily sets, browsable as expandable groups. Shown when
  // not searching and not inside a category — those views search everything.
  const kits = useMemo(() => {
    const byFamily = new Map<string, RegistryEntry[]>()
    for (const e of entries) {
      const fam = e.meta?.styleFamily
      if (!fam || e.meta?.hidden || broken.has(e.id)) continue
      const list = byFamily.get(fam) ?? []
      list.push(e)
      byFamily.set(fam, list)
    }
    return KITS.map((k) => ({ ...k, entries: byFamily.get(k.family) ?? [] })).filter(
      (k) => k.entries.length > 0,
    )
  }, [entries, broken])
  const showKits = mode === 'components' && search.trim() === '' && category === 'all'

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
          appliedFx={appliedFx}
          onApply={onApplyAnimation}
          onClear={onClearAnimation}
          onApplyFx={onApplyFx}
          onClearFx={onClearFx}
        />
      ) : (
        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {/* Kits: designed sets that unfold into their components. */}
          {showKits && kits.length > 0 && (
            <div className="mb-2">
              <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-1.5">
                Kits
              </p>
              <div className="flex flex-col gap-1">
                {kits.map((kit) => {
                  const open = openKit === kit.family
                  return (
                    <div key={kit.family} className="rounded-lg border border-border/60 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenKit(open ? null : kit.family)}
                        className={`w-full flex items-center gap-2 px-2.5 py-2 text-left transition-colors ${
                          open ? 'bg-secondary' : 'bg-card hover:bg-secondary/60'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: kit.accent }}
                        />
                        <span className="text-[12px] font-semibold tracking-tight">{kit.title}</span>
                        <span className="text-[10px] text-muted-foreground">{kit.entries.length}</span>
                        <span className="ml-auto text-[10px] text-muted-foreground">
                          {open ? '▾' : '▸'}
                        </span>
                      </button>
                      {open && (
                        <div className="px-1.5 pb-1.5 bg-secondary/40">
                          <p className="text-[10px] text-muted-foreground px-1 py-1">{kit.blurb}</p>
                          <div className="grid grid-cols-2 gap-1.5 auto-rows-[116px] content-start">
                            {kit.entries.map((entry) => (
                              <LibraryCard
                                key={entry.id}
                                entry={entry}
                                root={rootFor(entry)}
                                selected={selectedId === entry.id}
                                onSelect={() => onSelect(entry.id)}
                                onOutcome={(previewable) => markOutcome(entry.id, previewable)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest px-1 mt-3 mb-1.5">
                All components
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-1.5 auto-rows-[116px] content-start">
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
        </div>
      )}
    </div>
  )
}
