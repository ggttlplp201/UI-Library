import { useState } from 'react'
import type { ScanResult } from '@component-style-studio/registry'
import { ImportScreen } from './components/ImportScreen'
import { LibraryPanel } from './components/LibraryPanel'
import { ComponentDetail } from './components/ComponentDetail'

export default function App() {
  const [result, setResult] = useState<ScanResult | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (!result) {
    return (
      <ImportScreen
        onScanned={(scanned) => {
          setResult(scanned)
          setSelectedId(scanned.entries[0]?.id ?? null)
        }}
      />
    )
  }

  const selected = result.entries.find((e) => e.id === selectedId) ?? null
  const { stats } = result

  return (
    <div className="h-svh flex flex-col">
      <header className="h-11 shrink-0 border-b border-border bg-card flex items-center gap-3 px-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span className="text-sm font-semibold tracking-tight">Style Studio</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <span className="text-[11px] font-mono text-muted-foreground truncate max-w-96" title={result.root}>
          {result.root}
        </span>
        <span className="text-[11px] text-muted-foreground ml-auto shrink-0">
          {stats.componentsFound} components · {stats.filesScanned} files ·{' '}
          {stats.flaggedComponents} flagged · {stats.durationMs}ms
          {result.errors && (
            <span
              className="text-destructive"
              title={result.errors.map((e) => `${e.filePath}: ${e.message}`).join('\n')}
            >
              {' '}
              · {result.errors.length} file{result.errors.length !== 1 && 's'} failed
            </span>
          )}
        </span>
        <button
          type="button"
          onClick={() => {
            setResult(null)
            setSelectedId(null)
          }}
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary hover:bg-secondary/70 transition-colors"
        >
          New import
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden min-h-0">
        <LibraryPanel entries={result.entries} selectedId={selectedId} onSelect={setSelectedId} />
        {selected ? (
          <ComponentDetail entry={selected} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-muted-foreground">Select a component from the library.</p>
          </div>
        )}
      </div>
    </div>
  )
}
