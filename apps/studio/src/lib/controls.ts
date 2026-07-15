import type { PropSpec, RegistryEntry } from '@component-style-studio/registry'

/**
 * argType-style control derivation (plan Phase 2). Each editable prop becomes a
 * typed control the Controls panel renders an input for, mirroring Storybook's
 * Controls model without depending on Storybook.
 */
export type ControlKind = 'text' | 'number' | 'boolean' | 'select' | 'color' | 'image' | 'images'

export interface ControlSpec {
  name: string
  kind: ControlKind
  required: boolean
  /** Plumbing-ish prop (no description/default): shown collapsed under "Advanced" */
  advanced?: boolean
  /** Options for `select`, parsed from a string-literal union type */
  options?: string[]
  /**
   * For `images`: the keys of each element when the prop is an object array
   * (e.g. ['src','alt','title']); undefined means a plain `string[]`. Uploaded
   * photos are shaped to match so they drop into the component unchanged.
   */
  imageKeys?: string[]
  defaultValue?: unknown
  description?: string
}

/** CSS-level overrides edited in the Style tab and applied via the `style` prop. */
export interface StyleOverride {
  text?: string
  color?: string
  backgroundColor?: string
  fontFamily?: string
  fontWeight?: string
  fontSize?: number
}

// Props that are styling/rendering plumbing, not meaningful content controls.
const SKIP_PROPS = new Set([
  'className', 'style', 'ref', 'key', 'asChild',
  // DOM chrome that leaks through docgen when a component extends
  // HTMLAttributes — real users never want these in a design tool.
  'accessKey', 'role', 'tabIndex', 'id', 'lang', 'dir', 'slot', 'spellCheck',
  'draggable', 'contentEditable', 'autoFocus', 'autoCapitalize', 'autoCorrect',
  'autoSave', 'translate', 'hidden', 'inert', 'nonce', 'radioGroup', 'is',
  'itemID', 'itemProp', 'itemRef', 'itemScope', 'itemType', 'about',
  'datatype', 'inlist', 'prefix', 'property', 'rel', 'resource', 'rev',
  'typeof', 'vocab', 'security', 'unselectable', 'inputMode', 'enterKeyHint',
  'exportparts', 'part', 'popover', 'popoverTarget', 'popoverTargetAction',
  'contextMenu', 'results',
  'suppressContentEditableWarning', 'suppressHydrationWarning',
])
// Whole prop families that are never design controls.
const SKIP_PATTERNS = [/^aria-/i, /^data-/i, /^on[A-Z]/]

// Type fragments that mark a prop as non-trivially editable: functions,
// elements, and arrays/object literals (which must not be mocked as strings —
// e.g. an `items: {…}[]` prop whose type text merely contains "string").
const UNEDITABLE = [
  '=>',
  'ReactElement',
  'ComponentRenderFn',
  'EventHandler',
  'MouseEvent',
  'ReactNode',
  '[]',
  'Array<',
  '{',
]

// Components that render a void/childless host element — don't inject children.
const VOID_LIKE = /input|image|img|avatar|separator|divider|^hr$|^br$|icon$/i

const COLOR_NAME = /colou?r|background|\bbg\b|fill|stroke|tint|shade/i

function parseUnion(type: string): string[] | null {
  const parts = type.split('|').map((p) => p.trim())
  if (parts.length < 2) return null
  const literals = parts.map((p) => /^"(.*)"$/.exec(p)?.[1]).filter((v): v is string => v != null)
  return literals.length === parts.length ? literals : null
}

// Array props holding pictures (carousels, galleries, parallax walls). These
// get an upload control so the animation can run on the user's own photos.
const IMAGE_LIST_NAME = /^(images|projects|photos|slides|cards)$/i
// Single image-source string props (e.g. ClipDiv's imgSrc).
const IMAGE_NAME = /(img|image|photo|poster|avatar|thumbnail)/i

function imageListControl(prop: PropSpec): ControlSpec | null {
  if (!IMAGE_LIST_NAME.test(prop.name)) return null
  if (!prop.type.includes('[]') && !prop.type.includes('Array<')) return null
  let imageKeys: string[] | undefined
  if (prop.type.includes('{')) {
    // Element objects name their picture field either `src` or `image`.
    const srcKey = prop.type.includes('src') ? 'src' : prop.type.includes('image') ? 'image' : null
    if (!srcKey) return null
    imageKeys = [srcKey]
    if (/\bid\b/.test(prop.type)) imageKeys.push('id')
    if (prop.type.includes('alt')) imageKeys.push('alt')
    if (prop.type.includes('title')) imageKeys.push('title')
    if (prop.type.includes('code')) imageKeys.push('code')
  }
  return {
    name: prop.name,
    kind: 'images',
    required: prop.required,
    imageKeys,
    description: prop.description,
  }
}

function controlFor(prop: PropSpec): ControlSpec | null {
  if (SKIP_PROPS.has(prop.name)) return null
  if (SKIP_PATTERNS.some((re) => re.test(prop.name))) return null
  const imageList = imageListControl(prop)
  if (imageList) return imageList
  if (UNEDITABLE.some((frag) => prop.type.includes(frag))) return null
  if (IMAGE_NAME.test(prop.name) && prop.type.includes('string') && !parseUnion(prop.type)) {
    return {
      name: prop.name,
      kind: 'image',
      required: prop.required,
      defaultValue: unquote(prop.defaultValue),
      description: prop.description,
    }
  }

  const base = { name: prop.name, required: prop.required, description: prop.description }
  const options = parseUnion(prop.type)
  if (options) {
    return { ...base, kind: 'select', options, defaultValue: unquote(prop.defaultValue) }
  }
  if (prop.type === 'boolean') {
    // Only carry a default the component actually declared — synthesizing
    // `false` here would make inherited DOM flags (defaultChecked, …) look
    // component-authored and surface them as primary controls.
    return {
      ...base,
      kind: 'boolean',
      defaultValue: prop.defaultValue != null ? prop.defaultValue === 'true' : undefined,
    }
  }
  if (/\bnumber\b/.test(prop.type)) {
    const n = prop.defaultValue != null ? Number(prop.defaultValue) : undefined
    return { ...base, kind: 'number', defaultValue: Number.isFinite(n) ? n : undefined }
  }
  if (prop.type.includes('string')) {
    const kind: ControlKind = COLOR_NAME.test(prop.name) ? 'color' : 'text'
    return { ...base, kind, defaultValue: unquote(prop.defaultValue) }
  }
  return null
}

function unquote(value: string | undefined): string | undefined {
  if (value == null) return undefined
  return /^"(.*)"$/.exec(value)?.[1] ?? value
}

/**
 * Controls for a component: its editable props, plus an injected `children`
 * text control for components that take children (docgen usually filters
 * `children` out because it comes from node_modules types).
 */
export function deriveControls(entry: RegistryEntry): ControlSpec[] {
  const controls = entry.props
    .map(controlFor)
    .filter((c): c is ControlSpec => c != null)

  // A prop the component author documented, defaulted, or requires is a real
  // design control; anything else (inherited plumbing that survived the
  // filters) collapses under "Advanced" so the panel stays scannable.
  for (const c of controls) {
    c.advanced = !(c.description || c.defaultValue !== undefined || c.required)
  }
  // If nothing qualifies as primary (imported components without JSDoc),
  // don't bury everything — promote them all.
  if (controls.length > 0 && controls.every((c) => c.advanced)) {
    for (const c of controls) c.advanced = false
  }
  controls.sort((a, b) => Number(a.advanced) - Number(b.advanced))

  // Inject a `children` text control only when the component has no other
  // text-bearing prop to drive its content (docgen usually filters `children`
  // out). Components with their own text props (title, label, …) don't need it.
  const hasContentControl = controls.some((c) => c.name === 'children' || c.kind === 'text')
  if (!hasContentControl && !VOID_LIKE.test(entry.name)) {
    controls.unshift({
      name: 'children',
      kind: 'text',
      required: false,
      defaultValue: entry.name,
    })
  }
  return controls
}

/** Initial args object seeded from control defaults and synthesized required values. */
export function initialArgs(controls: ControlSpec[]): Record<string, unknown> {
  const args: Record<string, unknown> = {}
  for (const c of controls) {
    if (c.defaultValue !== undefined) args[c.name] = c.defaultValue
    else if (c.required) args[c.name] = synthesize(c)
  }
  return args
}

function synthesize(control: ControlSpec): unknown {
  switch (control.kind) {
    case 'select':
      return control.options?.[0]
    case 'number':
      return 16
    case 'boolean':
      return false
    case 'color':
      return '#7c6fff'
    default:
      return prettyLabel(control.name)
  }
}

function prettyLabel(name: string): string {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())
}

/**
 * Compose the final props object posted to the preview harness: the edited
 * args, plus the Style-tab overrides folded into `style` and `children`.
 */
export function composeRenderProps(
  args: Record<string, unknown>,
  style: StyleOverride = {},
): Record<string, unknown> {
  const cssStyle: Record<string, unknown> = {}
  if (style.color) cssStyle.color = style.color
  if (style.backgroundColor) cssStyle.background = style.backgroundColor
  if (style.fontFamily) cssStyle.fontFamily = style.fontFamily
  if (style.fontWeight) cssStyle.fontWeight = style.fontWeight
  if (style.fontSize != null) cssStyle.fontSize = style.fontSize

  const props: Record<string, unknown> = { ...args }
  if (style.text != null && style.text !== '') props.children = style.text
  if (Object.keys(cssStyle).length > 0) props.style = cssStyle
  return props
}
