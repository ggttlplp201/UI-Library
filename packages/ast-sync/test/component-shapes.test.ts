import { describe, expect, it } from 'vitest'
import { syncInstance, type InstanceSync } from '../src/sync.js'
import { parseModule } from '../src/parse.js'

/**
 * Cross-component regression net (plan Phase 9). The AST transforms are the
 * highest-risk area: they must edit the shapes they understand and *gracefully
 * skip* everything else — never throw, never emit un-parseable or id-polluted
 * source. This drives a matrix of realistic component shapes through the whole
 * syncInstance pipeline and asserts those invariants hold for all of them.
 */

// A full edit touching every transform, so each shape exercises all four.
const FULL_EDIT: Omit<InstanceSync, 'exportName'> = {
  style: { backgroundColor: '#00aaff', color: '#ffffff', fontWeight: '700' },
  text: 'Hello world',
  position: { scaleX: 1.5, scaleY: 1.5, rotation: 8 },
  anim: { preset: 'fade', duration: 0.4, delay: 0, easing: 'power2.out' },
}

/** Invariants every transform output must satisfy, whatever the shape. */
function expectValidOutput(code: string) {
  // Stable ids are an internal detail — they must never leak into output.
  expect(code).not.toContain('data-csid')
  expect(code).not.toContain('csid')
  expect(code.trim().length).toBeGreaterThan(0)
  // Output must still be parseable TSX.
  expect(() => parseModule(code)).not.toThrow()
}

function run(source: string, exportName: string) {
  const res = syncInstance(source, { exportName, ...FULL_EDIT })
  expectValidOutput(res.code)
  return res
}

interface Shape {
  name: string
  exportName: string
  source: string
  /** true = at least one edit should apply; false = everything skips cleanly */
  edits: boolean
  /** substrings the output must contain when edits apply */
  contains?: string[]
}

const SHAPES: Shape[] = [
  {
    name: 'static className string root',
    exportName: 'Btn',
    edits: true,
    contains: ['bg-[#00aaff]', 'text-[#ffffff]', 'font-bold'],
    source: `export function Btn({ children = 'Go' }: { children?: React.ReactNode }) {
  return <button className="rounded px-3">{children}</button>
}
`,
  },
  {
    name: 'dynamic className via cn() — style skips, text still applies',
    exportName: 'Card',
    edits: true,
    contains: ['Hello world'],
    source: `import { cn } from './cn'
export function Card({ className, children = 'Body' }: { className?: string; children?: React.ReactNode }) {
  return <div className={cn('p-4', className)}>{children}</div>
}
`,
  },
  {
    name: 'no className on root — style adds one',
    exportName: 'Bare',
    edits: true,
    contains: ['className'],
    source: `export function Bare({ children = 'x' }: { children?: React.ReactNode }) {
  return <section>{children}</section>
}
`,
  },
  {
    name: 'template-literal className — dynamic, skips style',
    exportName: 'Tmpl',
    edits: true, // text still applies via children default
    source: `export function Tmpl({ children = 'x' }: { children?: React.ReactNode }) {
  const base = 'p-2'
  return <div className={\`\${base} rounded\`}>{children}</div>
}
`,
  },
  {
    name: 'arrow-function component',
    exportName: 'Arrow',
    edits: true,
    contains: ['bg-[#00aaff]'],
    source: `export const Arrow = ({ children = 'a' }: { children?: React.ReactNode }) => (
  <button className="x">{children}</button>
)
`,
  },
    {
    name: 'named default export (scanner records the name, not "default")',
    exportName: 'Panel',
    edits: true,
    contains: ['bg-[#00aaff]'],
    source: `export default function Panel({ children = 'p' }: { children?: React.ReactNode }) {
  return <div className="p-1">{children}</div>
}
`,
  },
  {
    name: 'anonymous arrow default export — unlocatable, skips cleanly',
    exportName: 'Anon',
    edits: false,
    source: `export default ({ children = 'a' }: { children?: React.ReactNode }) => (
  <div className="x">{children}</div>
)
`,
  },
  {
    name: 'self-closing root (no children)',
    exportName: 'Input',
    edits: true, // style applies; text has nothing to edit
    contains: ['bg-[#00aaff]'],
    source: `export function Input(props: React.ComponentProps<'input'>) {
  return <input className="border" {...props} />
}
`,
  },
  {
    name: 'existing inline style object — position merges',
    exportName: 'Boxed',
    edits: true,
    contains: ['transform'],
    source: `export function Boxed({ children = 'b' }: { children?: React.ReactNode }) {
  return <div className="x" style={{ padding: 4 }}>{children}</div>
}
`,
  },
  {
    name: 'dynamic style expression — position skips',
    exportName: 'Dyn',
    edits: true, // style/text still apply
    source: `export function Dyn({ styles, children = 'd' }: { styles: React.CSSProperties; children?: React.ReactNode }) {
  return <div className="x" style={styles}>{children}</div>
}
`,
  },
  {
    name: 'children not destructured — text skips',
    exportName: 'Pass',
    edits: true, // style still applies
    source: `export function Pass(props: { children?: React.ReactNode }) {
  return <div className="x">{props.children}</div>
}
`,
  },
  {
    name: 'static JSX text children — text replaces in place',
    exportName: 'Label',
    edits: true,
    contains: ['Hello world'],
    source: `export function Label() {
  return <span className="x">Original</span>
}
`,
  },
  {
    name: 'conflicting existing color class — style replaces it',
    exportName: 'Recolor',
    edits: true,
    contains: ['bg-[#00aaff]'],
    source: `export function Recolor({ children = 'r' }: { children?: React.ReactNode }) {
  return <button className="bg-red-500 text-black px-2">{children}</button>
}
`,
  },
  {
    name: 'multiple exports in one file — targets the requested one',
    exportName: 'Second',
    edits: true,
    contains: ['bg-[#00aaff]'],
    source: `export function First({ children = '1' }: { children?: React.ReactNode }) {
  return <div className="first">{children}</div>
}
export function Second({ children = '2' }: { children?: React.ReactNode }) {
  return <div className="second">{children}</div>
}
`,
  },
  {
    name: 'fragment root — no host element to edit, skips all',
    exportName: 'Frag',
    edits: false,
    source: `export function Frag({ children = 'f' }: { children?: React.ReactNode }) {
  return <>{children}</>
}
`,
  },
  {
    name: 'unknown export name — skips with a locate reason',
    exportName: 'DoesNotExist',
    edits: false,
    source: `export function Real() {
  return <div className="x">hi</div>
}
`,
  },
]

describe('component-shape regression matrix', () => {
  for (const shape of SHAPES) {
    it(shape.name, () => {
      const res = run(shape.source, shape.exportName)
      if (shape.edits) {
        expect(res.changed).toBe(true)
      } else {
        expect(res.changed).toBe(false)
        expect(res.code).toBe(shape.source) // untouched on a clean skip
      }
      for (const needle of shape.contains ?? []) {
        expect(res.code).toContain(needle)
      }
    })
  }

  it('is deterministic across the whole matrix (same in → same out)', () => {
    for (const shape of SHAPES) {
      const a = syncInstance(shape.source, { exportName: shape.exportName, ...FULL_EDIT })
      const b = syncInstance(shape.source, { exportName: shape.exportName, ...FULL_EDIT })
      expect(a.code).toBe(b.code)
    }
  })

  it('never throws and always reports skips as structured reasons', () => {
    for (const shape of SHAPES) {
      const res = syncInstance(shape.source, { exportName: shape.exportName, ...FULL_EDIT })
      for (const skip of res.skipped) {
        expect(typeof skip.step).toBe('string')
        expect(skip.reason.length).toBeGreaterThan(0)
      }
    }
  })
})
