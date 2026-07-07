import type { AnimConfig } from './canvas'

/** GSAP entrance presets, mirrored by ANIM_FROM in the preview harness. */
export const ANIM_PRESETS = ['none', 'fade', 'slide-up', 'scale', 'bounce'] as const
export type AnimPreset = (typeof ANIM_PRESETS)[number]

/** GSAP eases exposed in the Animation tab (bounce ignores this). */
export const EASINGS = ['power2.out', 'power2.in', 'power2.inOut', 'none', 'back.out(1.7)']

export const DEFAULT_ANIM: AnimConfig = {
  preset: 'fade',
  duration: 0.5,
  delay: 0,
  easing: 'power2.out',
}
