import { existsSync, readFileSync } from 'node:fs'
import { basename, dirname, join, relative, sep } from 'node:path'
import ts from 'typescript'
import { withCompilerOptions } from 'react-docgen-typescript'
import type { PropItem } from 'react-docgen-typescript'
import type {
  PropSpec,
  RegistryEntry,
  ScanResult,
} from '@component-style-studio/registry'
import { walkComponentFiles } from './walk.js'
import { detectRuntimeFlags } from './flags.js'

/**
 * Props inherited from node_modules types are dropped (otherwise every
 * component drowns in ~300 DOM attributes), except the ones the Studio's own
 * edit surface is built on.
 */
const ALWAYS_KEEP_PROPS = new Set(['className', 'style', 'children'])

/** Parent folder names too generic to be a meaningful category. */
const GENERIC_DIRS = new Set(['src', 'components', 'component', 'ui', 'app', 'pages', 'views', 'lib'])

const DOCGEN_OPTIONS = {
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop: PropItem) => {
    if (ALWAYS_KEEP_PROPS.has(prop.name)) return true
    if (prop.parent?.fileName.includes('node_modules')) return false
    return true
  },
}

/**
 * Compiler options for the *target* folder: its own tsconfig.json when present
 * (real `paths`, real strictness), with gaps filled so extraction works even
 * on minimal configs — docgen only type-checks, it never emits.
 */
function loadCompilerOptions(root: string): ts.CompilerOptions {
  let options: ts.CompilerOptions = {}
  const configPath = join(root, 'tsconfig.json')
  if (existsSync(configPath)) {
    const { config } = ts.readConfigFile(configPath, ts.sys.readFile)
    if (config) {
      options = ts.parseJsonConfigFileContent(config, ts.sys, root, undefined, configPath).options
    }
  }
  options.jsx ??= ts.JsxEmit.ReactJSX
  options.module ??= ts.ModuleKind.ESNext
  options.moduleResolution ??= ts.ModuleResolutionKind.Bundler
  options.target ??= ts.ScriptTarget.ESNext
  options.allowJs ??= true
  options.esModuleInterop ??= true
  options.skipLibCheck = true
  options.noEmit = true
  return options
}

function toPropSpec(prop: PropItem): PropSpec {
  // Literal unions arrive as { name: 'enum', raw: '"a" | "b"' } — keep the readable union.
  const typeName =
    prop.type?.name === 'enum' && prop.type.raw ? prop.type.raw : (prop.type?.name ?? 'unknown')
  const spec: PropSpec = {
    name: prop.name,
    type: typeName,
    required: prop.required,
  }
  if (prop.defaultValue != null && prop.defaultValue.value !== undefined) {
    spec.defaultValue = String(prop.defaultValue.value)
  }
  if (prop.description) spec.description = prop.description
  return spec
}

function categoryFor(relPath: string, root: string, absPath: string): string | undefined {
  if (dirname(absPath) === root) return undefined
  const parent = basename(dirname(relPath))
  return GENERIC_DIRS.has(parent.toLowerCase()) ? undefined : parent
}

/**
 * Phase 1 pipeline: walk an external folder, extract every exported React
 * component's props via react-docgen-typescript (one shared ts.Program for the
 * whole scan), flag unresolvable runtime dependencies, and return the
 * populated registry. The folder is read in place — never copied.
 */
export function scanProject(root: string): ScanResult {
  const started = Date.now()
  const files = walkComponentFiles(root)

  const compilerOptions = loadCompilerOptions(root)
  const docgen = withCompilerOptions(compilerOptions, DOCGEN_OPTIONS)
  const program = ts.createProgram(files, compilerOptions)

  const entries: RegistryEntry[] = []
  for (const file of files) {
    const docs = docgen.parseWithProgramProvider(file, () => program)
    if (docs.length === 0) continue

    const flags = detectRuntimeFlags(readFileSync(file, 'utf-8'))
    const relPath = relative(root, file).split(sep).join('/')
    const category = categoryFor(relPath, root, file)

    for (const doc of docs) {
      if (!doc.displayName || !/^[A-Z]/.test(doc.displayName)) continue
      const id = `${relPath}#${doc.displayName}`
      if (entries.some((e) => e.id === id)) continue
      entries.push({
        id,
        name: doc.displayName,
        source: 'imported',
        filePath: relPath,
        exportName: doc.displayName,
        ...(category ? { category } : {}),
        ...(doc.description ? { description: doc.description } : {}),
        props: Object.values(doc.props)
          .map(toPropSpec)
          .sort((a, b) => a.name.localeCompare(b.name)),
        flags,
      })
    }
  }

  entries.sort(
    (a, b) => (a.category ?? '').localeCompare(b.category ?? '') || a.name.localeCompare(b.name),
  )

  return {
    root,
    scannedAt: new Date().toISOString(),
    stats: {
      filesScanned: files.length,
      componentsFound: entries.length,
      flaggedComponents: entries.filter((e) => e.flags.needsMocking).length,
      durationMs: Date.now() - started,
    },
    entries,
  }
}
