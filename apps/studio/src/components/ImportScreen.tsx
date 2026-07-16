import { useState } from 'react'
import type { ScanResult } from '@component-style-studio/registry'
import { getRecentPaths, rememberPath, scanFolder } from '../lib/api'

export function ImportScreen({
  onScanned,
  onUsePresets,
  onBack,
}: {
  onScanned: (result: ScanResult) => void
  onUsePresets: () => void
  onBack?: () => void
}) {
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
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-6 h-6 rounded-sm bg-primary flex items-center justify-center">
            <span className="font-mono text-[13px] font-bold text-primary-foreground leading-none">S</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Component Style Studio
          </span>
        </div>

        <h1 className="text-4xl font-semibold tracking-[-0.03em] leading-[1.08] mb-3">
          Style any React component,
          <br />
          <span className="italic font-normal">visually.</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
          Point at a folder and its components populate the library. Compose them on a
          canvas, edit style and animation, then export the changed source. The folder is
          scanned in place, nothing is copied.
        </p>

        <div className="rounded-lg border border-border bg-card p-5">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void scan(path)
            }}
          >
            <label className="block font-mono text-[10px] font-medium text-muted-foreground uppercase tracking-[0.18em] mb-2">
              Folder path
            </label>
            <div className="flex gap-2">
              <input
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="/path/to/your/react-project"
                spellCheck={false}
                className="flex-1 rounded-md px-3 py-2 text-xs font-mono bg-input border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
              />
              <button
                type="submit"
                disabled={busy || !path.trim()}
                className="px-4 py-2 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:cursor-default disabled:hover:brightness-100 transition-all"
              >
                {busy ? 'Scanning…' : 'Scan'}
              </button>
            </div>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <button
            type="button"
            onClick={onUsePresets}
            className="w-full px-4 py-2 rounded-md text-xs font-medium bg-secondary text-foreground hover:bg-secondary/70 active:scale-[0.99] transition-all"
          >
            Start with the preset library — no folder needed
          </button>

          {error && (
            <p className="mt-3 text-xs text-destructive rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {recents.length > 0 && (
          <div className="mt-5 px-1">
            <p className="font-mono text-[10px] font-medium text-muted-foreground uppercase tracking-[0.18em] mb-1.5">
              Recent
            </p>
            <ul className="divide-y divide-border/60">
              {recents.map((recent) => (
                <li key={recent}>
                  <button
                    type="button"
                    onClick={() => {
                      setPath(recent)
                      void scan(recent)
                    }}
                    className="w-full text-left text-xs font-mono text-muted-foreground hover:text-accent-foreground py-1.5 truncate transition-colors"
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
