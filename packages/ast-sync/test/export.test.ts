import { describe, expect, it } from 'vitest'
import { collectChanges, type ExportInstance } from '../src/export.js'

// Two components in one file — mirrors shadcn's dialog.tsx style.
const DIALOG = `export function DialogHeader({ children = 'DialogHeader' }: { children?: React.ReactNode }) {
  return <div className="flex flex-col">{children}</div>
}

export function DialogFooter({ children = 'DialogFooter' }: { children?: React.ReactNode }) {
  return <div className="flex flex-row">{children}</div>
}
`

const BUTTON = `export function Button({ children = 'Button' }: { children?: React.ReactNode }) {
  return <button className="bg-primary">{children}</button>
}
`

const read = (files: Record<string, string>) => (path: string) => {
  const src = files[path]
  if (src == null) throw new Error(`Not found: ${path}`)
  return src
}

describe('collectChanges', () => {
  it('produces one changed file for a single edited instance', () => {
    const insts: ExportInstance[] = [
      { filePath: 'button.tsx', exportName: 'Button', style: { backgroundColor: '#111' } },
    ]
    const res = collectChanges(insts, read({ 'button.tsx': BUTTON }))
    expect(res.files).toHaveLength(1)
    expect(res.files[0].path).toBe('button.tsx')
    expect(res.files[0].code).toContain('bg-[#111]')
    expect(res.conflicts).toEqual([])
  })

  it('applies edits to two different exports in the same file (no conflict)', () => {
    const insts: ExportInstance[] = [
      { filePath: 'dialog.tsx', exportName: 'DialogHeader', style: { backgroundColor: '#111' } },
      { filePath: 'dialog.tsx', exportName: 'DialogFooter', style: { backgroundColor: '#222' } },
    ]
    const res = collectChanges(insts, read({ 'dialog.tsx': DIALOG }))
    expect(res.files).toHaveLength(1)
    expect(res.files[0].code).toContain('bg-[#111]')
    expect(res.files[0].code).toContain('bg-[#222]')
    expect(res.conflicts).toEqual([])
  })

  it('last edit wins for two instances of the same export, and reports a conflict', () => {
    const insts: ExportInstance[] = [
      { filePath: 'button.tsx', exportName: 'Button', style: { backgroundColor: '#111' } },
      { filePath: 'button.tsx', exportName: 'Button', style: { backgroundColor: '#999' } },
    ]
    const res = collectChanges(insts, read({ 'button.tsx': BUTTON }))
    expect(res.files).toHaveLength(1)
    expect(res.files[0].code).toContain('bg-[#999]')
    expect(res.files[0].code).not.toContain('bg-[#111]')
    expect(res.conflicts).toHaveLength(1)
    expect(res.conflicts[0]).toMatchObject({ filePath: 'button.tsx', exportName: 'Button' })
  })

  it('omits instances with no edits', () => {
    const insts: ExportInstance[] = [{ filePath: 'button.tsx', exportName: 'Button' }]
    const res = collectChanges(insts, read({ 'button.tsx': BUTTON }))
    expect(res.files).toEqual([])
    expect(res.conflicts).toEqual([])
  })

  it('reports a skip when the source file cannot be read', () => {
    const insts: ExportInstance[] = [
      { filePath: 'missing.tsx', exportName: 'Button', style: { backgroundColor: '#111' } },
    ]
    const res = collectChanges(insts, read({}))
    expect(res.files).toEqual([])
    expect(res.skipped).toHaveLength(1)
    expect(res.skipped[0]).toMatchObject({ filePath: 'missing.tsx', step: 'locate' })
  })

  it('groups across multiple files', () => {
    const insts: ExportInstance[] = [
      { filePath: 'button.tsx', exportName: 'Button', style: { backgroundColor: '#111' } },
      { filePath: 'dialog.tsx', exportName: 'DialogHeader', text: 'Hi' },
    ]
    const res = collectChanges(insts, read({ 'button.tsx': BUTTON, 'dialog.tsx': DIALOG }))
    expect(res.files.map((f) => f.path).sort()).toEqual(['button.tsx', 'dialog.tsx'])
  })
})
