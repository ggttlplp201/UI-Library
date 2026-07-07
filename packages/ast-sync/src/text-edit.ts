import { types } from 'recast'
import { parseModule, printModule } from './parse.js'
import { enclosingFunction, findByCsid } from './ids.js'
import type { TransformResult } from './types.js'

const b = types.builders
const n = types.namedTypes

/** JSXText can't hold braces/angle brackets — fall back to a string expression. */
function textChild(text: string) {
  return /[{}<>]/.test(text) ? b.jsxExpressionContainer(b.stringLiteral(text)) : b.jsxText(text)
}

/**
 * applyTextEdit (plan §5.6): rewrite the text content of the JSX node `csid`.
 *
 * Three shapes, all data-only — the render logic is never rewritten:
 * - static `JSXText` children → replaced in place (mixed children keep their
 *   non-text siblings);
 * - a sole `{prop}` expression child whose `prop` is destructured in the
 *   component's params → the prop's *default value* is set/updated, so the
 *   component still accepts the prop but renders the edited text by default;
 * - anything else (computed text, no text) → unchanged, with a reason.
 */
export function applyTextEdit(source: string, csid: string, text: string): TransformResult {
  const ast = parseModule(source)
  const path = findByCsid(ast, csid)
  if (!path) return { code: source, changed: false, reason: `No JSX node with id ${csid}` }

  const el = path.node
  const kids = el.children ?? []
  const isWsText = (k: unknown) => n.JSXText.check(k) && k.value.trim() === ''
  const meaningful = kids.filter((k) => !isWsText(k))

  // Case 1: static text children — replace the first, drop any others.
  if (meaningful.some((k) => n.JSXText.check(k))) {
    let replaced = false
    el.children = kids.flatMap((k) => {
      if (!n.JSXText.check(k) || k.value.trim() === '') return [k]
      if (replaced) return []
      replaced = true
      return [textChild(text)]
    })
    return { code: printModule(ast), changed: true }
  }

  // Case 2: sole `{prop}` child → set the destructured prop's default value.
  const only = meaningful.length === 1 ? meaningful[0] : null
  if (only && n.JSXExpressionContainer.check(only) && n.Identifier.check(only.expression)) {
    const propName = only.expression.name
    const fn = enclosingFunction(path)
    const param = fn?.params?.[0]
    if (n.ObjectPattern.check(param)) {
      for (const prop of param.properties) {
        if (!n.ObjectProperty.check(prop) && !n.Property.check(prop)) continue
        if (!n.Identifier.check(prop.key) || prop.key.name !== propName) continue
        if (n.AssignmentPattern.check(prop.value)) {
          prop.value.right = b.stringLiteral(text)
        } else if (n.Identifier.check(prop.value)) {
          prop.value = b.assignmentPattern(b.identifier(propName), b.stringLiteral(text))
        } else {
          continue
        }
        return { code: printModule(ast), changed: true }
      }
    }
    return {
      code: source,
      changed: false,
      reason: `Text comes from "${propName}", which is not a destructured prop of the component`,
    }
  }

  return { code: source, changed: false, reason: 'Element has no editable text content' }
}
