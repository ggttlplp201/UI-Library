/** Boots (or reuses) the child preview server for a root and returns its URL. */
let cached: { root: string; url: string } | null = null
let inflight: { root: string; promise: Promise<string> } | null = null

export async function ensurePreviewUrl(root: string): Promise<string> {
  if (cached?.root === root) return cached.url
  if (inflight?.root === root) return inflight.promise

  const promise = (async () => {
    const res = await fetch('/api/preview', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ root }),
    })
    const data: { ok: boolean; url?: string; error?: string } = await res.json()
    if (!data.ok || !data.url) throw new Error(data.error ?? `Preview server failed (${res.status})`)
    cached = { root, url: data.url }
    return data.url
  })()

  inflight = { root, promise }
  try {
    return await promise
  } finally {
    if (inflight?.root === root) inflight = null
  }
}

/** Message the harness posts back to the Studio. */
export type PreviewMessage =
  | { source: 'preview'; type: 'ready' }
  | { source: 'preview'; type: 'rendered'; width: number; height: number }
  | { source: 'preview'; type: 'error'; message: string }
