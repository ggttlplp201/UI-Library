import { newInstanceId, type Instance, type Page } from '../canvas'

/**
 * A prebuilt sample project: pure data over the existing Page/Instance model,
 * opened as a normal editable workspace (own storage key, previewable,
 * exportable). Instances referencing a preset that no longer exists are
 * skipped by the canvas (entryById returns undefined), so samples degrade
 * gracefully as the library evolves.
 */
export interface SampleProject {
  /** Stable id — also the workspace storage-key suffix */
  id: string
  title: string
  /** One-line card description */
  tagline: string
  /** Card accent (chip + hover) */
  accent: string
  /** Longer blurb for the card footer */
  detail: string
  /** Fresh pages (new instance/page ids per open) */
  build: () => Page[]
}

/** Instance shorthand for sample definitions. */
export const inst = (
  entryId: string,
  x: number,
  y: number,
  extra: Partial<Instance> = {},
): Instance => ({
  id: newInstanceId(),
  entryId,
  x,
  y,
  args: {},
  style: {},
  ...extra,
})

/** Preset entry id from path + export ("src/buttons/ShimmerButton.tsx#ShimmerButton"). */
export const preset = (file: string, exportName?: string): string => {
  const base = file.replace(/^\/?/, '')
  const name = exportName ?? base.split('/').pop()!.replace(/\.tsx$/, '')
  return `${base}#${name}`
}
