import { describe, expect, it } from 'vitest'
import { injectStableIds } from '../src/ids.js'
import { applyTextEdit } from '../src/text-edit.js'

const STATIC = injectStableIds(`export function Tag() {
  return <span className="tag">Static label</span>
}
`).code

const PROP_DRIVEN = injectStableIds(`export function PrimaryButton({ children = 'Get Started' }: { children?: React.ReactNode }) {
  return (
    <button type="button" className="bg-primary">
      {children}
    </button>
  )
}
`).code

const NO_DEFAULT = injectStableIds(`export const Chip = ({ label }: { label: string }) => (
  <span className="chip">{label}</span>
)
`).code

const MIXED = injectStableIds(`export function IconButton() {
  return (
    <button>
      <svg viewBox="0 0 16 16" />
      Download
    </button>
  )
}
`).code

describe('applyTextEdit', () => {
  it('replaces static text children', () => {
    const res = applyTextEdit(STATIC, 'c0', 'New label')
    expect(res.changed).toBe(true)
    expect(res.code).toContain('>New label</span>')
    expect(res.code).not.toContain('Static label')
  })

  it('updates the default of a destructured prop when children is {prop}', () => {
    const res = applyTextEdit(PROP_DRIVEN, 'c0', 'Buy now')
    expect(res.changed).toBe(true)
    expect(res.code).toMatch(/children = ["']Buy now["']/)
    // the render expression itself is untouched — no logic change
    expect(res.code).toContain('{children}')
  })

  it('adds a default to a destructured prop that has none', () => {
    const res = applyTextEdit(NO_DEFAULT, 'c0', 'Hello')
    expect(res.changed).toBe(true)
    expect(res.code).toMatch(/label = ["']Hello["']/)
    expect(res.code).toContain('{label}')
  })

  it('replaces only the text child of mixed children', () => {
    const res = applyTextEdit(MIXED, 'c0', 'Save')
    expect(res.changed).toBe(true)
    expect(res.code).toContain('<svg')
    expect(res.code).toContain('Save')
    expect(res.code).not.toContain('Download')
  })

  it('wraps text needing JSX escaping in a string expression', () => {
    const res = applyTextEdit(STATIC, 'c0', 'a < b {ok}')
    expect(res.changed).toBe(true)
    expect(res.code).toContain('{"a < b {ok}"}')
  })

  it('reports unknown target ids', () => {
    const res = applyTextEdit(STATIC, 'c99', 'x')
    expect(res.changed).toBe(false)
    expect(res.reason).toMatch(/c99/)
  })

  it('skips elements with no editable text', () => {
    const src = injectStableIds('export const Rule = () => <hr className="rule" />\n').code
    const res = applyTextEdit(src, 'c0', 'x')
    expect(res.changed).toBe(false)
    expect(res.reason).toBeTruthy()
  })
})
