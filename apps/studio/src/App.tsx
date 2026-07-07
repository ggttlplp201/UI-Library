import { useState } from 'react'
import type { ScanResult } from '@component-style-studio/registry'
import { ImportScreen } from './components/ImportScreen'
import { Workspace } from './components/Workspace'

// Presets-only session: no imported folder, just the bundled preset library.
const PRESETS_ONLY: ScanResult = {
  root: '',
  scannedAt: new Date(0).toISOString(),
  stats: { filesScanned: 0, componentsFound: 0, flaggedComponents: 0, durationMs: 0 },
  entries: [],
}

export default function App() {
  const [result, setResult] = useState<ScanResult | null>(null)

  if (!result) {
    return <ImportScreen onScanned={setResult} onUsePresets={() => setResult(PRESETS_ONLY)} />
  }
  return <Workspace result={result} onReset={() => setResult(null)} />
}
