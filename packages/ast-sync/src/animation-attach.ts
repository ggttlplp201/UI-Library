import { types } from 'recast'
import type { ExpressionKind, StatementKind } from 'ast-types/lib/gen/kinds'
import { parseModule, printModule } from './parse.js'
import { findComponentFunction, rootJsxElement } from './ids.js'
import type { TransformResult } from './types.js'

const b = types.builders
const n = types.namedTypes

/** Mirrors AnimConfig in apps/studio/src/lib/canvas.ts. */
export interface AnimAttach {
  preset: string
  duration: number
  delay: number
  easing: string
}

// From-vars per preset — must stay in sync with lib/animation.ts in the
// Studio and ANIM_FROM in packages/preview/src/harness.ts.
const ANIM_FROM: Record<string, { opacity: number; y?: number; scale?: number }> = {
  fade: { opacity: 0 },
  'slide-up': { opacity: 0, y: 24 },
  scale: { opacity: 0, scale: 0.8 },
  bounce: { opacity: 0, y: -24 },
}

const ELEMENT_TYPES: Record<string, string> = {
  a: 'HTMLAnchorElement',
  button: 'HTMLButtonElement',
  canvas: 'HTMLCanvasElement',
  div: 'HTMLDivElement',
  form: 'HTMLFormElement',
  img: 'HTMLImageElement',
  input: 'HTMLInputElement',
  label: 'HTMLLabelElement',
  li: 'HTMLLIElement',
  ol: 'HTMLOListElement',
  p: 'HTMLParagraphElement',
  select: 'HTMLSelectElement',
  span: 'HTMLSpanElement',
  svg: 'SVGSVGElement',
  table: 'HTMLTableElement',
  textarea: 'HTMLTextAreaElement',
  ul: 'HTMLUListElement',
}

/**
 * Parse one statement of generated code so it can be spliced into the AST.
 * Location/original metadata from the snippet's own parse is stripped —
 * otherwise recast prints the spliced node with the snippet's source
 * positions and runs statements together on one line.
 */
function stmt(code: string): StatementKind {
  const node = parseModule(code).program.body[0] as StatementKind
  const purge = (value: unknown, seen: Set<object>) => {
    if (value == null || typeof value !== 'object' || seen.has(value)) return
    seen.add(value)
    if (Array.isArray(value)) {
      for (const item of value) purge(item, seen)
      return
    }
    const rec = value as Record<string, unknown>
    // `original` is non-configurable (recast defines it) — loc is what the
    // printer reads to reuse snippet source, so nulling these is enough.
    rec.loc = null
    delete rec.start
    delete rec.end
    delete rec.tokens
    for (const key of Object.keys(rec)) purge(rec[key], seen)
  }
  purge(node, new Set())
  return node
}

/** The local binding a specifier introduces (default/named/namespace). */
function localNameOf(sp: unknown): string | null {
  if (n.ImportSpecifier.check(sp)) {
    if (sp.local) return sp.local.name as string
    return n.Identifier.check(sp.imported) ? sp.imported.name : null
  }
  if (n.ImportDefaultSpecifier.check(sp) || n.ImportNamespaceSpecifier.check(sp)) {
    return sp.local ? (sp.local.name as string) : null
  }
  return null
}

/**
 * Add `import { name } from mod`. A specifier whose *local* binding is
 * already `name` (named, aliased-to, or default) satisfies it; otherwise the
 * specifier merges into an existing value import — unless that import is a
 * namespace import, which can't hold named specifiers, so a separate
 * declaration is added instead.
 */
function ensureNamedImport(ast: ReturnType<typeof parseModule>, mod: string, name: string): void {
  const body: unknown[] = ast.program.body
  const sameModule = body.filter(
    (s): s is types.namedTypes.ImportDeclaration =>
      n.ImportDeclaration.check(s) &&
      n.StringLiteral.check(s.source) &&
      s.source.value === mod &&
      (s.importKind == null || s.importKind === 'value'),
  )
  if (sameModule.some((d) => (d.specifiers ?? []).some((sp) => localNameOf(sp) === name))) return
  const mergeable = sameModule.find(
    (d) => !(d.specifiers ?? []).some((sp) => n.ImportNamespaceSpecifier.check(sp)),
  )
  if (mergeable) {
    ;(mergeable.specifiers ??= []).push(b.importSpecifier(b.identifier(name)))
    return
  }
  let lastImport = -1
  body.forEach((s, i) => {
    if (n.ImportDeclaration.check(s)) lastImport = i
  })
  body.splice(lastImport + 1, 0, stmt(`import { ${name} } from "${mod}"`))
}

/** First of `base`, `base2`, `base3`… not used as an identifier anywhere. */
function unusedName(ast: ReturnType<typeof parseModule>, base: string): string {
  const used = new Set<string>()
  types.visit(ast, {
    visitIdentifier(path) {
      used.add(path.node.name)
      this.traverse(path)
    },
  })
  if (!used.has(base)) return base
  for (let i = 2; ; i++) if (!used.has(`${base}${i}`)) return `${base}${i}`
}

function hasRegisterPlugin(ast: ReturnType<typeof parseModule>): boolean {
  let found = false
  types.visit(ast, {
    visitCallExpression(path) {
      const callee = path.node.callee
      if (
        n.MemberExpression.check(callee) &&
        n.Identifier.check(callee.object) &&
        callee.object.name === 'gsap' &&
        n.Identifier.check(callee.property) &&
        callee.property.name === 'registerPlugin'
      ) {
        found = true
        return false
      }
      this.traverse(path)
    },
  })
  return found
}

function usesUseGsap(node: Parameters<typeof types.visit>[0]): boolean {
  let found = false
  types.visit(node, {
    visitCallExpression(path) {
      if (n.Identifier.check(path.node.callee) && path.node.callee.name === 'useGSAP') {
        found = true
        return false
      }
      this.traverse(path)
    },
  })
  return found
}

/**
 * applyAnimationAttach (plan §5.6): write the Animation-tab preset into the
 * component as real `useGSAP` code — the same `gsap.fromTo` the preview
 * harness plays, so the exported component animates exactly like the canvas.
 * Attaches a ref to the root host element (reusing one that's already there),
 * registers the useGSAP plugin, and merges the needed imports.
 */
export function applyAnimationAttach(
  source: string,
  exportName: string,
  anim: AnimAttach,
): TransformResult {
  if (!anim.preset || anim.preset === 'none') {
    return { code: source, changed: false, reason: 'No animation' }
  }
  const from = ANIM_FROM[anim.preset]
  if (!from) return { code: source, changed: false, reason: `Unknown preset "${anim.preset}"` }

  const ast = parseModule(source)
  const fn = findComponentFunction(ast, exportName)
  if (!fn) return { code: source, changed: false, reason: `Component "${exportName}" not found` }
  if (usesUseGsap(fn)) {
    return { code: source, changed: false, reason: 'Component already has a useGSAP animation' }
  }

  const root = rootJsxElement(fn)
  if (!root) return { code: source, changed: false, reason: 'Component has no JSX root element' }
  const tagName = root.openingElement.name
  if (!n.JSXIdentifier.check(tagName) || !/^[a-z]/.test(tagName.name)) {
    return {
      code: source,
      changed: false,
      reason: 'Root is another component — a ref may not reach a DOM element',
    }
  }

  // Reuse an existing `ref={someRef}` on the root, else attach our own.
  let refName: string | null = null
  for (const attr of root.openingElement.attributes ?? []) {
    if (
      n.JSXAttribute.check(attr) &&
      n.JSXIdentifier.check(attr.name) &&
      attr.name.name === 'ref' &&
      attr.value &&
      n.JSXExpressionContainer.check(attr.value) &&
      n.Identifier.check(attr.value.expression)
    ) {
      refName = attr.value.expression.name
    }
  }
  const needsRef = refName == null
  if (refName == null) {
    refName = unusedName(ast, 'animRef')
    root.openingElement.attributes ??= []
    root.openingElement.attributes.push(
      b.jsxAttribute(b.jsxIdentifier('ref'), b.jsxExpressionContainer(b.identifier(refName))),
    )
  }

  // Expression-body arrows need a block to hold the hook statements.
  if (!n.BlockStatement.check(fn.body)) {
    fn.body = b.blockStatement([b.returnStatement(fn.body as ExpressionKind)])
  }
  const body = (fn.body as types.namedTypes.BlockStatement).body

  const fromParts = Object.entries(from).map(([k, v]) => `${k}: ${v}`)
  const toParts = ['opacity: 1']
  if (from.y != null) toParts.push('y: 0')
  if (from.scale != null) toParts.push('scale: 1')
  toParts.push(`duration: ${anim.duration}`)
  if (anim.delay > 0) toParts.push(`delay: ${anim.delay}`)
  const ease = anim.preset === 'bounce' ? 'bounce.out' : anim.easing
  toParts.push(`ease: ${JSON.stringify(ease)}`)

  const gsapStmt = stmt(
    `useGSAP(() => {
  gsap.fromTo(${refName}.current, { ${fromParts.join(', ')} }, { ${toParts.join(', ')} })
})`,
  )

  if (needsRef) {
    const elType = ELEMENT_TYPES[tagName.name] ?? 'HTMLElement'
    body.unshift(stmt(`const ${refName} = useRef<${elType}>(null)`), gsapStmt)
    ensureNamedImport(ast, 'react', 'useRef')
  } else {
    // After the declaration of the reused ref, so the hook reads an
    // initialized binding.
    const declIndex = body.findIndex(
      (s) =>
        n.VariableDeclaration.check(s) &&
        s.declarations.some(
          (d) => n.VariableDeclarator.check(d) && n.Identifier.check(d.id) && d.id.name === refName,
        ),
    )
    body.splice(declIndex + 1, 0, gsapStmt)
  }

  ensureNamedImport(ast, 'gsap', 'gsap')
  ensureNamedImport(ast, '@gsap/react', 'useGSAP')
  if (!hasRegisterPlugin(ast)) {
    const bodyStmts: unknown[] = ast.program.body
    let lastImport = -1
    bodyStmts.forEach((s, i) => {
      if (n.ImportDeclaration.check(s)) lastImport = i
    })
    bodyStmts.splice(lastImport + 1, 0, stmt('gsap.registerPlugin(useGSAP)'))
  }

  return { code: printModule(ast), changed: true }
}
