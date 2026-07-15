#!/usr/bin/env node
/**
 * Registry ingestion (component-sourcing.md §0.1 Path A): pull a component
 * from a shadcn-compatible registry into the preset library, with its
 * dependencies read from the registry item JSON, a credit header, and the
 * `.meta.json` compliance sidecar.
 *
 * Usage:
 *   node scripts/ingest-registry.mjs <item-json-url> <category-dir> \
 *     --library "Magic UI" --author "@magicuidesign" --license MIT \
 *     --docs <human docs url> [--style-family magic-ui]
 *
 * The tool only ingests from sources already on the ALLOW list in
 * docs/component-sourcing.md §4.1 — it does not decide licenses for you.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

const [url, category, ...rest] = process.argv.slice(2)
if (!url || !category) {
  console.error('usage: ingest-registry.mjs <item-json-url> <category-dir> --library L --author A --license MIT --docs URL')
  process.exit(1)
}
const opt = (name, fallback = '') => {
  const i = rest.indexOf(`--${name}`)
  return i >= 0 && rest[i + 1] ? rest[i + 1] : fallback
}
const library = opt('library')
const author = opt('author')
const license = opt('license', 'MIT')
const docs = opt('docs', url)
const styleFamily = opt('style-family', library.toLowerCase().replace(/\s+/g, '-'))
if (!library || !author) {
  console.error('--library and --author are required (provenance is not optional)')
  process.exit(1)
}

const item = await fetch(url).then((r) => {
  if (!r.ok) throw new Error(`${r.status} fetching ${url}`)
  return r.json()
})

// --- dependency check: the registry item declares its deps; verify they're in package.json ---
const pkg = JSON.parse(readFileSync(join(pkgRoot, 'package.json'), 'utf-8'))
const declared = new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})])
const missing = (item.dependencies ?? []).filter((d) => !declared.has(d.replace(/@[\^~]?[\d.]+.*$/, '')))
if (missing.length > 0) {
  console.error(`Missing deps for ${item.name}: ${missing.join(', ')}`)
  console.error(`Run: npm i ${missing.join(' ')} --workspace=@component-style-studio/presets`)
  process.exit(2)
}

const targetDir = join(pkgRoot, 'src', category)
mkdirSync(targetDir, { recursive: true })

// --- registry CSS: keyframes + @theme tokens some items need (Tailwind v4) ---
// Appended once per item into src/registry.css (imported by index.css) so
// classes like `animate-marquee` actually animate.
function cssObjectToText(sel, obj, indent = '') {
  const lines = [indent + sel + ' {']
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'object') lines.push(cssObjectToText(k, v, indent + '  '))
    else lines.push(indent + '  ' + k + ': ' + v + ';')
  }
  lines.push(indent + '}')
  return lines.join('\n')
}
const cssChunks = []
if (item.css) for (const [sel, body] of Object.entries(item.css)) cssChunks.push(cssObjectToText(sel, body))
if (item.cssVars && item.cssVars.theme) {
  const vars = Object.entries(item.cssVars.theme)
    .map(([k, v]) => '  --' + k + ': ' + v + ';')
    .join('\n')
  cssChunks.push('@theme inline {\n' + vars + '\n}')
}
if (cssChunks.length > 0) {
  const regCssPath = join(pkgRoot, 'src', 'registry.css')
  const marker = '/* registry:' + item.name + ' */'
  const existing = existsSync(regCssPath) ? readFileSync(regCssPath, 'utf-8') : '/* CSS required by registry-ingested components (ingest-registry.mjs) */\n'
  if (!existing.includes(marker)) {
    writeFileSync(regCssPath, existing + '\n' + marker + '\n' + cssChunks.join('\n') + '\n')
    console.log('registry.css += ' + item.name)
  }
  const indexCssPath = join(pkgRoot, 'src', 'index.css')
  const indexCss = readFileSync(indexCssPath, 'utf-8')
  if (!indexCss.includes('./registry.css')) {
    // @imports must precede other rules; put it right after the font import.
    writeFileSync(indexCssPath, indexCss.replace(/\n/, "\n@import './registry.css';\n"))
    console.log('index.css imports registry.css')
  }
}

for (const file of item.files ?? []) {
  if (!file.content) continue
  let content = file.content
  // Registry files import shadcn-style aliases; map them to this package.
  content = content.replaceAll('@/lib/utils', '../lib/utils')
  content = content.replace(/@\/(?:registry\/[\w-]+|components\/[\w-]+)\/([\w-]+)/g, (_, name) => {
    // Files are written as PascalCase export names; keep imports consistent.
    const pascal = name.replace(/(?:^|-)([a-z])/g, (_m, c) => c.toUpperCase())
    return `./${pascal}`
  })

  // Component name = the file's main export (registry files are kebab-case).
  const exportMatch = content.match(/export (?:const|function) ([A-Z]\w*)/)
  const name = exportMatch ? exportMatch[1] : null
  if (!name) {
    console.error(`No component export found in ${file.path} — skipped`)
    continue
  }

  // Credit header (component-sourcing.md §2) ahead of the source.
  const header = `/**
 * ${item.title ?? name} — ${(item.description ?? '').trim()}
 * Ported from ${library} (${item.name}) via its shadcn-compatible registry.
 * Source: ${docs}
 * Author: ${author}. License: ${license}.
 */
`
  const outPath = join(targetDir, `${name}.tsx`)
  if (existsSync(outPath)) {
    console.error(`${outPath} already exists — skipped (delete it first to re-ingest)`)
    continue
  }
  writeFileSync(outPath, header + content)

  const sidecar = {
    library,
    source: docs,
    author,
    license,
    attributionRequired: false,
    ingest: 'registry',
    fetchedFrom: url,
    styleFamily,
    qualityTier: 'vetted',
    previewStatus: 'needs-mock',
  }
  writeFileSync(join(targetDir, `${name}.meta.json`), JSON.stringify(sidecar, null, 2) + '\n')
  console.log(`ingested ${name} -> src/${category}/${name}.tsx (+ sidecar)`)
}
