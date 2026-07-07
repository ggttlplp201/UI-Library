import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative } from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'
import { walkComponentFiles } from '../src/walk.js'

// Skip-dir behavior is tested against a generated tree (a committed
// node_modules fixture would fight the repo's own .gitignore).
const root = mkdtempSync(join(tmpdir(), 'css-walk-'))

function file(relPath: string) {
  const abs = join(root, relPath)
  mkdirSync(join(abs, '..'), { recursive: true })
  writeFileSync(abs, 'export {}\n')
}

afterAll(() => rmSync(root, { recursive: true, force: true }))

describe('walkComponentFiles', () => {
  it('collects .tsx/.jsx and skips deps, build output, tests, stories, dotfiles', () => {
    file('src/components/Button.tsx')
    file('src/components/Badge.jsx')
    file('src/components/Button.stories.tsx')
    file('src/components/Button.test.tsx')
    file('src/components/Button.spec.jsx')
    file('src/types.d.ts')
    file('src/util.ts')
    file('node_modules/pkg/Comp.tsx')
    file('dist/Comp.tsx')
    file('.hidden/Comp.tsx')
    file('src/.Hidden.tsx')

    const found = walkComponentFiles(root).map((f) => relative(root, f))
    expect(found).toEqual(['src/components/Badge.jsx', 'src/components/Button.tsx'])
  })
})
