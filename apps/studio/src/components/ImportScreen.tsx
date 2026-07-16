import { useEffect, useState } from 'react'
import type { ScanResult } from '@component-style-studio/registry'
import {
  getRecentPaths,
  listFolder,
  rememberPath,
  scanFolder,
  type FolderListing,
} from '../lib/api'

/** Scan errors arrive as server strings; translate the common ones. */
function humanScanError(message: string): string {
  if (/Not a folder/i.test(message))
    return "That path isn't a folder anymore — it may have been moved or renamed."
  if (/ENOENT|no such file/i.test(message)) return 'That folder no longer exists.'
  if (/EACCES|permission/i.test(message)) return "The studio doesn't have permission to read that folder."
  return message
}

export function ImportScreen({
  onScanned,
  onUsePresets,
  onBack,
}: {
  onScanned: (result: ScanResult) => void
  onUsePresets: () => void
  onBack?: () => void
}) {
  const [busy, setBusy] = useState<string | null>(null) // path being scanned
  const [error, setError] = useState<string | null>(null)
  const [recents] = useState(getRecentPaths)
  // Folder browser state: current listing + a path field that doubles as
  // breadcrumb (editable for people who'd rather paste a path).
  const [listing, setListing] = useState<FolderListing | null>(null)
  const [pathField, setPathField] = useState('')
  const [browseError, setBrowseError] = useState<string | null>(null)

  const browse = async (path?: string) => {
    setBrowseError(null)
    try {
      const l = await listFolder(path)
      setListing(l)
      setPathField(l.path)
    } catch (err) {
      setBrowseError(humanScanError(err instanceof Error ? err.message : String(err)))
    }
  }

  useEffect(() => {
    // Open where the user last imported from, otherwise at home.
    void browse(getRecentPaths()[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scan = async (target: string) => {
    if (!target.trim() || busy) return
    setBusy(target)
    setError(null)
    try {
      const result = await scanFolder(target)
      if (result.entries.length === 0) {
        setError(
          `Scanned ${result.stats.filesScanned} files in that folder but found no React components. ` +
            'Pick the folder that holds your .tsx/.jsx source (often the project root or src/).',
        )
        setBusy(null)
        return
      }
      rememberPath(result.root)
      onScanned(result)
    } catch (err) {
      setError(humanScanError(err instanceof Error ? err.message : String(err)))
      setBusy(null)
    }
  }

  return (
    <div className="min-h-svh flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Compact header: the start screen already made the pitch. */}
        <div className="flex items-center gap-2.5 mb-6">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mr-1 px-2 py-1 rounded-md text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              ← Back
            </button>
          )}
          <div className="w-6 h-6 rounded-sm bg-primary flex items-center justify-center">
            <span className="font-mono text-[13px] font-bold text-primary-foreground leading-none">S</span>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight leading-none">Open your project</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              The folder is scanned in place. Nothing is copied or changed until you export.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Breadcrumb / path field */}
          <form
            className="flex gap-2 p-3 border-b border-border"
            onSubmit={(e) => {
              e.preventDefault()
              void browse(pathField)
            }}
          >
            <input
              value={pathField}
              onChange={(e) => setPathField(e.target.value)}
              spellCheck={false}
              aria-label="Current folder"
              className="flex-1 rounded-md px-3 py-1.5 text-xs font-mono bg-input border border-border focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-secondary hover:bg-secondary/70 transition-colors"
            >
              Go
            </button>
            <button
              type="button"
              disabled={!listing || busy !== null}
              onClick={() => listing && void scan(listing.path)}
              className="px-4 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98] disabled:opacity-40 transition-all"
            >
              {busy === listing?.path ? 'Scanning…' : 'Use this folder'}
            </button>
          </form>

          {/* Folder browser */}
          <div className="max-h-64 overflow-y-auto">
            {browseError ? (
              <p className="text-xs text-destructive px-3 py-3">{browseError}</p>
            ) : !listing ? (
              <p className="text-xs text-muted-foreground px-3 py-3 animate-pulse">Reading…</p>
            ) : (
              <ul className="divide-y divide-border/40">
                {listing.parent && (
                  <li>
                    <button
                      type="button"
                      onClick={() => void browse(listing.parent!)}
                      className="w-full text-left px-3 py-1.5 text-xs font-mono text-muted-foreground hover:bg-secondary/60 transition-colors"
                    >
                      ..
                    </button>
                  </li>
                )}
                {listing.dirs.map((d) => (
                  <li key={d.path} className="flex items-center hover:bg-secondary/60 transition-colors">
                    <button
                      type="button"
                      onClick={() => void browse(d.path)}
                      className="flex-1 min-w-0 text-left px-3 py-1.5 text-xs font-mono truncate"
                      title={d.path}
                    >
                      <span className="text-muted-foreground mr-1.5">▸</span>
                      {d.name}
                      {d.looksLikeProject && (
                        <span className="ml-2 text-[9px] font-sans font-semibold uppercase tracking-wider text-primary/70">
                          project
                        </span>
                      )}
                    </button>
                    {d.looksLikeProject && (
                      <button
                        type="button"
                        disabled={busy !== null}
                        onClick={() => void scan(d.path)}
                        className="shrink-0 mr-2 px-2 py-0.5 rounded text-[10px] font-medium bg-secondary hover:bg-secondary/70 disabled:opacity-40 transition-colors"
                      >
                        {busy === d.path ? 'Scanning…' : 'Open'}
                      </button>
                    )}
                  </li>
                ))}
                {listing.dirs.length === 0 && (
                  <li className="px-3 py-2 text-xs text-muted-foreground">No subfolders here.</li>
                )}
              </ul>
            )}
          </div>

          {error && (
            <p className="text-xs text-destructive border-t border-border bg-destructive/10 px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {recents.length > 0 && (
          <div className="mt-5 px-1">
            <p className="font-mono text-[10px] font-medium text-muted-foreground uppercase tracking-[0.18em] mb-1.5">
              Recent projects
            </p>
            <ul className="divide-y divide-border/60">
              {recents.map((recent) => (
                <li key={recent}>
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => void scan(recent)}
                    className="w-full text-left text-xs font-mono text-muted-foreground hover:text-accent-foreground py-1.5 truncate transition-colors disabled:opacity-50"
                  >
                    {busy === recent ? 'Scanning… ' : ''}
                    {recent}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={onUsePresets}
          className="mt-5 w-full px-4 py-2 rounded-md text-xs font-medium bg-secondary text-foreground hover:bg-secondary/70 active:scale-[0.99] transition-all"
        >
          No project handy? Start with the preset library
        </button>
      </div>
    </div>
  )
}
