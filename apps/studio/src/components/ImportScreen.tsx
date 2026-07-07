import { useState } from 'react'
import type { ScanResult } from '@component-style-studio/registry'
import { getRecentPaths, rememberPath, scanFolder } from '../lib/api'

export function ImportScreen({ onScanned }: { onScanned: (result: ScanResult) => void }) {
  const [path, setPath] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recents] = useState(getRecentPaths)

  const scan = async (target: string) => {
    if (!target.trim() || busy) return
    setBusy(true)
    setError(null)
    try {
      const result = await scanFolder(target)
      rememberPath(result.root)
      onScanned(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setBusy(false)
    }
  }

  return (
    <div className="min-h-svh flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-7">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded bg-primary" />
          <h1 className="text-sm font-semibold tracking-tight">Component Style Studio</h1>
        </div>
        <p className="text-xs text-muted-foreground mb-6">
          Import a React codebase: point at a folder and its components populate the library.
          The folder is scanned in place — nothing is copied.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            void scan(path)
          }}
        >
          <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
            Folder path
          </label>
          <div className="flex gap-2">
            <input
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="/path/to/your/react-project"
              spellCheck={false}
              className="flex-1 rounded-md px-3 py-2 text-xs font-mono bg-input border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={busy || !path.trim()}
              className="px-4 py-2 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-default transition-colors"
            >
              {busy ? 'Scanning…' : 'Scan'}
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-3 text-xs text-destructive rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
            {error}
          </p>
        )}

        {recents.length > 0 && (
          <div className="mt-6">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
              Recent
            </p>
            <ul>
              {recents.map((recent) => (
                <li key={recent}>
                  <button
                    type="button"
                    onClick={() => {
                      setPath(recent)
                      void scan(recent)
                    }}
                    className="w-full text-left text-xs font-mono text-muted-foreground hover:text-foreground py-1 truncate transition-colors"
                  >
                    {recent}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
