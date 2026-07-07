import { useEffect, useMemo, useRef, useState } from 'react'
import type { RegistryEntry, ScanResult } from '@component-style-studio/registry'
import { deriveControls, initialArgs, type ControlSpec, type StyleOverride } from '../lib/controls'
import { type AnimConfig, type Instance, newInstanceId } from '../lib/canvas'
import { fetchPresets, type PresetLibrary } from '../lib/api'
import { LibraryPanel } from './LibraryPanel'
import { EditPanel } from './EditPanel'
import { AnimationTab } from './AnimationTab'
import { Canvas, type CanvasHandle, type CanvasTheme } from './Canvas'
import type { PanelSide } from './PanelSideToggle'

const NO_PRESETS: PresetLibrary = { root: '', entries: [] }

// Default text color a dropped component gets so it's legible against the
// current canvas background (dark canvas → light text, and vice versa).
const CONTRAST_TEXT: Record<CanvasTheme, string> = { dark: '#e8e8ed', light: '#111115' }

export function Workspace({ result, onReset }: { result: ScanResult; onReset: () => void }) {
  const [presets, setPresets] = useState<PresetLibrary>(NO_PRESETS)
  const [instances, setInstances] = useState<Instance[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [canvasTheme, setCanvasTheme] = useState<CanvasTheme>('dark')
  const [librarySide, setLibrarySide] = useState<PanelSide>('right')
  const [configSide, setConfigSide] = useState<PanelSide>('left')
  const canvasRef = useRef<CanvasHandle>(null)

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
      // Seed a contrasting text color so text-bearing components are visible
      // on the current canvas background; the user can override in Style.
      style: { color: CONTRAST_TEXT[canvasTheme] },
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
  const setAnim = (next: AnimConfig) => {
    if (!selected) return
    patchInstance(selected.id, { anim: next })
  }
  const replayAnim = () => {
    if (!selected) return
    patchInstance(selected.id, { replay: (selected.replay ?? 0) + 1 })
  }

  // The primary editable-text prop of a component: children (injected or real),
  // else its first text control. Used for double-click inline text editing.
  const primaryTextName = (entry: RegistryEntry): string | undefined => {
    const c: ControlSpec[] = deriveControls(entry)
    return (c.find((x) => x.name === 'children') ?? c.find((x) => x.kind === 'text'))?.name
  }
  const textOf = (inst: Instance): string => {
    if (inst.style.text != null) return inst.style.text
    const entry = entryById(inst.entryId)
    const name = entry ? primaryTextName(entry) : undefined
    return name ? String(inst.args[name] ?? '') : ''
  }
  const setInstanceText = (id: string, text: string) => {
    const inst = instances.find((i) => i.id === id)
    const entry = inst ? entryById(inst.entryId) : undefined
    if (!inst || !entry) return
    const name = primaryTextName(entry)
    if (name) patchInstance(id, { args: { ...inst.args, [name]: text } })
    else patchInstance(id, { style: { ...inst.style, text } })
  }

  const handleExport = async () => {
    const html = await canvasRef.current?.exportComposition()
    if (!html) return
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'style-studio-export.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  const configPanel = (
    <EditPanel
      key="config"
      side={configSide}
      onToggleSide={() => setConfigSide((s) => (s === 'left' ? 'right' : 'left'))}
      entry={selectedEntry}
      controls={controls}
      args={selected?.args ?? {}}
      onArgChange={setArg}
      style={selected?.style ?? {}}
      onStyleChange={setStyle}
      position={{ x: selected?.x ?? 0, y: selected?.y ?? 0 }}
      onPositionChange={(x, y) => selected && patchInstance(selected.id, { x, y })}
      animationSlot={
        <AnimationTab value={selected?.anim} onChange={setAnim} onReplay={replayAnim} />
      }
    />
  )

  const libraryPanel = (
    <LibraryPanel
      key="library"
      entries={entries}
      selectedId={selectedEntry?.id ?? null}
      onSelect={addFromLibrary}
      rootFor={rootFor}
      side={librarySide}
      onToggleSide={() => setLibrarySide((s) => (s === 'left' ? 'right' : 'left'))}
    />
  )

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
          title={result.root || 'Preset library'}
        >
          {result.root || 'Preset library'}
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
          onClick={() => setCanvasTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          title={`Canvas: ${canvasTheme} — click for ${canvasTheme === 'dark' ? 'light' : 'dark'}`}
          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs bg-secondary hover:bg-secondary/70 transition-colors"
        >
          {canvasTheme === 'dark' ? '☾' : '☀'}
        </button>
        <button
          type="button"
          onClick={handleExport}
          disabled={instances.length === 0}
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-default transition-colors"
        >
          Export
        </button>
        <button
          type="button"
          onClick={onReset}
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary hover:bg-secondary/70 transition-colors"
        >
          New import
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {configSide === 'left' && configPanel}
        {librarySide === 'left' && libraryPanel}

        <Canvas
          ref={canvasRef}
          instances={instances}
          entryById={entryById}
          rootFor={rootFor}
          theme={canvasTheme}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={addInstance}
          onMove={(id, x, y) => patchInstance(id, { x, y })}
          onTransform={(id, patch) => patchInstance(id, patch)}
          onRemove={removeInstance}
          textOf={textOf}
          onEditText={setInstanceText}
        />

        {librarySide === 'right' && libraryPanel}
        {configSide === 'right' && configPanel}
      </div>
    </div>
  )
}
