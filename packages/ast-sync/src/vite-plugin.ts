import { readFileSync, statSync } from 'node:fs'
import { isAbsolute, relative, resolve } from 'node:path'
import type { Plugin } from 'vite'
import { syncInstance, type InstanceSync } from './sync.js'
import { VirtualFS } from './virtual-fs.js'

/** POST /api/code body: which file/export to sync plus the instance's edits. */
export interface CodeSyncRequest extends InstanceSync {
  /** Absolute root of the scanned project (imported folder or preset library) */
  root: string
  /** File path relative to the root, posix separators (RegistryEntry.filePath) */
  filePath: string
}

/**
 * Numbers here end up interpolated into generated code (`duration: 0.5`), so
 * a forged request with a string where a number belongs could smuggle
 * arbitrary code into the VirtualFS. Returns the first bad field, else null.
 */
export function invalidSyncField(request: CodeSyncRequest): string | null {
  const num = (v: unknown) => v === undefined || (typeof v === 'number' && Number.isFinite(v))
  const str = (v: unknown) => v === undefined || typeof v === 'string'
  const obj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null
  if (!str(request.text)) return 'text'
  if (request.style !== undefined) {
    const s = request.style
    if (!obj(s)) return 'style'
    if (!str(s.color) || !str(s.backgroundColor) || !str(s.fontFamily) || !str(s.fontWeight)) {
      return 'style'
    }
    if (!num(s.fontSize)) return 'style.fontSize'
  }
  if (request.position !== undefined) {
    const p = request.position
    if (!obj(p) || !num(p.x) || !num(p.y) || !num(p.scaleX) || !num(p.scaleY) || !num(p.rotation)) {
      return 'position'
    }
  }
  if (request.anim !== undefined) {
    const a = request.anim
    if (!obj(a) || typeof a.preset !== 'string' || typeof a.easing !== 'string') return 'anim'
    if (typeof a.duration !== 'number' || !Number.isFinite(a.duration)) return 'anim.duration'
    if (typeof a.delay !== 'number' || !Number.isFinite(a.delay)) return 'anim.delay'
  }
  return null
}

const MAX_BODY_BYTES = 1024 * 1024

/**
 * Dev-server sync endpoint (plan §5.6): the browser posts a canvas instance's
 * edit state; Node reads the component's source from disk (snapshotted into a
 * per-root VirtualFS — the user's files are never written), runs the AST sync
 * engine, and returns the generated code for the live code pane. Phase 8
 * exports by diffing the same VirtualFS.
 */
export function codeSyncPlugin(): Plugin {
  const fsByRoot = new Map<string, VirtualFS>()

  return {
    name: 'component-style-studio:code-sync',
    configureServer(server) {
      server.middlewares.use('/api/code', (req, res) => {
        const send = (status: number, payload: unknown) => {
          res.statusCode = status
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(payload))
        }
        if (req.method !== 'POST') {
          send(405, { ok: false, error: 'POST a CodeSyncRequest JSON body' })
          return
        }
        let body = ''
        let overflowed = false
        req.on('data', (chunk) => {
          if (overflowed) return
          body += chunk
          if (body.length > MAX_BODY_BYTES) {
            overflowed = true
            send(413, { ok: false, error: 'Body too large' })
            req.destroy()
          }
        })
        req.on('end', () => {
          if (overflowed) return
          let request: CodeSyncRequest
          try {
            request = JSON.parse(body || '{}')
          } catch {
            send(400, { ok: false, error: 'Body is not valid JSON' })
            return
          }
          const { root, filePath, exportName } = request
          if (typeof root !== 'string' || !isAbsolute(root)) {
            send(400, { ok: false, error: 'Missing absolute "root"' })
            return
          }
          if (typeof filePath !== 'string' || typeof exportName !== 'string') {
            send(400, { ok: false, error: 'Missing "filePath" / "exportName"' })
            return
          }
          const invalid = invalidSyncField(request)
          if (invalid) {
            send(400, { ok: false, error: `Invalid field: ${invalid}` })
            return
          }
          const abs = resolve(root, filePath)
          const rel = relative(root, abs)
          if (rel.startsWith('..') || isAbsolute(rel)) {
            send(400, { ok: false, error: 'filePath escapes the project root' })
            return
          }
          try {
            if (!statSync(abs, { throwIfNoEntry: false })?.isFile()) {
              send(404, { ok: false, error: `Not a file: ${filePath}` })
              return
            }
            const vfs = fsByRoot.get(root) ?? new VirtualFS()
            fsByRoot.set(root, vfs)
            const file = vfs.open(abs, () => readFileSync(abs, 'utf-8'))
            // Always sync from the pristine snapshot — deterministic, no drift.
            const outcome = syncInstance(file.original, {
              exportName,
              ...(request.text != null ? { text: request.text } : {}),
              ...(request.style ? { style: request.style } : {}),
              ...(request.position ? { position: request.position } : {}),
              ...(request.anim ? { anim: request.anim } : {}),
            })
            vfs.update(abs, outcome.code)
            send(200, { ok: true, ...outcome })
          } catch (err) {
            server.config.logger.error(`[code-sync] ${String(err)}`)
            send(500, { ok: false, error: err instanceof Error ? err.message : String(err) })
          }
        })
      })
    },
  }
}
