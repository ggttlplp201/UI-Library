import { useEffect, useMemo, useState } from 'react'
import type { ScanResult } from '@component-style-studio/registry'
import {
  composeRenderProps,
  deriveControls,
  initialArgs,
  type StyleOverride,
} from '../lib/controls'
import { fetchPresets, type PresetLibrary } from '../lib/api'
import { LibraryPanel } from './LibraryPanel'
import { EditPanel } from './EditPanel'
import { PreviewFrame } from './PreviewFrame'

// Stable fallbacks so memoization isn't defeated by fresh `{}` each render.
const EMPTY_ARGS: Record<string, unknown> = {}
const EMPTY_STYLE: StyleOverride = {}
const NO_PRESETS: PresetLibrary = { root: '', entries: [] }

export function Workspace({ result, onReset }: { result: ScanResult; onReset: () => void }) {
  const [presets, setPresets] = useState<PresetLibrary>(NO_PRESETS)
  const [selectedId, setSelectedId] = useState<string | null>(result.entries[0]?.id ?? null)
  const [argsById, setArgsById] = useState<Record<string, Record<string, unknown>>>({})
  const [styleById, setStyleById] = useState<Record<string, StyleOverride>>({})

  useEffect(() => {
    let alive = true
    fetchPresets().then((p) => alive && setPresets(p))
    return () => {
      alive = false
    }
  }, [])

  // Imported components first, then the curated presets.
  const entries = useMemo(
    () => [...result.entries, ...presets.entries],
    [result.entries, presets.entries],
  )
  const entry = entries.find((e) => e.id === selectedId) ?? null
  const previewRoot = entry?.source === 'preset' ? presets.root : result.root
  const controls = useMemo(() => (entry ? deriveControls(entry) : []), [entry])

  // Seed args from control defaults the first time a component is opened.
  useEffect(() => {
    if (!entry) return
    setArgsById((prev) => (prev[entry.id] ? prev : { ...prev, [entry.id]: initialArgs(controls) }))
  }, [entry, controls])

  const args = (entry && argsById[entry.id]) ?? EMPTY_ARGS
  const style = (entry && styleById[entry.id]) ?? EMPTY_STYLE
  const renderProps = useMemo(() => composeRenderProps(args, style), [args, style])

  const setArg = (name: string, value: unknown) => {
    if (!entry) return
    setArgsById((prev) => ({ ...prev, [entry.id]: { ...prev[entry.id], [name]: value } }))
  }
  const setStyle = (next: StyleOverride) => {
    if (!entry) return
    setStyleById((prev) => ({ ...prev, [entry.id]: next }))
  }

  const { stats } = result

  return (
    <div className="h-svh flex flex-col">
      <header className="h-11 shrink-0 border-b border-border bg-card flex items-center gap-3 px-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span className="text-sm font-semibold tracking-tight">Style Studio</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <span
          className="text-[11px] font-mono text-muted-foreground truncate max-w-96"
          title={result.root}
        >
          {result.root}
        </span>
        <span className="text-[11px] text-muted-foreground ml-auto shrink-0">
          {stats.componentsFound} imported · {presets.entries.length} presets
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
        <LibraryPanel entries={entries} selectedId={selectedId} onSelect={setSelectedId} />

        <main className="flex-1 min-w-0 flex items-center justify-center p-8 bg-background overflow-auto">
          {entry ? (
            <div className="flex flex-col items-center gap-3">
              <PreviewFrame
                key={entry.id}
                root={previewRoot}
                filePath={entry.filePath}
                exportName={entry.exportName}
                renderProps={renderProps}
                className="min-w-[120px] min-h-[80px] rounded-lg border border-border bg-white"
              />
              <span className="text-[11px] text-muted-foreground">
                live preview · edits apply instantly
              </span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Select a component.</p>
          )}
        </main>

        {entry && (
          <EditPanel
            entry={entry}
            controls={controls}
            args={args}
            onArgChange={setArg}
            style={style}
            onStyleChange={setStyle}
          />
        )}
      </div>
    </div>
  )
}
