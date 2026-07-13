import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// Relative imports (not the @component-style-studio/* package names): Vite
// externalizes bare imports when bundling this config, and Node can't execute
// the packages' TS source directly. The relative path makes esbuild
// bundle+compile it instead, keeping workspace packages build-step-free.
import { componentScanPlugin } from '../../packages/parser/src/vite-plugin'
import { presetsApiPlugin } from '../../packages/parser/src/presets-plugin'
import { previewApiPlugin } from '../../packages/preview/src/api-plugin'
import { codeSyncPlugin } from '../../packages/ast-sync/src/vite-plugin'

const here = dirname(fileURLToPath(import.meta.url))
const presetsRoot = resolve(here, '../../packages/presets')

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    componentScanPlugin(),
    presetsApiPlugin(presetsRoot),
    previewApiPlugin(),
    codeSyncPlugin(),
  ],
})
