import type { RegistryEntry, ScanResult } from '@component-style-studio/registry'

/** The bundled preset library, scanned server-side and tagged source: 'preset'. */
export interface PresetLibrary {
  root: string
  entries: RegistryEntry[]
}

export async function fetchPresets(): Promise<PresetLibrary> {
  try {
    const res = await fetch('/api/presets', { method: 'GET' })
    const data: { ok: boolean; root?: string; entries?: RegistryEntry[] } = await res.json()
    if (!data.ok || !data.root) return { root: '', entries: [] }
    return { root: data.root, entries: data.entries ?? [] }
  } catch {
    return { root: '', entries: [] }
  }
}

/** One folder in the import screen's browser. */
export interface FolderEntry {
  name: string
  path: string
  /** Has a package.json — probably what the user is looking for */
  looksLikeProject: boolean
}

export interface FolderListing {
  path: string
  parent: string | null
  home: string
  dirs: FolderEntry[]
}

/** Browse the local filesystem (dev-server side) for the import screen. */
export async function listFolder(path?: string): Promise<FolderListing> {
  const res = await fetch('/api/fs', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(path ? { path } : {}),
  })
  let payload: (FolderListing & { ok: boolean; error?: string }) | null = null
  try {
    payload = await res.json()
  } catch {
    throw new Error(`Could not read that folder (${res.status})`)
  }
  if (!payload?.ok) throw new Error(payload?.error ?? `Could not read that folder (${res.status})`)
  return payload
}

export async function scanFolder(path: string): Promise<ScanResult> {
  const res = await fetch('/api/scan', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ path }),
  })
  let payload: { ok: boolean; result?: ScanResult; error?: string }
  try {
    payload = await res.json()
  } catch {
    throw new Error(`Scan failed (${res.status})`)
  }
  if (!payload.ok || !payload.result) {
    throw new Error(payload.error ?? `Scan failed (${res.status})`)
  }
  return payload.result
}

/**
 * Request/response of POST /api/code (the AST sync engine endpoint, Phase 7).
 * Shapes mirror `CodeSyncRequest` / `SyncOutcome` in
 * packages/ast-sync — kept local so browser code doesn't import the engine.
 */
export interface CodeSyncPayload {
  root: string
  filePath: string
  exportName: string
  text?: string
  style?: {
    color?: string
    backgroundColor?: string
    fontFamily?: string
    fontWeight?: string
    fontSize?: number
  }
  position?: { scaleX?: number; scaleY?: number; rotation?: number }
  anim?: { preset: string; duration: number; delay: number; easing: string }
}

export interface GeneratedCode {
  code: string
  changed: boolean
  skipped: { step: string; reason: string }[]
}

export async function fetchGeneratedCode(payload: CodeSyncPayload): Promise<GeneratedCode> {
  const res = await fetch('/api/code', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })
  let data: (GeneratedCode & { ok: boolean; error?: string }) | null = null
  try {
    data = await res.json()
  } catch {
    throw new Error(`Code sync failed (${res.status})`)
  }
  if (!data?.ok) throw new Error(data?.error ?? `Code sync failed (${res.status})`)
  return { code: data.code, changed: data.changed, skipped: data.skipped ?? [] }
}

/** One edited instance in an export request — a CodeSyncPayload without `root`. */
export type ExportInstancePayload = Omit<CodeSyncPayload, 'root'>

export interface ExportConflict {
  filePath: string
  exportName: string
  reason: string
}
export interface ExportSkip {
  filePath: string
  step: string
  reason: string
}
export interface ExportSourceResult {
  /** Changed file paths (relative to root) included in the zip */
  files: string[]
  conflicts: ExportConflict[]
  skipped: ExportSkip[]
  /** base64 store-only zip of the changed files; absent when nothing changed */
  zipBase64?: string
}

/**
 * POST /api/export: send every edited instance for one project root; the server
 * applies the edits to each component's source and returns the changed files as
 * a zip (base64) plus a conflict/skip report (Phase 8).
 */
export async function exportSource(payload: {
  credits?: string
  root: string
  instances: ExportInstancePayload[]
}): Promise<ExportSourceResult> {
  const res = await fetch('/api/export', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })
  let data: (ExportSourceResult & { ok: boolean; error?: string }) | null = null
  try {
    data = await res.json()
  } catch {
    throw new Error(`Export failed (${res.status})`)
  }
  if (!data?.ok) throw new Error(data?.error ?? `Export failed (${res.status})`)
  return {
    files: data.files ?? [],
    conflicts: data.conflicts ?? [],
    skipped: data.skipped ?? [],
    ...(data.zipBase64 ? { zipBase64: data.zipBase64 } : {}),
  }
}

const RECENTS_KEY = 'css.recentPaths'
const RECENTS_MAX = 5

export function getRecentPaths(): string[] {
  try {
    const raw = localStorage.getItem(RECENTS_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((p): p is string => typeof p === 'string') : []
  } catch {
    return []
  }
}

export function rememberPath(path: string): void {
  try {
    const next = [path, ...getRecentPaths().filter((p) => p !== path)].slice(0, RECENTS_MAX)
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
  } catch {
    // Best-effort: blocked storage must not fail a successful scan.
  }
}
