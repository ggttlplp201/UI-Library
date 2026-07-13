import { types } from 'recast'
import { parseModule, printModule } from './parse.js'
import { findByCsid } from './ids.js'
import type { TransformResult } from './types.js'

const b = types.builders
const n = types.namedTypes

// className helpers whose first string-literal argument holds the base classes
// (`cn("flex items-center", className)` — the shadcn/Tailwind convention). We
// edit that literal in place so components using them stay editable.
const CLASS_HELPERS = new Set(['cn', 'clsx', 'classNames', 'cx', 'twMerge', 'twJoin', 'cva', 'tw'])

/** Style-tab overrides that map to Tailwind classes (`text` is applyTextEdit's job). */
export interface StyleEdit {
  color?: string
  backgroundColor?: string
  fontFamily?: string
  fontWeight?: string
  fontSize?: number
}

const WEIGHT_UTILITIES: Record<string, string> = {
  '100': 'font-thin',
  '200': 'font-extralight',
  '300': 'font-light',
  '400': 'font-normal',
  '500': 'font-medium',
  '600': 'font-semibold',
  '700': 'font-bold',
  '800': 'font-extrabold',
  '900': 'font-black',
}

/** Arbitrary values can't contain whitespace — Tailwind uses `_` instead. */
const arb = (value: string) => value.replace(/\s+/g, '_')

// `bg-*` utilities that are NOT background-color — everything else bg- is
// treated as a color (covers custom theme colors like `bg-primary`).
const BG_NON_COLOR =
  /^bg-(gradient-|none$|auto$|cover$|contain$|center|top|bottom|left|right|repeat|no-repeat|fixed$|local$|scroll$|clip-|origin-|blend-|\[url|\[image:|\[length:|\[position:|\[size:)/

// `text-*` utilities that are NOT text-color: sizes, alignment, wrapping, overflow.
const TEXT_NON_COLOR =
  /^text-(xs$|sm$|base$|lg$|xl$|\dxl$|\[\d|\[length:|left$|center$|right$|justify$|start$|end$|wrap$|nowrap$|balance$|pretty$|ellipsis$|clip$)/

const TEXT_SIZE = /^text-(xs|sm|base|lg|xl|\dxl)$|^text-\[(\d|length:)/
const FONT_WEIGHT = /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$|^font-\[\d/
const FONT_FAMILY = /^font-(sans|serif|mono)$|^font-\[(family-name:|')/

interface ClassOp {
  add: string
  conflicts: (cls: string) => boolean
}

function classOps(style: StyleEdit): ClassOp[] {
  const ops: ClassOp[] = []
  if (style.color) {
    ops.push({
      add: `text-[${arb(style.color)}]`,
      conflicts: (c) => c.startsWith('text-') && !TEXT_NON_COLOR.test(c),
    })
  }
  if (style.backgroundColor) {
    ops.push({
      add: `bg-[${arb(style.backgroundColor)}]`,
      conflicts: (c) => c.startsWith('bg-') && !BG_NON_COLOR.test(c),
    })
  }
  if (style.fontSize != null) {
    ops.push({ add: `text-[${style.fontSize}px]`, conflicts: (c) => TEXT_SIZE.test(c) })
  }
  if (style.fontWeight) {
    ops.push({
      add: WEIGHT_UTILITIES[style.fontWeight] ?? `font-[${arb(style.fontWeight)}]`,
      conflicts: (c) => FONT_WEIGHT.test(c),
    })
  }
  if (style.fontFamily) {
    ops.push({
      add: `font-[family-name:${arb(style.fontFamily)}]`,
      conflicts: (c) => FONT_FAMILY.test(c),
    })
  }
  return ops
}

/**
 * applyStyleEdit (plan §5.6): Tailwind class add/remove/replace on the target
 * node's `className`. Each override removes only the classes it conflicts
 * with (a color change never touches sizing, and vice versa); the new value
 * is written as a canonical utility when one exists, else an arbitrary-value
 * class. Dynamic `className={...}` expressions are out of scope — reported,
 * never rewritten.
 */
export function applyStyleEdit(source: string, csid: string, style: StyleEdit): TransformResult {
  const ops = classOps(style)
  if (ops.length === 0) return { code: source, changed: false, reason: 'No style changes' }

  const ast = parseModule(source)
  const path = findByCsid(ast, csid)
  if (!path) return { code: source, changed: false, reason: `No JSX node with id ${csid}` }

  const attrs = (path.node.openingElement.attributes ??= [])
  const attr = attrs.find(
    (a): a is types.namedTypes.JSXAttribute =>
      n.JSXAttribute.check(a) && n.JSXIdentifier.check(a.name) && a.name.name === 'className',
  )

  // Locate the editable class string: a plain string-literal className, or the
  // first string-literal argument of a cn()/clsx()/cva() call. Template
  // literals and other computed values can't be edited safely.
  let getClasses: () => string
  let setClasses: (value: string) => void

  if (!attr) {
    getClasses = () => ''
    setClasses = (value) =>
      attrs.push(b.jsxAttribute(b.jsxIdentifier('className'), b.stringLiteral(value)))
  } else if (attr.value && n.StringLiteral.check(attr.value)) {
    const lit = attr.value
    getClasses = () => lit.value
    setClasses = (value) => {
      lit.value = value
    }
  } else if (
    attr.value &&
    n.JSXExpressionContainer.check(attr.value) &&
    n.CallExpression.check(attr.value.expression) &&
    n.Identifier.check(attr.value.expression.callee) &&
    CLASS_HELPERS.has(attr.value.expression.callee.name)
  ) {
    const call = attr.value.expression
    const litArg = call.arguments.find((a): a is types.namedTypes.StringLiteral =>
      n.StringLiteral.check(a),
    )
    if (litArg) {
      getClasses = () => litArg.value
      setClasses = (value) => {
        litArg.value = value
      }
    } else {
      getClasses = () => ''
      setClasses = (value) => call.arguments.unshift(b.stringLiteral(value))
    }
  } else {
    return {
      code: source,
      changed: false,
      reason: 'className is a computed expression — edit the source directly',
    }
  }

  const existing = getClasses()
  let classes = existing.split(/\s+/).filter(Boolean)
  for (const op of ops) {
    classes = classes.filter((c) => !op.conflicts(c) && c !== op.add)
    classes.push(op.add)
  }
  const value = classes.join(' ')
  if (value === existing) return { code: source, changed: false }

  setClasses(value)
  return { code: printModule(ast), changed: true }
}
