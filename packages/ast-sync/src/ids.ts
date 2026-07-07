import { types } from 'recast'
import { parseModule, printModule } from './parse.js'

/**
 * Stable JSX ids (plan §5.6, Onlook's `data-oid` trick): every JSX element in
 * the working copy gets a `data-csid` attribute so a canvas edit can address
 * an exact source node. Ids exist only in the in-memory virtual FS — they are
 * stripped before the code is shown or exported.
 */
export const CSID_ATTR = 'data-csid'

const b = types.builders
const n = types.namedTypes

type JsxOpening = types.namedTypes.JSXOpeningElement

function csidOf(node: JsxOpening): string | null {
  for (const attr of node.attributes ?? []) {
    if (
      n.JSXAttribute.check(attr) &&
      n.JSXIdentifier.check(attr.name) &&
      attr.name.name === CSID_ATTR &&
      attr.value &&
      n.StringLiteral.check(attr.value)
    ) {
      return attr.value.value
    }
  }
  return null
}

/**
 * Add a deterministic `data-csid="cN"` (depth-first order) to every JSX
 * element that doesn't already carry one. Numbering continues past existing
 * ids so re-injection never collides.
 */
export function injectStableIds(source: string): { code: string; count: number } {
  const ast = parseModule(source)
  let max = -1
  types.visit(ast, {
    visitJSXOpeningElement(path) {
      const id = csidOf(path.node)
      const m = id ? /^c(\d+)$/.exec(id) : null
      if (m) max = Math.max(max, Number(m[1]))
      this.traverse(path)
    },
  })

  let next = max + 1
  let count = 0
  types.visit(ast, {
    visitJSXOpeningElement(path) {
      if (csidOf(path.node) == null) {
        path.node.attributes ??= []
        path.node.attributes.push(
          b.jsxAttribute(b.jsxIdentifier(CSID_ATTR), b.stringLiteral(`c${next}`)),
        )
        next += 1
        count += 1
      }
      this.traverse(path)
    },
  })
  return { code: count > 0 ? printModule(ast) : source, count }
}

/** Remove every `data-csid` attribute — run before display and export. */
export function stripStableIds(source: string): string {
  const ast = parseModule(source)
  let removed = false
  types.visit(ast, {
    visitJSXOpeningElement(path) {
      const attrs = path.node.attributes ?? []
      const kept = attrs.filter(
        (a) => !(n.JSXAttribute.check(a) && n.JSXIdentifier.check(a.name) && a.name.name === CSID_ATTR),
      )
      if (kept.length !== attrs.length) {
        path.node.attributes = kept
        removed = true
      }
      this.traverse(path)
    },
  })
  return removed ? printModule(ast) : source
}

/**
 * The root JSX element of a named top-level component: the element the
 * Studio's per-instance style/position/animation edits target. Handles
 * `function Name()` declarations and `const Name = () => …` arrows (exported
 * or not — the scanner already confirmed the export). Fragments resolve to
 * their first element child.
 */
export function rootIdFor(source: string, exportName: string): string | null {
  const ast = parseModule(source)
  const fn = findComponentFunction(ast, exportName)
  if (!fn) return null
  const root = rootJsxElement(fn)
  return root ? csidOf(root.openingElement) : null
}

type ComponentFn =
  | types.namedTypes.FunctionDeclaration
  | types.namedTypes.FunctionExpression
  | types.namedTypes.ArrowFunctionExpression

export function findComponentFunction(ast: ReturnType<typeof parseModule>, name: string): ComponentFn | null {
  let found: ComponentFn | null = null
  const body: unknown[] = ast.program.body
  const scan = (stmt: unknown) => {
    if (n.FunctionDeclaration.check(stmt) && stmt.id?.name === name) {
      found = stmt
    } else if (n.VariableDeclaration.check(stmt)) {
      for (const decl of stmt.declarations) {
        if (
          n.VariableDeclarator.check(decl) &&
          n.Identifier.check(decl.id) &&
          decl.id.name === name &&
          (n.ArrowFunctionExpression.check(decl.init) || n.FunctionExpression.check(decl.init))
        ) {
          found = decl.init
        }
      }
    }
  }
  for (const stmt of body) {
    if (n.ExportNamedDeclaration.check(stmt) && stmt.declaration) scan(stmt.declaration)
    else if (n.ExportDefaultDeclaration.check(stmt) && n.FunctionDeclaration.check(stmt.declaration)) {
      scan(stmt.declaration)
    } else scan(stmt)
    if (found) break
  }
  return found
}

/** The JSX element a component function ultimately returns. */
export function rootJsxElement(fn: ComponentFn): types.namedTypes.JSXElement | null {
  const unwrap = (expr: unknown): types.namedTypes.JSXElement | null => {
    if (n.JSXElement.check(expr)) return expr
    if (n.JSXFragment.check(expr)) {
      for (const child of expr.children ?? []) {
        if (n.JSXElement.check(child)) return child
      }
    }
    return null
  }

  if (!n.FunctionDeclaration.check(fn) && !n.BlockStatement.check(fn.body)) {
    return unwrap(fn.body)
  }

  let root: types.namedTypes.JSXElement | null = null
  types.visit(fn.body, {
    // Nested functions (render callbacks, handlers) have their own returns —
    // don't mistake them for the component's.
    visitFunction() {
      return false
    },
    visitReturnStatement(path) {
      const el = unwrap(path.node.argument)
      if (el) root = el
      this.traverse(path)
    },
  })
  return root
}

export type JsxElementPath = InstanceType<typeof types.NodePath<types.namedTypes.JSXElement>>

/**
 * Locate the JSX element carrying a given stable id anywhere in the module.
 * Returns the NodePath so transforms can walk up to the enclosing function.
 */
export function findByCsid(ast: ReturnType<typeof parseModule>, csid: string): JsxElementPath | null {
  let found: JsxElementPath | null = null
  types.visit(ast, {
    visitJSXElement(path) {
      if (!found && csidOf(path.node.openingElement) === csid) {
        found = path
        return false
      }
      this.traverse(path)
    },
  })
  return found
}

/** Nearest function (component body) enclosing a JSX node path. */
export function enclosingFunction(path: JsxElementPath): ComponentFn | null {
  let p = path.parent
  while (p) {
    const node: unknown = p.node
    if (
      n.FunctionDeclaration.check(node) ||
      n.FunctionExpression.check(node) ||
      n.ArrowFunctionExpression.check(node)
    ) {
      return node
    }
    p = p.parent
  }
  return null
}
