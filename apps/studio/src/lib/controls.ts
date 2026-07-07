import type { PropSpec, RegistryEntry } from '@component-style-studio/registry'

/**
 * argType-style control derivation (plan Phase 2). Each editable prop becomes a
 * typed control the Controls panel renders an input for, mirroring Storybook's
 * Controls model without depending on Storybook.
 */
export type ControlKind = 'text' | 'number' | 'boolean' | 'select' | 'color'

export interface ControlSpec {
  name: string
  kind: ControlKind
  required: boolean
  /** Options for `select`, parsed from a string-literal union type */
  options?: string[]
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
const SKIP_PROPS = new Set(['className', 'style', 'ref', 'key', 'asChild'])

// Type fragments that mark a prop as non-trivially editable (functions, elements).
const UNEDITABLE = ['=>', 'ReactElement', 'ComponentRenderFn', 'EventHandler', 'MouseEvent', 'ReactNode']

// Components that render a void/childless host element — don't inject children.
const VOID_LIKE = /input|image|img|avatar|separator|divider|^hr$|^br$|icon$/i

const COLOR_NAME = /colou?r|background|\bbg\b|fill|stroke|tint|shade/i

function parseUnion(type: string): string[] | null {
  const parts = type.split('|').map((p) => p.trim())
  if (parts.length < 2) return null
  const literals = parts.map((p) => /^"(.*)"$/.exec(p)?.[1]).filter((v): v is string => v != null)
  return literals.length === parts.length ? literals : null
}

function controlFor(prop: PropSpec): ControlSpec | null {
  if (SKIP_PROPS.has(prop.name)) return null
  if (UNEDITABLE.some((frag) => prop.type.includes(frag))) return null

  const base = { name: prop.name, required: prop.required, description: prop.description }
  const options = parseUnion(prop.type)
  if (options) {
    return { ...base, kind: 'select', options, defaultValue: unquote(prop.defaultValue) }
  }
  if (prop.type === 'boolean') {
    return { ...base, kind: 'boolean', defaultValue: prop.defaultValue === 'true' }
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
