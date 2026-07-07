import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import type { Plugin } from 'vite'
import { harnessModule, PREVIEW_HTML } from './harness.js'

const require_ = createRequire(import.meta.url)

/**
 * Resolve GSAP (and @gsap/react) from the Studio's own node_modules so the
 * harness — and seed components converted to GSAP — can `import 'gsap'` even
 * when the scanned project doesn't depend on it. Aliased into the child
 * server below.
 */
function gsapAliases(): Record<string, string> {
  const alias: Record<string, string> = {}
  try {
    alias.gsap = require_.resolve('gsap')
    alias['@gsap/react'] = require_.resolve('@gsap/react')
  } catch {
    // GSAP not installed yet — harness animation degrades gracefully.
  }
  return alias
}

const HARNESS_ID = 'virtual:preview-harness'

/**
 * Common entry-CSS locations, most-specific first. Only the first match is
 * imported into the harness — that's the project's Tailwind entry, so the
 * preview inherits its theme (custom tokens, dark mode, fonts) exactly as its
 * own app renders it. Ordered ahead of component-demo CSS like `App.css`.
 */
const CSS_CANDIDATES = [
  'src/index.css',
  'src/main.css',
  'src/styles/index.css',
  'src/styles/globals.css',
  'src/styles/tailwind.css',
  'src/globals.css',
  'src/app/globals.css',
  'app/globals.css',
  'styles/globals.css',
]

/**
 * Plugin injected into the child (project-rooted) Vite server: serves the
 * preview HTML shell at `/__preview__` and the virtual harness module that
 * renders a requested component with mock props.
 */
export function previewPlugin(root: string): Plugin {
  const entryCss = CSS_CANDIDATES.find((rel) => existsSync(join(root, rel)))
  const cssImportLines = entryCss ? `import '/${entryCss}'` : ''

  return {
    name: 'component-style-studio:preview',
    config() {
      return {
        resolve: { alias: gsapAliases() },
        optimizeDeps: { include: ['gsap'] },
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? '').split('?')[0]
        if (path !== '/__preview__' && path !== '/__preview__/') return next()
        // Run through Vite's HTML transform so @vitejs/plugin-react can inject
        // its refresh preamble — without it, component modules throw
        // "can't detect preamble" when they load.
        server
          .transformIndexHtml(req.url ?? '/__preview__', PREVIEW_HTML)
          .then((html) => {
            res.statusCode = 200
            res.setHeader('content-type', 'text/html')
            res.end(html)
          })
          .catch((err) => {
            server.config.logger.error(`[preview] html transform: ${String(err)}`)
            res.statusCode = 500
            res.end(String(err))
          })
      })
    },
    resolveId(id) {
      if (id === HARNESS_ID) return HARNESS_ID
    },
    load(id) {
      if (id === HARNESS_ID) return harnessModule(cssImportLines)
    },
  }
}
