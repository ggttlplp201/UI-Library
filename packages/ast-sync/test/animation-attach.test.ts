import { describe, expect, it } from 'vitest'
import { applyAnimationAttach } from '../src/animation-attach.js'

const BUTTON = `export function PrimaryButton({ children = 'Get Started' }: { children?: React.ReactNode }) {
  return (
    <button type="button" className="bg-primary">
      {children}
    </button>
  )
}
`

const WITH_IMPORTS = `import { useState } from 'react'

export function Counter() {
  const [n] = useState(0)
  return <div className="counter">{n}</div>
}
`

const ARROW = `export const Chip = ({ label }: { label: string }) => (
  <span className="chip">{label}</span>
)
`

const REFFED = `import { useRef } from 'react'

export function Card() {
  const cardRef = useRef<HTMLDivElement>(null)
  return <div ref={cardRef}>hi</div>
}
`

const FADE = { preset: 'fade', duration: 0.5, delay: 0, easing: 'power2.out' }

describe('applyAnimationAttach', () => {
  it('attaches a fade useGSAP animation to the root element', () => {
    const res = applyAnimationAttach(BUTTON, 'PrimaryButton', FADE)
    expect(res.changed).toBe(true)
    expect(res.code).toContain("import { useRef } from \"react\"")
    expect(res.code).toContain('from "gsap"')
    expect(res.code).toContain('from "@gsap/react"')
    expect(res.code).toContain('gsap.registerPlugin(useGSAP)')
    expect(res.code).toContain('useRef<HTMLButtonElement>(null)')
    expect(res.code).toContain('ref={animRef}')
    expect(res.code).toMatch(/gsap\.fromTo\(animRef\.current/)
    expect(res.code).toContain('opacity: 0')
    expect(res.code).toContain('opacity: 1')
    expect(res.code).toContain('duration: 0.5')
    expect(res.code).toContain('ease: "power2.out"')
  })

  it('slide-up animates y from 24 to 0', () => {
    const res = applyAnimationAttach(BUTTON, 'PrimaryButton', { ...FADE, preset: 'slide-up' })
    expect(res.code).toContain('y: 24')
    expect(res.code).toContain('y: 0')
  })

  it('bounce forces the bounce.out ease', () => {
    const res = applyAnimationAttach(BUTTON, 'PrimaryButton', { ...FADE, preset: 'bounce' })
    expect(res.code).toContain('ease: "bounce.out"')
    expect(res.code).toContain('y: -24')
  })

  it('includes delay only when set', () => {
    const withDelay = applyAnimationAttach(BUTTON, 'PrimaryButton', { ...FADE, delay: 0.2 })
    expect(withDelay.code).toContain('delay: 0.2')
    const noDelay = applyAnimationAttach(BUTTON, 'PrimaryButton', FADE)
    expect(noDelay.code).not.toContain('delay:')
  })

  it('merges useRef into an existing react import', () => {
    const res = applyAnimationAttach(WITH_IMPORTS, 'Counter', FADE)
    expect(res.changed).toBe(true)
    expect(res.code).toMatch(/import \{ useState, useRef \} from ['"]react['"]/)
  })

  it('converts an expression-body arrow component to a block', () => {
    const res = applyAnimationAttach(ARROW, 'Chip', FADE)
    expect(res.changed).toBe(true)
    expect(res.code).toContain('useRef<HTMLSpanElement>(null)')
    expect(res.code).toContain('return')
    expect(res.code).toContain('ref={animRef}')
  })

  it('reuses an existing ref on the root element', () => {
    const res = applyAnimationAttach(REFFED, 'Card', FADE)
    expect(res.changed).toBe(true)
    expect(res.code).toMatch(/gsap\.fromTo\(cardRef\.current/)
    expect(res.code).not.toContain('animRef')
    // no duplicate ref attribute
    expect(res.code.match(/ref=\{cardRef\}/g)).toHaveLength(1)
  })

  it('no-ops for the none preset', () => {
    const res = applyAnimationAttach(BUTTON, 'PrimaryButton', { ...FADE, preset: 'none' })
    expect(res.changed).toBe(false)
  })

  it('skips components whose root is another component', () => {
    const src = `import { Base } from './Base'
export const Wrapped = () => <Base tone="soft" />
`
    const res = applyAnimationAttach(src, 'Wrapped', FADE)
    expect(res.changed).toBe(false)
    expect(res.reason).toBeTruthy()
  })

  it('skips components that already use useGSAP', () => {
    const attached = applyAnimationAttach(BUTTON, 'PrimaryButton', FADE).code
    const res = applyAnimationAttach(attached, 'PrimaryButton', FADE)
    expect(res.changed).toBe(false)
    expect(res.reason).toMatch(/already/i)
  })

  it('reports unknown components', () => {
    const res = applyAnimationAttach(BUTTON, 'Nope', FADE)
    expect(res.changed).toBe(false)
    expect(res.reason).toMatch(/Nope/)
  })
})
