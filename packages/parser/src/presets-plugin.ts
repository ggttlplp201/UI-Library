import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { Plugin } from 'vite'
import type { PresetMeta, RegistryEntry } from '@component-style-studio/registry'
import { scanProject } from './scan.js'

/**
 * Loads a preset component's `.meta.json` compliance sidecar
 * (component-sourcing.md §0.2): provenance, license, attribution obligation,
 * and visual-coherence fields. Read + JSON.parse only — a sidecar is data,
 * never code, so nothing from the presets folder executes at scan time.
 * Missing or invalid sidecars are non-fatal: the entry just has no `meta`,
 * so migration is component-by-component.
 */
function loadSidecar(presetsRoot: string, entry: RegistryEntry): PresetMeta | undefined {
  const sidecarPath = join(presetsRoot, dirname(entry.filePath), `${entry.exportName}.meta.json`)
  if (!existsSync(sidecarPath)) return undefined
  try {
    return JSON.parse(readFileSync(sidecarPath, 'utf-8')) as PresetMeta
  } catch {
    return undefined
  }
}

/**
 * Serves the bundled preset library (plan §7 decision #1: a curated seed set).
 * The presets folder is a real component project, scanned by the same pipeline
 * as an imported folder, but its entries are tagged `source: 'preset'` so the
 * Studio can render and label them alongside imported components. Preset
 * entries also carry their `.meta.json` sidecar (license/attribution) when one
 * exists — the user-import scan path is unchanged.
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
          const entries = result.entries.map((entry) => {
            const meta = loadSidecar(presetsRoot, entry)
            return { ...entry, source: 'preset' as const, ...(meta ? { meta } : {}) }
          })
          send(200, { ok: true, root: presetsRoot, entries })
        } catch (err) {
          server.config.logger.error(`[presets] ${String(err)}`)
          send(500, { ok: false, error: err instanceof Error ? err.message : String(err) })
        }
      })
    },
  }
}
