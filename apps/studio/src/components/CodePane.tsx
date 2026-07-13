import { useEffect, useRef, useState } from 'react'
import { fetchGeneratedCode, type CodeSyncPayload, type GeneratedCode } from '../lib/api'

/**
 * Live "generated code" pane (plan §5.6): shows the selected instance's
 * component source with its canvas edits written back by the AST sync
 * engine, refreshed (debounced) on every edit.
 */
export function CodePane({
  payload,
  title,
  onClose,
}: {
  /** Null when nothing is selected */
  payload: CodeSyncPayload | null
  title: string | null
  onClose: () => void
}) {
  const [result, setResult] = useState<GeneratedCode | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [copied, setCopied] = useState(false)
  const lastSent = useRef('')

  useEffect(() => {
    if (!payload) {
      setResult(null)
      setError(null)
      lastSent.current = ''
      return
    }
    const key = JSON.stringify(payload)
    if (key === lastSent.current) {
      // An edit was reverted before its debounce fired — the shown result is
      // already current, but a scheduled fetch may have left syncing on.
      setSyncing(false)
      return
    }
    setSyncing(true)
    const timer = setTimeout(() => {
      lastSent.current = key
      fetchGeneratedCode(payload)
        .then((res) => {
          // A newer edit may already be in flight — drop stale responses.
          if (lastSent.current !== key) return
          setResult(res)
          setError(null)
        })
        .catch((err: unknown) => {
          if (lastSent.current !== key) return
          setError(err instanceof Error ? err.message : String(err))
        })
        .finally(() => {
          if (lastSent.current === key) setSyncing(false)
        })
    }, 250)
    return () => clearTimeout(timer)
  }, [payload])

  const copy = () => {
    if (!result) return
    void navigator.clipboard.writeText(result.code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    })
  }

  return (
    <div className="h-64 shrink-0 border-t border-border bg-card flex flex-col">
      <div className="h-8 shrink-0 px-3 flex items-center gap-2 border-b border-border">
        <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
          Code
        </span>
        {title && <span className="text-[10px] font-mono text-muted-foreground truncate">{title}</span>}
        {syncing && <span className="text-[10px] text-muted-foreground animate-pulse">syncing…</span>}
        {result && !result.changed && !syncing && (
          <span className="text-[10px] text-muted-foreground">original source — no edits yet</span>
        )}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={copy}
            disabled={!result}
            className="px-2 py-0.5 rounded text-[10px] font-medium bg-secondary hover:bg-secondary/70 disabled:opacity-40 transition-colors"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close code pane"
            className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {result && result.skipped.length > 0 && (
        <div className="px-3 py-1 border-b border-border shrink-0">
          {result.skipped.map((s) => (
            <p key={s.step} className="text-[10px] text-amber-500">
              {s.step}: {s.reason}
            </p>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {!payload ? (
          <p className="text-[11px] text-muted-foreground p-3">
            Select a component on the canvas to see its generated source.
          </p>
        ) : error ? (
          <p className="text-[11px] text-red-400 p-3">{error}</p>
        ) : !result ? (
          <p className="text-[11px] text-muted-foreground p-3 animate-pulse">Generating…</p>
        ) : (
          <pre className="text-[11px] font-mono leading-relaxed p-3 whitespace-pre">{result.code}</pre>
        )}
      </div>
    </div>
  )
}
