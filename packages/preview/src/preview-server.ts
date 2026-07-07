import { createServer, type ViteDevServer } from 'vite'
import { previewPlugin } from './preview-plugin.js'

interface RunningServer {
  server: ViteDevServer
  /** Base URL of the child server, e.g. http://localhost:5180/ */
  url: string
}

/** One child server per imported-project root, started lazily and reused. */
const servers = new Map<string, Promise<RunningServer>>()

/**
 * Ensure a Vite dev server is running rooted at the imported project. It
 * auto-loads the project's own vite config (its React + Tailwind plugins,
 * path aliases) and we append the preview plugin, so components render with
 * the project's real dependencies and styles.
 */
export function ensurePreviewServer(root: string): Promise<RunningServer> {
  let running = servers.get(root)
  if (!running) {
    running = startServer(root).catch((err) => {
      servers.delete(root)
      throw err
    })
    servers.set(root, running)
  }
  return running
}

async function startServer(root: string): Promise<RunningServer> {
  const server = await createServer({
    root,
    // configFile left undefined → Vite auto-detects the project's own config.
    plugins: [previewPlugin(root)],
    clearScreen: false,
    logLevel: 'warn',
    server: {
      // Override any port the project's own config sets, so it can't collide
      // with the Studio server; auto-increment if this one is taken.
      port: 5180,
      strictPort: false,
      fs: { allow: [root] },
    },
  })
  await server.listen()
  const url = server.resolvedUrls?.local[0] ?? `http://localhost:${server.config.server.port}/`
  return { server, url }
}

export async function closeAllPreviewServers(): Promise<void> {
  const running = [...servers.values()]
  servers.clear()
  await Promise.all(
    running.map(async (p) => {
      try {
        const { server } = await p
        await server.close()
      } catch {
        // best-effort teardown
      }
    }),
  )
}
