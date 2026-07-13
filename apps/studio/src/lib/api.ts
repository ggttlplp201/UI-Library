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
