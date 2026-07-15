import type { StyleOverride } from './controls'

/**
 * Per-instance animation config. `trigger` decides which REAL user
 * interaction plays the effect (entrance render, pointer hover, click, or
 * scrolling into view); older configs without a trigger behave as entrance.
 */
export interface AnimConfig {
  preset: string
  trigger?: 'entrance' | 'hover' | 'click' | 'scroll'
  duration: number
  delay: number
  easing: string
  /** For scroll: play only the first time it enters the viewport */
  once?: boolean
}

/**
 * A component placed on the Canvas: a reference to a registry entry plus its
 * position and per-instance edits (plan §5.4 composition node). The registry
 * entry stays the source of truth for props/preview; the instance only carries
 * what the user changed.
 */
export interface Instance {
  id: string
  /** RegistryEntry.id this instance renders */
  entryId: string
  x: number
  y: number
  /** Horizontal scale — corners scale both axes together, side handles stretch this one; default 1 */
  scaleX?: number
  /** Vertical scale; default 1 */
  scaleY?: number
  /** Rotation in degrees (rotate handle); default 0 */
  rotation?: number
  args: Record<string, unknown>
  style: StyleOverride
  anim?: AnimConfig
  /** Bumped to replay the animation without other edits */
  replay?: number
  /** Page this instance navigates to when clicked (exported as a real link) */
  linkTo?: string
  /**
   * Interaction effect attached to this instance (magnetic, ripple, tilt, …).
   * Behaviors, not components — they wrap the rendered host element.
   */
  fx?: { id: string; accent?: string; text?: string }
  /**
   * Per-button navigation: components can expose named link slots
   * (data-link-slot on individual buttons) — each slot can lead to its own
   * page. Falls back to `linkTo` for clicks outside any slot.
   */
  links?: Record<string, string>
}

/**
 * A page of the composition. The canvas edits one page at a time; the Pages
 * view shows all of them as connected nodes (edges = instance links).
 */
/** Page-level effects: what shows while the page loads, and the cursor. */
export interface PageFx {
  /** Loading-screen loader id (lib/pagefx.ts), undefined = none */
  loader?: string
  /** Loader accent color */
  loaderAccent?: string
  /** How long the loading screen stays up (ms) */
  loaderMs?: number
  /** Cursor effect id, undefined = default cursor */
  cursor?: string
  /** Cursor accent color */
  cursorAccent?: string
}

export interface Page {
  id: string
  name: string
  instances: Instance[]
  /** Page-level effects (loading screen, cursor) */
  fx?: PageFx
  /** Node position in the Pages graph view */
  nodeX: number
  nodeY: number
}

let counter = 0
export function newInstanceId(): string {
  counter += 1
  return `inst-${counter}-${Date.now().toString(36)}`
}

let pageCounter = 0
export function newPageId(): string {
  pageCounter += 1
  return `page-${pageCounter}-${Date.now().toString(36)}`
}

/** URL-safe slug for a page (hash-router target in the export). */
export function pageSlug(page: Page): string {
  const base = page.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return base || page.id
}
