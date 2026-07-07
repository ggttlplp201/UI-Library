import { useState } from 'react'
import type { ScanResult } from '@component-style-studio/registry'
import { ImportScreen } from './components/ImportScreen'
import { Workspace } from './components/Workspace'

export default function App() {
  const [result, setResult] = useState<ScanResult | null>(null)

  if (!result) {
    return <ImportScreen onScanned={setResult} />
  }
  return <Workspace result={result} onReset={() => setResult(null)} />
}
