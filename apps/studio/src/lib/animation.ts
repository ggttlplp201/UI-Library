import type { AnimConfig } from './canvas'

/**
 * Animation preset catalog. Every effect is defined as CSS keyframes so the
 * preview harness and the static HTML export reproduce EXACTLY the same
 * motion, and every trigger fires on a real user interaction:
 *
 *   entrance — when the component (re)renders / the page loads
 *   hover    — when the user's pointer enters the component
 *   click    — when the user clicks the component
 *   scroll   — when the user scrolls it into view
 *
 * The Animations library menu lists this catalog; clicking a preset applies
 * it to the selected canvas instance (per-instance `AnimConfig`).
 */

export type AnimTrigger = 'entrance' | 'hover' | 'click' | 'scroll'

export const ANIM_TRIGGERS: { id: AnimTrigger; label: string; hint: string }[] = [
  { id: 'entrance', label: 'Entrance', hint: 'plays when the page loads' },
  { id: 'hover', label: 'Hover', hint: 'plays when the pointer enters' },
  { id: 'click', label: 'Click', hint: 'plays when clicked' },
  { id: 'scroll', label: 'Scroll into view', hint: 'plays when scrolled into view' },
]

export interface AnimPresetDef {
  id: string
  name: string
  description: string
  /** Trigger preselected when the preset is applied from the Animations menu */
  defaultTrigger: AnimTrigger
  /** Body of the @keyframes block (from/to or percentage steps) */
  keyframes: string
  /** Default duration in seconds */
  duration: number
}

export const ANIMATIONS: AnimPresetDef[] = [
  {
    id: 'fade',
    name: 'Fade in',
    description: 'Opacity 0 → 1',
    defaultTrigger: 'entrance',
    duration: 0.5,
    keyframes: `from { opacity: 0; } to { opacity: 1; }`,
  },
  {
    id: 'slide-up',
    name: 'Slide up',
    description: 'Rises 24px while fading in',
    defaultTrigger: 'entrance',
    duration: 0.5,
    keyframes: `from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); }`,
  },
  {
    id: 'slide-down',
    name: 'Slide down',
    description: 'Drops 24px while fading in',
    defaultTrigger: 'entrance',
    duration: 0.5,
    keyframes: `from { opacity: 0; transform: translateY(-24px); } to { opacity: 1; transform: translateY(0); }`,
  },
  {
    id: 'slide-left',
    name: 'Slide from right',
    description: 'Slides in from the right',
    defaultTrigger: 'entrance',
    duration: 0.5,
    keyframes: `from { opacity: 0; transform: translateX(32px); } to { opacity: 1; transform: translateX(0); }`,
  },
  {
    id: 'scale',
    name: 'Zoom in',
    description: 'Scales 0.8 → 1 while fading in',
    defaultTrigger: 'entrance',
    duration: 0.5,
    keyframes: `from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); }`,
  },
  {
    id: 'bounce',
    name: 'Bounce in',
    description: 'Drops in and bounces to rest',
    defaultTrigger: 'entrance',
    duration: 0.7,
    keyframes: `0% { opacity: 0; transform: translateY(-24px); } 55% { opacity: 1; transform: translateY(6px); } 75% { transform: translateY(-3px); } 90% { transform: translateY(1px); } 100% { opacity: 1; transform: translateY(0); }`,
  },
  {
    id: 'pop',
    name: 'Pop',
    description: 'Quick 1 → 1.12 → 1 scale pulse',
    defaultTrigger: 'hover',
    duration: 0.3,
    keyframes: `0% { transform: scale(1); } 50% { transform: scale(1.12); } 100% { transform: scale(1); }`,
  },
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'Gentle breathing scale + opacity',
    defaultTrigger: 'hover',
    duration: 0.8,
    keyframes: `0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.04); opacity: 0.85; } 100% { transform: scale(1); opacity: 1; }`,
  },
  {
    id: 'shake',
    name: 'Shake',
    description: 'Horizontal jitter (great on click)',
    defaultTrigger: 'click',
    duration: 0.45,
    keyframes: `0%,100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(3px); }`,
  },
  {
    id: 'wiggle',
    name: 'Wiggle',
    description: 'Playful rotation jitter',
    defaultTrigger: 'hover',
    duration: 0.5,
    keyframes: `0%,100% { transform: rotate(0deg); } 25% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } 75% { transform: rotate(-2deg); }`,
  },
  {
    id: 'spin',
    name: 'Spin',
    description: 'Full 360° rotation',
    defaultTrigger: 'click',
    duration: 0.6,
    keyframes: `from { transform: rotate(0deg); } to { transform: rotate(360deg); }`,
  },
  {
    id: 'float',
    name: 'Float',
    description: 'Soft levitation dip and rise',
    defaultTrigger: 'scroll',
    duration: 1.2,
    keyframes: `0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); }`,
  },
]

export const presetById = (id: string): AnimPresetDef | undefined =>
  ANIMATIONS.find((a) => a.id === id)

/** Preset ids for selects; 'none' clears the animation. */
export const ANIM_PRESETS = ['none', ...ANIMATIONS.map((a) => a.id)]

/**
 * Easing options. Values are CSS timing functions; the legacy GSAP names from
 * older saved configs map through EASING_CSS so existing instances keep
 * working.
 */
export const EASINGS = ['ease-out', 'ease-in', 'ease-in-out', 'linear', 'overshoot']

export const EASING_CSS: Record<string, string> = {
  'ease-out': 'ease-out',
  'ease-in': 'ease-in',
  'ease-in-out': 'ease-in-out',
  linear: 'linear',
  overshoot: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  // legacy GSAP names
  'power2.out': 'cubic-bezier(0.22, 1, 0.36, 1)',
  'power2.in': 'cubic-bezier(0.64, 0, 0.78, 0)',
  'power2.inOut': 'cubic-bezier(0.65, 0, 0.35, 1)',
  none: 'linear',
  'back.out(1.7)': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
}

export const DEFAULT_ANIM: AnimConfig = {
  preset: 'fade',
  trigger: 'entrance',
  duration: 0.5,
  delay: 0,
  easing: 'ease-out',
  once: true,
}

/**
 * Everything the preview harness / HTML export needs to run one instance's
 * animation: a namespaced @keyframes block and the `animation` shorthand.
 * Returns null for none/unknown presets.
 */
export function compileAnim(
  anim: AnimConfig | undefined,
): {
  name: string
  keyframesCss: string
  animationValue: string
  trigger: AnimTrigger
  once: boolean
} | null {
  if (!anim || !anim.preset || anim.preset === 'none') return null
  const def = presetById(anim.preset)
  if (!def) return null
  const name = `css-anim-${def.id}`
  const easing = EASING_CSS[anim.easing] ?? anim.easing ?? 'ease-out'
  const duration = anim.duration ?? def.duration
  const delay = anim.delay ?? 0
  return {
    name,
    keyframesCss: `@keyframes ${name} { ${def.keyframes} }`,
    animationValue: `${name} ${duration}s ${easing} ${delay}s both`,
    trigger: (anim.trigger as AnimTrigger) ?? 'entrance',
    once: anim.once ?? true,
  }
}
