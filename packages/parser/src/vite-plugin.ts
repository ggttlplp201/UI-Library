import { readdirSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, isAbsolute, join, resolve } from 'node:path'
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
      // Folder browser for the import screen: nobody should have to type an
      // absolute path into a text field. POST { path? } lists that folder's
      // subfolders (defaults to the home directory). Local dev tool — the
      // server is already running with the user's own filesystem rights.
      server.middlewares.use('/api/fs', (req, res) => {
        const send = (status: number, payload: unknown) => {
          res.statusCode = status
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(payload))
        }
        if (req.method !== 'POST') {
          send(405, { ok: false, error: 'POST { "path": "/abs/folder" }' })
          return
        }
        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', () => {
          let path = homedir()
          try {
            const parsed = JSON.parse(body || '{}')
            if (typeof parsed.path === 'string' && parsed.path.trim() !== '')
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
            const dirs = readdirSync(path, { withFileTypes: true })
              .filter((d) => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'node_modules')
              .map((d) => {
                const full = join(path, d.name)
                let looksLikeProject = false
                try {
                  looksLikeProject = Boolean(
                    statSync(join(full, 'package.json'), { throwIfNoEntry: false })?.isFile(),
                  )
                } catch {
                  // permission errors — just a folder, then
                }
                return { name: d.name, path: full, looksLikeProject }
              })
              .sort((a, b) =>
                a.looksLikeProject === b.looksLikeProject
                  ? a.name.localeCompare(b.name)
                  : a.looksLikeProject
                    ? -1
                    : 1,
              )
            const parent = dirname(path)
            send(200, {
              ok: true,
              path,
              parent: parent !== path ? parent : null,
              home: homedir(),
              dirs,
            })
          } catch (err) {
            send(500, { ok: false, error: err instanceof Error ? err.message : String(err) })
          }
        })
      })

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
