import { existsSync } from 'node:fs'
import type { Plugin } from 'vite'
import { scanProject } from './scan.js'

/**
 * Serves the bundled preset library (plan §7 decision #1: a curated seed set).
 * The presets folder is a real component project, scanned by the same pipeline
 * as an imported folder, but its entries are tagged `source: 'preset'` so the
 * Studio can render and label them alongside imported components.
 */
export function presetsApiPlugin(presetsRoot: string): Plugin {
  return {
    name: 'component-style-studio:presets',
    configureServer(server) {
      server.middlewares.use('/api/presets', (_req, res) => {
        const send = (status: number, payload: unknown) => {
          res.statusCode = status
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(payload))
        }
        try {
          if (!existsSync(presetsRoot)) {
            send(200, { ok: true, root: presetsRoot, entries: [] })
            return
          }
          const result = scanProject(presetsRoot)
          const entries = result.entries.map((entry) => ({ ...entry, source: 'preset' as const }))
          send(200, { ok: true, root: presetsRoot, entries })
        } catch (err) {
          server.config.logger.error(`[presets] ${String(err)}`)
          send(500, { ok: false, error: err instanceof Error ? err.message : String(err) })
        }
      })
    },
  }
}
