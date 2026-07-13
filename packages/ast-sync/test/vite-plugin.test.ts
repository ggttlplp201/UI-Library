import { describe, expect, it } from 'vitest'
import { invalidSyncField, type CodeSyncRequest } from '../src/vite-plugin.js'

const BASE: CodeSyncRequest = { root: '/proj', filePath: 'Button.tsx', exportName: 'Button' }

// Bypassing the compile-time types on purpose — the validator exists for
// callers that don't go through the typed client.
const forged = (extra: Record<string, unknown>): CodeSyncRequest =>
  ({ ...BASE, ...extra }) as CodeSyncRequest

describe('invalidSyncField', () => {
  it('accepts a full well-formed request', () => {
    const req = forged({
      text: 'Buy now',
      style: { color: '#fff', fontSize: 18 },
      position: { scaleX: 2, rotation: 45 },
      anim: { preset: 'fade', duration: 0.5, delay: 0, easing: 'power2.out' },
    })
    expect(invalidSyncField(req)).toBeNull()
  })

  it('accepts a request with no edits', () => {
    expect(invalidSyncField(BASE)).toBeNull()
  })

  it('rejects code smuggled through numeric anim fields', () => {
    const req = forged({
      anim: { preset: 'fade', duration: '1 }); evil(', delay: 0, easing: 'power2.out' },
    })
    expect(invalidSyncField(req)).toBe('anim.duration')
  })

  it('rejects non-finite numbers', () => {
    expect(
      invalidSyncField(
        forged({ anim: { preset: 'fade', duration: Infinity, delay: 0, easing: 'x' } }),
      ),
    ).toBe('anim.duration')
    expect(invalidSyncField(forged({ position: { rotation: NaN } }))).toBe('position')
  })

  it('rejects wrong-typed style and position fields', () => {
    expect(invalidSyncField(forged({ style: { fontSize: '18px' } }))).toBe('style.fontSize')
    expect(invalidSyncField(forged({ style: { color: 5 } }))).toBe('style')
    expect(invalidSyncField(forged({ position: { scaleX: '2' } }))).toBe('position')
    expect(invalidSyncField(forged({ text: 42 }))).toBe('text')
  })
})
