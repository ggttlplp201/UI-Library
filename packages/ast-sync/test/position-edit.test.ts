import { describe, expect, it } from 'vitest'
import { injectStableIds } from '../src/ids.js'
import { applyPositionEdit } from '../src/position-edit.js'

const PLAIN = injectStableIds(`export function Card() {
  return <div className="card">hi</div>
}
`).code

const WITH_STYLE = injectStableIds(`export function Card() {
  return <div style={{ opacity: 0.9 }}>hi</div>
}
`).code

const DYNAMIC = injectStableIds(`export const Card = ({ s }: { s: object }) => <div style={s}>hi</div>
`).code

describe('applyPositionEdit', () => {
  it('writes scale and rotation as a transform style', () => {
    const res = applyPositionEdit(PLAIN, 'c0', { scaleX: 1.25, scaleY: 1.25, rotation: 15 })
    expect(res.changed).toBe(true)
    expect(res.code).toContain('transform: "scale(1.25) rotate(15deg)"')
  })

  it('writes non-uniform scale with both axes', () => {
    const res = applyPositionEdit(PLAIN, 'c0', { scaleX: 2, scaleY: 0.5 })
    expect(res.changed).toBe(true)
    expect(res.code).toContain('transform: "scale(2, 0.5)"')
  })

  it('writes x/y as a translate', () => {
    const res = applyPositionEdit(PLAIN, 'c0', { x: 12, y: -4 })
    expect(res.changed).toBe(true)
    expect(res.code).toContain('transform: "translate(12px, -4px)"')
  })

  it('merges into an existing style object, keeping other properties', () => {
    const res = applyPositionEdit(WITH_STYLE, 'c0', { rotation: 90 })
    expect(res.changed).toBe(true)
    expect(res.code).toContain('opacity: 0.9')
    expect(res.code).toContain('transform: "rotate(90deg)"')
  })

  it('replaces a previously written transform instead of stacking', () => {
    const once = applyPositionEdit(PLAIN, 'c0', { rotation: 15 }).code
    const twice = applyPositionEdit(once, 'c0', { rotation: 30 })
    expect(twice.code).toContain('rotate(30deg)')
    expect(twice.code).not.toContain('rotate(15deg)')
  })

  it('identity values remove a previously written transform', () => {
    const rotated = applyPositionEdit(PLAIN, 'c0', { rotation: 15 }).code
    const reset = applyPositionEdit(rotated, 'c0', { rotation: 0, scaleX: 1, scaleY: 1 })
    expect(reset.changed).toBe(true)
    expect(reset.code).not.toContain('transform')
  })

  it('no-ops on identity values when nothing was written', () => {
    const res = applyPositionEdit(PLAIN, 'c0', { scaleX: 1, scaleY: 1, rotation: 0 })
    expect(res.changed).toBe(false)
  })

  it('skips dynamic style expressions with a reason', () => {
    const res = applyPositionEdit(DYNAMIC, 'c0', { rotation: 5 })
    expect(res.changed).toBe(false)
    expect(res.reason).toMatch(/dynamic/i)
  })

  it('reports unknown target ids', () => {
    const res = applyPositionEdit(PLAIN, 'c99', { rotation: 5 })
    expect(res.changed).toBe(false)
    expect(res.reason).toMatch(/c99/)
  })
})
