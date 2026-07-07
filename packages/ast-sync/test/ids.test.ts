import { describe, expect, it } from 'vitest'
import { injectStableIds, rootIdFor, stripStableIds } from '../src/ids.js'

const BUTTON = `export interface PrimaryButtonProps {
  /** Button label */
  children?: React.ReactNode
}

/** Solid accent call-to-action button. */
export function PrimaryButton({ children = 'Get Started' }: PrimaryButtonProps) {
  return (
    <button
      type="button"
      className="bg-primary text-white text-sm font-medium rounded-lg px-5 py-2"
    >
      {children}
    </button>
  )
}
`

const ARROW = `export const Chip = ({ label }: { label: string }) => (
  <span className="chip">
    <em>{label}</em>
  </span>
)
`

describe('injectStableIds', () => {
  it('adds a deterministic data-csid to every JSX element', () => {
    const { code, count } = injectStableIds(BUTTON)
    expect(count).toBe(1)
    expect(code).toContain('data-csid="c0"')
  })

  it('ids nested elements in depth-first order', () => {
    const { code, count } = injectStableIds(ARROW)
    expect(count).toBe(2)
    expect(code.indexOf('data-csid="c0"')).toBeLessThan(code.indexOf('data-csid="c1"'))
    expect(code.indexOf('data-csid="c0"')).toBeGreaterThan(-1)
  })

  it('does not duplicate ids on already-injected source', () => {
    const once = injectStableIds(BUTTON).code
    const twice = injectStableIds(once)
    expect(twice.count).toBe(0)
    expect(twice.code.match(/data-csid/g)).toHaveLength(1)
  })

  it('preserves untouched source formatting', () => {
    const { code } = injectStableIds(BUTTON)
    expect(code).toContain("/** Solid accent call-to-action button. */")
    expect(code).toContain("{ children = 'Get Started' }: PrimaryButtonProps")
  })
})

describe('stripStableIds', () => {
  it('removes every injected id and keeps the rest of the code', () => {
    const { code } = injectStableIds(BUTTON)
    const stripped = stripStableIds(code)
    expect(stripped).not.toContain('data-csid')
    expect(stripped).toContain('className="bg-primary text-white text-sm font-medium rounded-lg px-5 py-2"')
    expect(stripped).toContain('{children}')
  })
})

describe('rootIdFor', () => {
  it('resolves an exported function declaration to its root element id', () => {
    const { code } = injectStableIds(BUTTON)
    expect(rootIdFor(code, 'PrimaryButton')).toBe('c0')
  })

  it('resolves an exported arrow component to its root element id', () => {
    const { code } = injectStableIds(ARROW)
    expect(rootIdFor(code, 'Chip')).toBe('c0')
  })

  it('returns null for unknown exports', () => {
    const { code } = injectStableIds(BUTTON)
    expect(rootIdFor(code, 'Nope')).toBeNull()
  })
})
