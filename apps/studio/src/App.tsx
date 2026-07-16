import { useState } from 'react'
import type { ScanResult } from '@component-style-studio/registry'
import { ImportScreen } from './components/ImportScreen'
import { StartScreen } from './components/StartScreen'
import { Workspace } from './components/Workspace'
import type { SampleProject } from './lib/samples'

// Presets-only session: no imported folder, just the bundled preset library.
const PRESETS_ONLY: ScanResult = {
  root: '',
  scannedAt: new Date(0).toISOString(),
  stats: { filesScanned: 0, componentsFound: 0, flaggedComponents: 0, durationMs: 0 },
  entries: [],
}

export default function App() {
  const [result, setResult] = useState<ScanResult | null>(null)
  const [sample, setSample] = useState<SampleProject | null>(null)
  const [importing, setImporting] = useState(false)

  const reset = () => {
    setResult(null)
    setSample(null)
    setImporting(false)
  }

  if (!result) {
    // Start screen first: open a sample, or head to the import flow.
    if (!importing) {
      return (
        <StartScreen
          onOpenSample={(s) => {
            setSample(s)
            setResult(PRESETS_ONLY)
          }}
          onStartBuilding={() => setImporting(true)}
        />
      )
    }
    return <ImportScreen onScanned={setResult} onUsePresets={() => setResult(PRESETS_ONLY)} />
  }
  return <Workspace result={result} sample={sample ?? undefined} onReset={reset} />
}
