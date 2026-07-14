/**
 * Boots (or reuses) the child preview server for a root and returns its URL.
 *
 * Cached per root — but the mapping can go stale: when the studio dev server
 * restarts, child servers reboot lazily and may claim each other's ports
 * (strictPort is off), leaving a cached URL pointing at a different project.
 * The harness therefore reports which root it serves in its `ready` message;
 * PreviewFrame calls `invalidatePreviewUrl` on a mismatch (or a dead frame)
 * and re-resolves.
 */
const cached = new Map<string, string>()
const inflight = new Map<string, Promise<string>>()

export async function ensurePreviewUrl(root: string): Promise<string> {
  const hit = cached.get(root)
  if (hit) return hit
  const pending = inflight.get(root)
  if (pending) return pending

  const promise = (async () => {
    const res = await fetch('/api/preview', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ root }),
    })
    const data: { ok: boolean; url?: string; error?: string } = await res.json()
    if (!data.ok || !data.url) throw new Error(data.error ?? `Preview server failed (${res.status})`)
    cached.set(root, data.url)
    return data.url
  })()

  inflight.set(root, promise)
  try {
    return await promise
  } finally {
    inflight.delete(root)
  }
}

/** Drop a stale mapping so the next ensurePreviewUrl re-asks the server. */
export function invalidatePreviewUrl(root: string): void {
  cached.delete(root)
}

/** Message the harness posts back to the Studio. */
export type PreviewMessage =
  | { source: 'preview'; type: 'ready'; root?: string }
  | {
      source: 'preview'
      type: 'rendered'
      width: number
      height: number
      blank?: boolean
      /** Named per-button link slots the component exposes (data-link-slot) */
      slots?: string[]
    }
  | { source: 'preview'; type: 'error'; message: string }
  | { source: 'preview'; type: 'size'; width: number; height: number }
  | { source: 'preview'; type: 'clicked'; slot?: string | null }
