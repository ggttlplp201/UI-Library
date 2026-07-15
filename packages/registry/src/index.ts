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

/** SPDX license id or a short descriptor. */
export type LicenseId = 'MIT' | 'MIT + Commons Clause' | 'Apache-2.0' | 'CC0-1.0' | 'ISC' | string

/**
 * Provenance + license + visual-coherence metadata for a preset component,
 * loaded from its `<Name>.meta.json` sidecar (component-sourcing.md §0.2).
 * The sidecar is JSON on purpose: it is parsed, never executed, and it stays
 * out of the component source so it can't leak into serialized exports.
 */
export interface PresetMeta {
  // provenance & license
  library: string
  source: string
  author: string
  license: LicenseId
  /** true → the exporter MUST inject a visible credit for this component */
  attributionRequired: boolean
  ingest: 'registry' | 'manual-port' | 'rebuilt'
  /** Registry ref / URL the component was fetched from (staleness checks) */
  fetchedFrom?: string
  /** Secondary categories beyond the folder-derived one */
  tags?: string[]
  // visual-coherence gate (product quality, not license)
  /** Design language, e.g. 'kinetic' | 'chrome-console' | 'magic-ui' */
  styleFamily?: string
  qualityTier?: 'authored' | 'vetted' | 'raw'
  previewStatus?: 'ok' | 'needs-mock' | 'broken'
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
  /** Present only for `source: 'preset'` entries that have a `.meta.json` sidecar. */
  meta?: PresetMeta
}

export interface ScanStats {
  filesScanned: number
  componentsFound: number
  flaggedComponents: number
  durationMs: number
}

/** A file the scanner had to skip (parse/docgen failure) without aborting the scan. */
export interface ScanError {
  filePath: string
  message: string
}

/** Result of scanning one external folder (the Studio never copies the folder). */
export interface ScanResult {
  /** Absolute path of the scanned root */
  root: string
  scannedAt: string
  stats: ScanStats
  entries: RegistryEntry[]
  /** Present only when some files failed to parse; the rest of the scan still succeeds */
  errors?: ScanError[]
}
