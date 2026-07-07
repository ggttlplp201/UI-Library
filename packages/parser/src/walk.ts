import { readdirSync } from 'node:fs'
import { join } from 'node:path'

/** Directories that never contain user components worth importing. */
const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'dist-ssr',
  'build',
  'out',
  'coverage',
  '.next',
  '.cache',
  '.turbo',
  'storybook-static',
  'public',
])

const COMPONENT_FILE = /\.(tsx|jsx)$/
const SKIP_FILE = /\.(test|spec|stories)\.(tsx|jsx)$/

/**
 * Walk a folder for candidate component files (plan §5.1): `.tsx`/`.jsx`,
 * skipping dependency/build/VCS directories, dotfiles, and test/story files.
 */
export function walkComponentFiles(root: string): string[] {
  const files: string[] = []
  const visit = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue
      if (entry.isSymbolicLink()) continue
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) visit(join(dir, entry.name))
      } else if (COMPONENT_FILE.test(entry.name) && !SKIP_FILE.test(entry.name)) {
        files.push(join(dir, entry.name))
      }
    }
  }
  visit(root)
  return files.sort()
}
