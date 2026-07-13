import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RegistryEntry, ScanResult } from '@component-style-studio/registry'
import { deriveControls, initialArgs, type ControlSpec, type StyleOverride } from '../lib/controls'
import { type AnimConfig, type Instance, newInstanceId } from '../lib/canvas'
import { fetchPresets, type CodeSyncPayload, type PresetLibrary } from '../lib/api'
import { CodePane } from './CodePane'
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
  const [showCode, setShowCode] = useState(true)
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
  const rootFor = useCallback(
    (e: RegistryEntry) => (e.source === 'preset' ? presets.root : result.root),
    [presets.root, result.root],
  )

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
  // Nested updates read from `prev` (not the captured `selected`) so rapid /
  // batched edits can't clobber each other.
  const updateSelected = (fn: (inst: Instance) => Instance) => {
    if (!selectedId) return
    setInstances((prev) => prev.map((i) => (i.id === selectedId ? fn(i) : i)))
  }
  const setArg = (name: string, value: unknown) =>
    updateSelected((i) => ({ ...i, args: { ...i.args, [name]: value } }))
  const setStyle = (next: StyleOverride) => updateSelected((i) => ({ ...i, style: next }))
  const setAnim = (next: AnimConfig) => updateSelected((i) => ({ ...i, anim: next }))
  const replayAnim = () => updateSelected((i) => ({ ...i, replay: (i.replay ?? 0) + 1 }))

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
    setInstances((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i
        const entry = entryById(i.entryId)
        const name = entry ? primaryTextName(entry) : undefined
        return name
          ? { ...i, args: { ...i.args, [name]: text } }
          : { ...i, style: { ...i.style, text } }
      }),
    )
  }

  // The selected instance's edit state as a code-sync request (Phase 7).
  // Canvas x/y stay composition-level and are not written into the
  // component's source; text is sent only when it differs from the default.
  const codePayload = useMemo<CodeSyncPayload | null>(() => {
    if (!selected || !selectedEntry) return null
    const root = rootFor(selectedEntry)
    if (!root) return null
    const { text: styleText, ...style } = selected.style
    const textName = primaryTextName(selectedEntry)
    const textControl = controls.find((c) => c.name === textName)
    const argText =
      textName != null && textControl && selected.args[textName] !== textControl.defaultValue
        ? String(selected.args[textName] ?? '')
        : undefined
    const text = styleText ?? argText
    return {
      root,
      filePath: selectedEntry.filePath,
      exportName: selectedEntry.exportName,
      ...(text != null ? { text } : {}),
      style,
      position: {
        ...(selected.scaleX != null ? { scaleX: selected.scaleX } : {}),
        ...(selected.scaleY != null ? { scaleY: selected.scaleY } : {}),
        ...(selected.rotation != null ? { rotation: selected.rotation } : {}),
      },
      ...(selected.anim ? { anim: selected.anim } : {}),
    }
  }, [selected, selectedEntry, controls, rootFor])

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
          onClick={() => setShowCode((v) => !v)}
          title={showCode ? 'Hide generated code' : 'Show generated code'}
          className={`shrink-0 px-2 h-7 rounded-lg flex items-center justify-center text-[11px] font-mono transition-colors ${
            showCode ? 'bg-secondary text-foreground' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
          }`}
        >
          {'</>'}
        </button>
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

        <div className="flex-1 flex flex-col min-w-0">
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
          {showCode && (
            <CodePane
              payload={codePayload}
              title={selectedEntry ? `${selectedEntry.name} — ${selectedEntry.filePath}` : null}
              onClose={() => setShowCode(false)}
            />
          )}
        </div>

        {librarySide === 'right' && libraryPanel}
        {configSide === 'right' && configPanel}
      </div>
    </div>
  )
}
