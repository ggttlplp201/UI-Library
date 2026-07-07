import type { ScanResult } from '@component-style-studio/registry'

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
  const next = [path, ...getRecentPaths().filter((p) => p !== path)].slice(0, RECENTS_MAX)
  localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
}
