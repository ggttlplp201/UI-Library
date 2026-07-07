import { describe, expect, it } from 'vitest'
import { injectStableIds, rootIdFor, stripStableIds } from '../src/ids.js'
import { applyTextEdit } from '../src/text-edit.js'
import { applyStyleEdit } from '../src/style-edit.js'
import { applyPositionEdit } from '../src/position-edit.js'
import { applyAnimationAttach } from '../src/animation-attach.js'

// Mirror of packages/presets/src/buttons/PrimaryButton.tsx
const SRC = `export interface PrimaryButtonProps {
  /** Button label */
  children?: React.ReactNode
}

/** Solid accent call-to-action button. */
export function PrimaryButton({ children = 'Get Started' }: PrimaryButtonProps) {
  return (
    <button
      type="button"
      className="bg-primary text-white text-sm font-medium rounded-lg px-5 py-2 whitespace-nowrap tracking-tight"
    >
      {children}
    </button>
  )
}
`

describe('full pipeline on a real preset component', () => {
  it('chains all four transforms and strips ids', () => {
    const { code: withIds } = injectStableIds(SRC)
    const root = rootIdFor(withIds, 'PrimaryButton')
    expect(root).toBe('c0')

    let out = applyStyleEdit(withIds, root!, {
      color: '#111115',
      backgroundColor: '#ffd166',
      fontSize: 18,
    }).code
    out = applyTextEdit(out, root!, 'Buy now').code
    out = applyPositionEdit(out, root!, { scaleX: 1.2, scaleY: 1.2, rotation: -3 }).code
    out = applyAnimationAttach(out, 'PrimaryButton', {
      preset: 'slide-up',
      duration: 0.6,
      delay: 0.1,
      easing: 'power2.out',
    }).code
    const final = stripStableIds(out)

    expect(final).not.toContain('data-csid')
    expect(final).toContain('text-[#111115]')
    expect(final).toContain('bg-[#ffd166]')
    expect(final).toContain('text-[18px]')
    expect(final).toContain("children = \"Buy now\"")
    expect(final).toContain('scale(1.2) rotate(-3deg)')
    expect(final).toContain('useGSAP')
    expect(final).toContain('y: 24')
    expect(final).toContain('delay: 0.1')
    // eslint-disable-next-line no-console
    console.log(final)
  })
})
