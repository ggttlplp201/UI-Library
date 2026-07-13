import { describe, expect, it } from 'vitest'
import { injectStableIds } from '../src/ids.js'
import { applyStyleEdit } from '../src/style-edit.js'

const BUTTON = injectStableIds(`export function PrimaryButton() {
  return (
    <button
      type="button"
      className="bg-primary text-white text-sm font-medium rounded-lg px-5 py-2"
    >
      Get Started
    </button>
  )
}
`).code

const BARE = injectStableIds(`export const Box = () => <div>content</div>
`).code

const DYNAMIC = injectStableIds(`export const Fancy = ({ cls }: { cls: string }) => (
  <div className={cls}>x</div>
)
`).code

describe('applyStyleEdit', () => {
  it('replaces the text color class, keeping unrelated classes', () => {
    const res = applyStyleEdit(BUTTON, 'c0', { color: '#ff0000' })
    expect(res.changed).toBe(true)
    expect(res.code).toContain('text-[#ff0000]')
    expect(res.code).not.toContain('text-white')
    // size + background survive a color change
    expect(res.code).toContain('text-sm')
    expect(res.code).toContain('bg-primary')
  })

  it('replaces the background class, including custom theme colors', () => {
    const res = applyStyleEdit(BUTTON, 'c0', { backgroundColor: '#001122' })
    expect(res.changed).toBe(true)
    expect(res.code).toContain('bg-[#001122]')
    expect(res.code).not.toContain('bg-primary')
    expect(res.code).toContain('text-white')
  })

  it('maps known numeric weights to canonical utilities', () => {
    const res = applyStyleEdit(BUTTON, 'c0', { fontWeight: '600' })
    expect(res.code).toContain('font-semibold')
    expect(res.code).not.toContain('font-medium')
  })

  it('sets an arbitrary pixel font size, replacing the size class only', () => {
    const res = applyStyleEdit(BUTTON, 'c0', { fontSize: 18 })
    expect(res.code).toContain('text-[18px]')
    expect(res.code).not.toContain('text-sm')
    expect(res.code).toContain('text-white')
  })

  it('sets an arbitrary font family', () => {
    const res = applyStyleEdit(BUTTON, 'c0', { fontFamily: 'Georgia, serif' })
    expect(res.code).toContain('font-[family-name:Georgia,_serif]')
    // weight utility is not a family utility — it stays
    expect(res.code).toContain('font-medium')
  })

  it('encodes whitespace in arbitrary values as underscores', () => {
    const res = applyStyleEdit(BUTTON, 'c0', {
      color: 'rgb(255 0 0 / 0.5)',
      fontFamily: 'Comic Sans MS',
    })
    expect(res.code).toContain('text-[rgb(255_0_0_/_0.5)]')
    expect(res.code).toContain('font-[family-name:Comic_Sans_MS]')
  })

  it('creates a className attribute when the element has none', () => {
    const res = applyStyleEdit(BARE, 'c0', { color: '#123456' })
    expect(res.changed).toBe(true)
    expect(res.code).toContain('className="text-[#123456]"')
  })

  it('applies several overrides at once', () => {
    const res = applyStyleEdit(BUTTON, 'c0', { color: '#fff', backgroundColor: '#000', fontSize: 20 })
    expect(res.code).toContain('text-[#fff]')
    expect(res.code).toContain('bg-[#000]')
    expect(res.code).toContain('text-[20px]')
  })

  it('skips dynamic className expressions with a reason', () => {
    const res = applyStyleEdit(DYNAMIC, 'c0', { color: '#fff' })
    expect(res.changed).toBe(false)
    expect(res.reason).toMatch(/dynamic/i)
  })

  it('no-ops on an empty override', () => {
    const res = applyStyleEdit(BUTTON, 'c0', {})
    expect(res.changed).toBe(false)
  })

  it('reports unknown target ids', () => {
    const res = applyStyleEdit(BUTTON, 'c99', { color: '#fff' })
    expect(res.changed).toBe(false)
    expect(res.reason).toMatch(/c99/)
  })
})
