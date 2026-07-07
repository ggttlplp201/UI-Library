import type { RuntimeFlags } from '@component-style-studio/registry'

/**
 * Heuristic detection of unresolvable runtime dependencies (plan §5.1).
 *
 * A component the Studio can't safely execute is one that reaches outside its
 * props for data: React context, or hooks imported from anywhere other than
 * `react` (data hooks like `useQuery`, project-local hooks like `useCart`).
 * Those get flagged so previews mock them instead of executing them.
 *
 * Source-level regex heuristics, deliberately: this runs before any AST
 * infrastructure exists (that arrives in Phase 7) and only needs to sort
 * components into "safe to render with mock props" vs "needs mocking".
 */

const HOOK_NAME = /^use[A-Z0-9]/

// import { useX, type Y } from 'mod'  /  import Default, { useX } from 'mod'
const NAMED_IMPORT = /import\s+(type\s+)?(?:[\w$]+\s*,\s*)?\{([^}]*)\}\s*from\s*['"]([^'"]+)['"]/g
// import useX from 'mod'  /  import useX, { ... } from 'mod'
const DEFAULT_IMPORT = /import\s+(use[A-Z0-9]\w*)\s*(?:,\s*\{[^}]*\})?\s*from\s*['"]([^'"]+)['"]/g

export function detectRuntimeFlags(source: string): RuntimeFlags {
  const usesContext = /\buseContext\s*\(/.test(source)
  const externalHooks = new Set<string>()

  for (const match of source.matchAll(NAMED_IMPORT)) {
    const [, typeOnly, names, module_] = match
    if (typeOnly || module_ === 'react') continue
    for (const raw of names.split(',')) {
      const trimmed = raw.trim()
      if (!trimmed || trimmed.startsWith('type ')) continue
      const name = trimmed.split(/\s+as\s+/)[0].trim()
      if (HOOK_NAME.test(name)) externalHooks.add(name)
    }
  }
  for (const match of source.matchAll(DEFAULT_IMPORT)) {
    const [, name, module_] = match
    if (module_ !== 'react') externalHooks.add(name)
  }

  const hooks = [...externalHooks].sort()
  return {
    usesContext,
    externalHooks: hooks,
    needsMocking: usesContext || hooks.length > 0,
  }
}
