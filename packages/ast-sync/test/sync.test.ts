import { describe, expect, it } from 'vitest'
import { syncInstance } from '../src/sync.js'
import { VirtualFS } from '../src/virtual-fs.js'

const SRC = `export function PrimaryButton({ children = 'Get Started' }: { children?: React.ReactNode }) {
  return (
    <button type="button" className="bg-primary text-sm">
      {children}
    </button>
  )
}
`

describe('syncInstance', () => {
  it('applies the full instance state onto pristine source', () => {
    const res = syncInstance(SRC, {
      exportName: 'PrimaryButton',
      text: 'Buy now',
      style: { backgroundColor: '#000' },
      position: { scaleX: 1.5, scaleY: 1.5 },
      anim: { preset: 'fade', duration: 0.4, delay: 0, easing: 'power2.out' },
    })
    expect(res.changed).toBe(true)
    expect(res.skipped).toEqual([])
    expect(res.code).not.toContain('data-csid')
    expect(res.code).toContain('children = "Buy now"')
    expect(res.code).toContain('bg-[#000]')
    expect(res.code).toContain('scale(1.5)')
    expect(res.code).toContain('useGSAP')
  })

  it('is deterministic — same input state, same output', () => {
    const state = {
      exportName: 'PrimaryButton',
      style: { color: '#123' },
      anim: { preset: 'scale', duration: 0.3, delay: 0, easing: 'none' },
    }
    expect(syncInstance(SRC, state).code).toBe(syncInstance(SRC, state).code)
  })

  it('returns the source untouched when there are no edits', () => {
    const res = syncInstance(SRC, { exportName: 'PrimaryButton' })
    expect(res.changed).toBe(false)
    expect(res.code).toBe(SRC)
  })

  it('does not attach a none animation', () => {
    const res = syncInstance(SRC, {
      exportName: 'PrimaryButton',
      anim: { preset: 'none', duration: 0.5, delay: 0, easing: 'power2.out' },
    })
    expect(res.changed).toBe(false)
    expect(res.code).toBe(SRC)
  })

  it('collects skip reasons for edits that cannot be applied', () => {
    const dynamic = `export const Fancy = ({ cls }: { cls: string }) => <div className={cls}>x</div>
`
    const res = syncInstance(dynamic, { exportName: 'Fancy', style: { color: '#fff' } })
    expect(res.changed).toBe(false)
    expect(res.skipped).toHaveLength(1)
    expect(res.skipped[0].step).toBe('style')
  })

  it('reports an unknown component', () => {
    const res = syncInstance(SRC, { exportName: 'Nope', text: 'x' })
    expect(res.changed).toBe(false)
    expect(res.skipped[0].step).toBe('locate')
  })
})

describe('VirtualFS', () => {
  it('keeps the original snapshot across updates and diffs changed files', () => {
    const fs = new VirtualFS()
    fs.open('a.tsx', () => 'original a')
    fs.open('b.tsx', () => 'original b')
    fs.update('a.tsx', 'edited a')
    fs.update('a.tsx', 'edited a again')

    expect(fs.get('a.tsx')?.original).toBe('original a')
    expect(fs.get('a.tsx')?.current).toBe('edited a again')
    const diff = fs.diff()
    expect(diff).toHaveLength(1)
    expect(diff[0].path).toBe('a.tsx')
  })

  it('open() reads each file only once', () => {
    const fs = new VirtualFS()
    let reads = 0
    const read = () => {
      reads += 1
      return 'src'
    }
    fs.open('a.tsx', read)
    fs.open('a.tsx', read)
    expect(reads).toBe(1)
  })
})
