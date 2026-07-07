import { useEffect, useMemo, useState } from 'react'
import type { RegistryEntry, ScanResult } from '@component-style-studio/registry'
import { deriveControls, initialArgs, type StyleOverride } from '../lib/controls'
import { type Instance, newInstanceId } from '../lib/canvas'
import { fetchPresets, type PresetLibrary } from '../lib/api'
import { LibraryPanel } from './LibraryPanel'
import { EditPanel } from './EditPanel'
import { Canvas } from './Canvas'

const NO_PRESETS: PresetLibrary = { root: '', entries: [] }

export function Workspace({ result, onReset }: { result: ScanResult; onReset: () => void }) {
  const [presets, setPresets] = useState<PresetLibrary>(NO_PRESETS)
  const [instances, setInstances] = useState<Instance[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    fetchPresets().then((p) => alive && setPresets(p))
    return () => {
      alive = false
    }
  }, [])

  const entries = useMemo(
    () => [...result.entries, ...presets.entries],
    [result.entries, presets.entries],
  )
  const entryById = useMemo(() => {
    const map = new Map(entries.map((e) => [e.id, e]))
    return (id: string) => map.get(id)
  }, [entries])
  const rootFor = (e: RegistryEntry) => (e.source === 'preset' ? presets.root : result.root)

  const selected = instances.find((i) => i.id === selectedId) ?? null
  const selectedEntry = selected ? (entryById(selected.entryId) ?? null) : null
  const controls = useMemo(
    () => (selectedEntry ? deriveControls(selectedEntry) : []),
    [selectedEntry],
  )

  const addInstance = (entryId: string, x: number, y: number) => {
    const entry = entryById(entryId)
    if (!entry) return
    const inst: Instance = {
      id: newInstanceId(),
      entryId,
      x,
      y,
      args: initialArgs(deriveControls(entry)),
      style: {},
    }
    setInstances((prev) => [...prev, inst])
    setSelectedId(inst.id)
  }
  const addFromLibrary = (entryId: string) => {
    const offset = 40 + (instances.length % 6) * 28
    addInstance(entryId, offset, offset)
  }
  const patchInstance = (id: string, patch: Partial<Instance>) =>
    setInstances((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  const removeInstance = (id: string) => {
    setInstances((prev) => prev.filter((i) => i.id !== id))
    setSelectedId((cur) => (cur === id ? null : cur))
  }
  const setArg = (name: string, value: unknown) => {
    if (!selected) return
    patchInstance(selected.id, { args: { ...selected.args, [name]: value } })
  }
  const setStyle = (next: StyleOverride) => {
    if (!selected) return
    patchInstance(selected.id, { style: next })
  }

  return (
    <div className="h-svh flex flex-col">
      <header className="h-11 shrink-0 border-b border-border bg-card flex items-center gap-3 px-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span className="text-sm font-semibold tracking-tight">Style Studio</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <span
          className="text-[11px] font-mono text-muted-foreground truncate max-w-80"
          title={result.root}
        >
          {result.root}
        </span>
        {instances.length > 0 && (
          <span className="text-[11px] text-muted-foreground">
            {instances.length} on canvas
          </span>
        )}
        <span className="text-[11px] text-muted-foreground ml-auto shrink-0">
          {result.stats.componentsFound} imported · {presets.entries.length} presets
        </span>
        <button
          type="button"
          onClick={onReset}
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary hover:bg-secondary/70 transition-colors"
        >
          New import
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden min-h-0">
        <LibraryPanel
          entries={entries}
          selectedId={selectedEntry?.id ?? null}
          onSelect={addFromLibrary}
          rootFor={rootFor}
        />

        <Canvas
          instances={instances}
          entryById={entryById}
          rootFor={rootFor}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={addInstance}
          onMove={(id, x, y) => patchInstance(id, { x, y })}
          onRemove={removeInstance}
        />

        {selected && selectedEntry && (
          <EditPanel
            entry={selectedEntry}
            controls={controls}
            args={selected.args}
            onArgChange={setArg}
            style={selected.style}
            onStyleChange={setStyle}
          />
        )}
      </div>
    </div>
  )
}
