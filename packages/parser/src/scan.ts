import { existsSync, readFileSync } from 'node:fs'
import { basename, dirname, join, relative, sep } from 'node:path'
import ts from 'typescript'
import { withCompilerOptions } from 'react-docgen-typescript'
import type { PropItem } from 'react-docgen-typescript'
import type {
  PropSpec,
  RegistryEntry,
  ScanError,
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

interface TargetConfig {
  options: ts.CompilerOptions
  /** Files the target's own tsconfig includes — carries ambient types (vite-env.d.ts, module declarations) */
  fileNames: string[]
}

function parseConfigFile(configPath: string): ts.ParsedCommandLine | undefined {
  const { config } = ts.readConfigFile(configPath, ts.sys.readFile)
  if (!config) return undefined
  return ts.parseJsonConfigFileContent(config, ts.sys, dirname(configPath), undefined, configPath)
}

/**
 * Compiler config for the *target* folder: its own tsconfig.json when present
 * (real `paths`, real strictness, its included ambient files), with gaps
 * filled so extraction works even on minimal configs. The scan program never
 * emits, so options forced here can't affect the target project.
 *
 * Deliberately does NOT pass `projectReferences` to the program: with Vite's
 * solution-style layout the walked src files belong to the referenced
 * tsconfig.app.json project, and a reference-aware program redirects them
 * away from source, leaving docgen with nothing. Instead, a solution-style
 * root (no own files) gets its options/fileNames folded in from the
 * referenced leaf configs directly.
 */
function loadTargetConfig(root: string): TargetConfig {
  let options: ts.CompilerOptions = {}
  const fileNames: string[] = []
  const configPath = join(root, 'tsconfig.json')
  if (existsSync(configPath)) {
    const parsed = parseConfigFile(configPath)
    if (parsed) {
      options = parsed.options
      fileNames.push(...parsed.fileNames)
      if (fileNames.length === 0 && parsed.projectReferences) {
        for (const ref of parsed.projectReferences) {
          const refPath = ts.resolveProjectReferencePath(ref)
          if (!existsSync(refPath)) continue
          const refParsed = parseConfigFile(refPath)
          if (!refParsed || refParsed.fileNames.length === 0) continue
          fileNames.push(...refParsed.fileNames)
          // Earlier-listed references (the app project) win over later ones;
          // the root config's own options win over all of them.
          options = { ...refParsed.options, ...options }
        }
      }
    }
  }
  options.jsx ??= ts.JsxEmit.ReactJSX
  options.module ??= ts.ModuleKind.ESNext
  options.moduleResolution ??= ts.ModuleResolutionKind.Bundler
  options.target ??= ts.ScriptTarget.ESNext
  options.esModuleInterop ??= true
  // Forced regardless of the target's setting: the walk collects .jsx files
  // even when the target compiles with allowJs off.
  options.allowJs = true
  options.skipLibCheck = true
  options.noEmit = true
  // Build-orchestration options from leaf configs don't apply to a scan program.
  options.composite = false
  options.incremental = false
  delete options.tsBuildInfoFile
  return { options, fileNames }
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

  const { options, fileNames } = loadTargetConfig(root)
  const docgen = withCompilerOptions(options, DOCGEN_OPTIONS)
  const program = ts.createProgram({
    rootNames: [...new Set([...fileNames, ...files])],
    options,
  })

  const entries: RegistryEntry[] = []
  const errors: ScanError[] = []
  for (const file of files) {
    const relPath = relative(root, file).split(sep).join('/')
    let docs
    let flags
    try {
      docs = docgen.parseWithProgramProvider(file, () => program)
      flags = detectRuntimeFlags(readFileSync(file, 'utf-8'))
    } catch (err) {
      // One hostile file must not abort the whole scan (review finding).
      errors.push({ filePath: relPath, message: err instanceof Error ? err.message : String(err) })
      continue
    }
    if (docs.length === 0) continue

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
    ...(errors.length > 0 ? { errors } : {}),
  }
}
