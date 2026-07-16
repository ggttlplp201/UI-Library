import { useEffect, useState } from 'react'
import type { ScanResult } from '@component-style-studio/registry'
import { ImportScreen } from './components/ImportScreen'
import { StartScreen } from './components/StartScreen'
import { Workspace } from './components/Workspace'
import { scanFolder } from './lib/api'
import { sampleById, type SampleProject } from './lib/samples'

// Presets-only session: no imported folder, just the bundled preset library.
const PRESETS_ONLY: ScanResult = {
  root: '',
  scannedAt: new Date(0).toISOString(),
  stats: { filesScanned: 0, componentsFound: 0, flaggedComponents: 0, durationMs: 0 },
  entries: [],
}

// Which workspace was open, so a reload (or crash) lands back in it silently
// instead of ejecting the user to the start screen.
const SESSION_KEY = 'css-studio:last-session'
type LastSession =
  | { kind: 'sample'; id: string }
  | { kind: 'presets' }
  | { kind: 'import'; root: string }

function readSession(): LastSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as LastSession) : null
  } catch {
    return null
  }
}

function writeSession(session: LastSession | null) {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    else localStorage.removeItem(SESSION_KEY)
  } catch {
    // best-effort
  }
}

export default function App() {
  const [result, setResult] = useState<ScanResult | null>(null)
  const [sample, setSample] = useState<SampleProject | null>(null)
  const [importing, setImporting] = useState(false)
  const [restoring, setRestoring] = useState(() => readSession() !== null)

  // Silent session restore: reopen whatever was open before the reload.
  // Imported folders re-scan in the background; samples/presets are instant.
  useEffect(() => {
    const session = readSession()
    if (!session) return
    let alive = true
    if (session.kind === 'sample') {
      const s = sampleById(session.id)
      if (s) {
        setSample(s)
        setResult(PRESETS_ONLY)
      } else {
        writeSession(null)
      }
      setRestoring(false)
      return
    }
    if (session.kind === 'presets') {
      setResult(PRESETS_ONLY)
      setRestoring(false)
      return
    }
    scanFolder(session.root)
      .then((r) => {
        if (alive) setResult(r)
      })
      .catch(() => {
        // Folder moved/renamed since last time — fall back to the start screen.
        if (alive) writeSession(null)
      })
      .finally(() => {
        if (alive) setRestoring(false)
      })
    return () => {
      alive = false
    }
    // Runs once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openSample = (s: SampleProject) => {
    setSample(s)
    setResult(PRESETS_ONLY)
    writeSession({ kind: 'sample', id: s.id })
  }
  const openScanned = (r: ScanResult) => {
    setSample(null)
    setResult(r)
    writeSession(r.root ? { kind: 'import', root: r.root } : { kind: 'presets' })
  }
  const openPresets = () => {
    setSample(null)
    setResult(PRESETS_ONLY)
    writeSession({ kind: 'presets' })
  }

  // "New import" from the workspace: remember what was open so backing out of
  // the import screen returns to the SAME workspace, not the start screen.
  const [leftBehind, setLeftBehind] = useState<{
    result: ScanResult
    sample: SampleProject | null
  } | null>(null)
  const startNewImport = () => {
    if (result) setLeftBehind({ result, sample })
    setResult(null)
    setSample(null)
    setImporting(true)
  }
  const backFromImport = () => {
    setImporting(false)
    if (leftBehind) {
      setResult(leftBehind.result)
      setSample(leftBehind.sample)
      setLeftBehind(null)
    }
  }

  if (restoring) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-xs font-mono text-muted-foreground animate-pulse">
          Reopening your workspace…
        </p>
      </div>
    )
  }

  if (!result) {
    // Start screen first: open a sample, or head to the import flow.
    if (!importing) {
      return <StartScreen onOpenSample={openSample} onStartBuilding={() => setImporting(true)} />
    }
    return <ImportScreen onScanned={openScanned} onUsePresets={openPresets} onBack={backFromImport} />
  }
  return <Workspace result={result} sample={sample ?? undefined} onReset={startNewImport} />
}
