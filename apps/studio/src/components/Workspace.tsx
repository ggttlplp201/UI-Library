import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RegistryEntry, ScanResult } from '@component-style-studio/registry'
import { deriveControls, initialArgs, type ControlSpec, type StyleOverride } from '../lib/controls'
import { type AnimConfig, type Instance, newInstanceId } from '../lib/canvas'
import {
  exportSource,
  fetchPresets,
  type CodeSyncPayload,
  type ExportConflict,
  type ExportInstancePayload,
  type ExportSkip,
  type PresetLibrary,
} from '../lib/api'
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
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [exportReport, setExportReport] = useState<{
    files: number
    conflicts: ExportConflict[]
    skipped: ExportSkip[]
    error?: string
  } | null>(null)
  const canvasRef = useRef<CanvasHandle>(null)

  useEffect(() => {
    let alive = true
    fetchPresets().then((p) => alive && setPresets(p))
    return () => {
      alive = false
    }
  }, [])

  // Canvas keyboard shortcuts (ignored while typing in a field): Escape
  // deselects, Delete/Backspace removes the selection, arrows nudge it
  // (Shift = 10px). Uses the stable state setters so it depends only on which
  // instance is selected.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      // Leave browser/OS shortcuts (Cmd/Ctrl/Alt combos) alone.
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'Escape') {
        setSelectedId(null)
        return
      }
      if (!selectedId) return
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        setInstances((prev) => prev.filter((i) => i.id !== selectedId))
        setSelectedId(null)
        return
      }
      const step = e.shiftKey ? 10 : 1
      const delta: Record<string, [number, number]> = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      }
      const d = delta[e.key]
      if (d) {
        e.preventDefault()
        setInstances((prev) =>
          prev.map((i) =>
            i.id === selectedId ? { ...i, x: Math.max(0, i.x + d[0]), y: Math.max(0, i.y + d[1]) } : i,
          ),
        )
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId])

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

  // An instance's edit state as a code-sync request (Phase 7). Canvas x/y stay
  // composition-level and are not written into the component's source; text is
  // sent only when it differs from the component's default.
  const payloadFor = useCallback(
    (inst: Instance): CodeSyncPayload | null => {
      const entry = entryById(inst.entryId)
      if (!entry) return null
      const root = rootFor(entry)
      if (!root) return null
      const { text: styleText, ...style } = inst.style
      const ctrls = deriveControls(entry)
      const textName = primaryTextName(entry)
      const textControl = ctrls.find((c) => c.name === textName)
      const argText =
        textName != null && textControl && inst.args[textName] !== textControl.defaultValue
          ? String(inst.args[textName] ?? '')
          : undefined
      const text = styleText ?? argText
      return {
        root,
        filePath: entry.filePath,
        exportName: entry.exportName,
        ...(text != null ? { text } : {}),
        style,
        position: {
          ...(inst.scaleX != null ? { scaleX: inst.scaleX } : {}),
          ...(inst.scaleY != null ? { scaleY: inst.scaleY } : {}),
          ...(inst.rotation != null ? { rotation: inst.rotation } : {}),
        },
        ...(inst.anim ? { anim: inst.anim } : {}),
      }
    },
    [entryById, rootFor],
  )

  const codePayload = useMemo<CodeSyncPayload | null>(
    () => (selected ? payloadFor(selected) : null),
    [selected, payloadFor],
  )

  const downloadBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  }

  // Export the composition as a self-contained static HTML demo (front-end only).
  const handleExportDemo = async () => {
    setExportMenuOpen(false)
    const html = await canvasRef.current?.exportComposition()
    if (!html) return
    downloadBlob(new Blob([html], { type: 'text/html' }), 'style-studio-export.html')
  }

  // Export the edited component *source files* as a zip (Phase 8). Instances are
  // grouped by project root (a canvas can mix imported + preset components), and
  // each root's changed files download as their own zip.
  const handleExportSource = async () => {
    setExportMenuOpen(false)
    const byRoot = new Map<string, ExportInstancePayload[]>()
    for (const inst of instances) {
      const p = payloadFor(inst)
      if (!p) continue
      const { root, ...rest } = p
      const arr = byRoot.get(root)
      if (arr) arr.push(rest)
      else byRoot.set(root, [rest])
    }
    if (byRoot.size === 0) return
    try {
      let files = 0
      const conflicts: ExportConflict[] = []
      const skipped: ExportSkip[] = []
      for (const [root, insts] of byRoot) {
        const res = await exportSource({ root, instances: insts })
        files += res.files.length
        conflicts.push(...res.conflicts)
        skipped.push(...res.skipped)
        if (res.zipBase64) {
          const base = root.replace(/\/+$/, '').split('/').pop() || 'project'
          const name = byRoot.size > 1 ? `style-studio-source-${base}.zip` : 'style-studio-source.zip'
          const bin = atob(res.zipBase64)
          const bytes = new Uint8Array(bin.length)
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
          downloadBlob(new Blob([bytes], { type: 'application/zip' }), name)
        }
      }
      setExportReport({ files, conflicts, skipped })
    } catch (err) {
      setExportReport({
        files: 0,
        conflicts: [],
        skipped: [],
        error: err instanceof Error ? err.message : String(err),
      })
    }
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
          <div className="w-4 h-4 rounded-sm bg-primary flex items-center justify-center">
            <span className="font-mono text-[9px] font-bold text-primary-foreground leading-none">S</span>
          </div>
          <span className="text-sm font-semibold tracking-[-0.02em]">Style Studio</span>
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
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setExportMenuOpen((o) => !o)}
            disabled={instances.length === 0}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-default transition-colors"
          >
            Export ▾
          </button>
          {exportMenuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setExportMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-40 w-56 rounded-lg border border-border bg-popover shadow-xl p-1">
                <button
                  type="button"
                  onClick={handleExportDemo}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-secondary transition-colors"
                >
                  <div className="text-xs font-medium">Demo (HTML)</div>
                  <div className="text-[10px] text-muted-foreground">Self-contained front-end snapshot</div>
                </button>
                <button
                  type="button"
                  onClick={handleExportSource}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-secondary transition-colors"
                >
                  <div className="text-xs font-medium">Source files (.zip)</div>
                  <div className="text-[10px] text-muted-foreground">Edited component source, ready to diff</div>
                </button>
              </div>
            </>
          )}
        </div>
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

      {exportReport && (
        <div className="fixed bottom-4 right-4 z-50 w-80 rounded-lg border border-border bg-popover shadow-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold">Source export</span>
            <button
              type="button"
              onClick={() => setExportReport(null)}
              className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              ✕
            </button>
          </div>
          {exportReport.error ? (
            <p className="text-[11px] text-red-400">{exportReport.error}</p>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              {exportReport.files > 0
                ? `${exportReport.files} file${exportReport.files === 1 ? '' : 's'} exported.`
                : 'No edits to export yet — style a component first.'}
            </p>
          )}
          {exportReport.conflicts.length > 0 && (
            <div className="mt-1.5 border-t border-border pt-1.5">
              <p className="text-[10px] font-medium text-amber-500 mb-0.5">
                {exportReport.conflicts.length} conflict
                {exportReport.conflicts.length === 1 ? '' : 's'} (last edit kept)
              </p>
              {exportReport.conflicts.map((c, i) => (
                <p key={i} className="text-[10px] text-muted-foreground truncate" title={c.reason}>
                  {c.exportName} — {c.filePath}
                </p>
              ))}
            </div>
          )}
          {exportReport.skipped.length > 0 && (
            <div className="mt-1.5 border-t border-border pt-1.5">
              <p className="text-[10px] font-medium text-amber-500 mb-0.5">
                {exportReport.skipped.length} skipped
              </p>
              {exportReport.skipped.map((s, i) => (
                <p key={i} className="text-[10px] text-muted-foreground truncate" title={s.reason}>
                  {s.step}: {s.reason}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
