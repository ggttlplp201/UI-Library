import { types } from 'recast'
import { parseModule, printModule } from './parse.js'
import { findByCsid } from './ids.js'
import type { TransformResult } from './types.js'

const b = types.builders
const n = types.namedTypes

/** Canvas transform state; identity values (0 / scale 1) are omitted from output. */
export interface PositionEdit {
  x?: number
  y?: number
  scale?: number
  rotation?: number
}

function transformValue(pos: PositionEdit): string {
  const parts: string[] = []
  if ((pos.x ?? 0) !== 0 || (pos.y ?? 0) !== 0) {
    parts.push(`translate(${pos.x ?? 0}px, ${pos.y ?? 0}px)`)
  }
  if (pos.scale != null && pos.scale !== 1) parts.push(`scale(${pos.scale})`)
  if (pos.rotation != null && pos.rotation !== 0) parts.push(`rotate(${pos.rotation}deg)`)
  return parts.join(' ')
}

const isKey = (prop: unknown, name: string): prop is types.namedTypes.ObjectProperty =>
  (n.ObjectProperty.check(prop) || n.Property.check(prop)) &&
  ((n.Identifier.check(prop.key) && prop.key.name === name) ||
    (n.StringLiteral.check(prop.key) && prop.key.value === name))

/**
 * applyPositionEdit (plan §5.6): write the canvas transform (translate /
 * scale / rotate) into the target node's inline `style` object. Identity
 * values remove a previously written transform, so undoing an edit on the
 * canvas also undoes it in code. Dynamic `style={expr}` values are out of
 * scope — reported, never rewritten.
 */
export function applyPositionEdit(source: string, csid: string, pos: PositionEdit): TransformResult {
  const ast = parseModule(source)
  const path = findByCsid(ast, csid)
  if (!path) return { code: source, changed: false, reason: `No JSX node with id ${csid}` }

  const value = transformValue(pos)
  const attrs = (path.node.openingElement.attributes ??= [])
  const attrIndex = attrs.findIndex(
    (a) => n.JSXAttribute.check(a) && n.JSXIdentifier.check(a.name) && a.name.name === 'style',
  )
  const attr = attrIndex >= 0 ? (attrs[attrIndex] as types.namedTypes.JSXAttribute) : null

  const objectOf = (a: types.namedTypes.JSXAttribute): types.namedTypes.ObjectExpression | null =>
    a.value && n.JSXExpressionContainer.check(a.value) && n.ObjectExpression.check(a.value.expression)
      ? a.value.expression
      : null

  if (attr) {
    const obj = objectOf(attr)
    if (!obj) {
      return {
        code: source,
        changed: false,
        reason: 'style is a dynamic expression — edit the source directly',
      }
    }
    const existing = obj.properties.findIndex((p) => isKey(p, 'transform'))
    if (value === '') {
      if (existing < 0) return { code: source, changed: false, reason: 'No position changes' }
      obj.properties.splice(existing, 1)
      if (obj.properties.length === 0) attrs.splice(attrIndex, 1)
      return { code: printModule(ast), changed: true }
    }
    const prop = b.objectProperty(b.identifier('transform'), b.stringLiteral(value))
    if (existing >= 0) obj.properties[existing] = prop
    else obj.properties.push(prop)
    return { code: printModule(ast), changed: true }
  }

  if (value === '') return { code: source, changed: false, reason: 'No position changes' }
  attrs.push(
    b.jsxAttribute(
      b.jsxIdentifier('style'),
      b.jsxExpressionContainer(
        b.objectExpression([b.objectProperty(b.identifier('transform'), b.stringLiteral(value))]),
      ),
    ),
  )
  return { code: printModule(ast), changed: true }
}
