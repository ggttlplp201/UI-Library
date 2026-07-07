import { statSync } from 'node:fs'
import { isAbsolute } from 'node:path'
import type { Plugin } from 'vite'
import { closeAllPreviewServers, ensurePreviewServer } from './preview-server.js'

/**
 * Studio-server endpoint that boots (or reuses) the child preview server for a
 * given imported-project root and returns its URL. The Studio embeds
 * `<iframe src="{url}__preview__">` and drives it over postMessage.
 */
export function previewApiPlugin(): Plugin {
  return {
    name: 'component-style-studio:preview-api',
    configureServer(server) {
      server.httpServer?.once('close', () => void closeAllPreviewServers())

      server.middlewares.use('/api/preview', (req, res) => {
        const send = (status: number, payload: unknown) => {
          res.statusCode = status
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(payload))
        }
        if (req.method !== 'POST') {
          send(405, { ok: false, error: 'POST { "root": "/abs/path" }' })
          return
        }
        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', () => {
          void (async () => {
            let root: string
            try {
              root = JSON.parse(body || '{}').root
            } catch {
              send(400, { ok: false, error: 'Body is not valid JSON' })
              return
            }
            if (typeof root !== 'string' || !isAbsolute(root)) {
              send(400, { ok: false, error: 'Missing absolute "root"' })
              return
            }
            try {
              if (!statSync(root, { throwIfNoEntry: false })?.isDirectory()) {
                send(400, { ok: false, error: `Not a folder: ${root}` })
                return
              }
              const { url } = await ensurePreviewServer(root)
              send(200, { ok: true, url })
            } catch (err) {
              server.config.logger.error(`[preview] ${String(err)}`)
              send(500, { ok: false, error: err instanceof Error ? err.message : String(err) })
            }
          })()
        })
      })
    },
  }
}
