/**
 * Unified registry schema for the Component Style Studio (implementation plan §4.1).
 *
 * Both curated preset components (added in later phases) and user-imported
 * components (Phase 1 import pipeline) normalize into `RegistryEntry`.
 */

export type RegistrySource = 'imported' | 'preset'

export interface PropSpec {
  name: string
  /** Printed type, e.g. `string`, `"solid" | "outline"`, `number` */
  type: string
  required: boolean
  /** Printed default value, when the component declares one */
  defaultValue?: string
  description?: string
}

/**
 * Unresolvable-runtime-dependency flags (plan §5.1): components that reach for
 * context or non-React hooks can't be executed against real data in the Studio
 * and get mocked with placeholder values instead.
 */
export interface RuntimeFlags {
  /** Component body calls React's `useContext(...)` */
  usesContext: boolean
  /** Hook names imported from modules other than `react` (data hooks, custom hooks) */
  externalHooks: string[]
  /** True when any of the above apply — preview must mock, not execute */
  needsMocking: boolean
}

export interface RegistryEntry {
  /** Stable id: `<relative file path>#<export name>` */
  id: string
  /** Display name of the component (docgen displayName) */
  name: string
  source: RegistrySource
  /** File path relative to the scanned root, posix separators */
  filePath: string
  exportName: string
  /** Category derived from the parent folder (e.g. `buttons`), when meaningful */
  category?: string
  description?: string
  props: PropSpec[]
  flags: RuntimeFlags
}

export interface ScanStats {
  filesScanned: number
  componentsFound: number
  flaggedComponents: number
  durationMs: number
}

/** Result of scanning one external folder (the Studio never copies the folder). */
export interface ScanResult {
  /** Absolute path of the scanned root */
  root: string
  scannedAt: string
  stats: ScanStats
  entries: RegistryEntry[]
}
