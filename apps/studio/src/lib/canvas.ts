import type { StyleOverride } from './controls'

/** Per-instance animation config (Phase 6 fills the Animation tab). */
export interface AnimConfig {
  preset: string
  duration: number
  delay: number
  easing: string
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
}

let counter = 0
export function newInstanceId(): string {
  counter += 1
  return `inst-${counter}-${Date.now().toString(36)}`
}
