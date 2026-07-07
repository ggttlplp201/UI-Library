import { statSync } from 'node:fs'
import { homedir } from 'node:os'
import { isAbsolute, join, resolve } from 'node:path'
import type { Plugin } from 'vite'
import { scanProject } from './scan.js'

/**
 * Normalize a user-supplied folder path: trim, unescape shell-escaped spaces
 * (paths pasted from a terminal arrive as `UI\ library`), expand `~`.
 */
export function normalizeFolderPath(raw: string): string {
  let path = raw.trim().replace(/\\ /g, ' ')
  if (path === '~' || path.startsWith('~/')) {
    path = join(homedir(), path.slice(2))
  }
  return resolve(path)
}

/**
 * Dev-server scan endpoint (Phase 1, local-scan architecture): the browser
 * posts `{ path }` and Node runs the docgen pipeline against that folder with
 * its real node_modules + tsconfig — fidelity a browser sandbox can't get.
 */
export function componentScanPlugin(): Plugin {
  return {
    name: 'component-style-studio:scan',
    configureServer(server) {
      server.middlewares.use('/api/scan', (req, res) => {
        const send = (status: number, payload: unknown) => {
          res.statusCode = status
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(payload))
        }
        if (req.method !== 'POST') {
          send(405, { ok: false, error: 'POST a JSON body: { "path": "/abs/path/to/folder" }' })
          return
        }
        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', () => {
          let path: string
          try {
            const parsed = JSON.parse(body || '{}')
            if (typeof parsed.path !== 'string' || parsed.path.trim() === '') {
              send(400, { ok: false, error: 'Missing "path" in request body' })
              return
            }
            path = normalizeFolderPath(parsed.path)
          } catch {
            send(400, { ok: false, error: 'Request body is not valid JSON' })
            return
          }
          try {
            if (!isAbsolute(path) || !statSync(path, { throwIfNoEntry: false })?.isDirectory()) {
              send(400, { ok: false, error: `Not a folder: ${path}` })
              return
            }
            const result = scanProject(path)
            send(200, { ok: true, result })
          } catch (err) {
            server.config.logger.error(`[scan] ${String(err)}`)
            send(500, { ok: false, error: err instanceof Error ? err.message : String(err) })
          }
        })
      })
    },
  }
}
