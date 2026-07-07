import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// Relative import (not the @component-style-studio/parser package name): Vite
// externalizes bare imports when bundling this config, and Node can't execute
// the parser package's TS source directly. The relative path makes esbuild
// bundle+compile it instead, keeping workspace packages build-step-free.
import { componentScanPlugin } from '../../packages/parser/src/vite-plugin'

export default defineConfig({
  plugins: [react(), tailwindcss(), componentScanPlugin()],
})
