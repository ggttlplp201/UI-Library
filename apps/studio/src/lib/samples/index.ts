import { arcRelay } from './arcRelay'
import { componentSystems } from './componentSystems'
import { controlRoom } from './controlRoom'
import { editorial } from './editorial'
import { motionLab } from './motionLab'
import type { SampleProject } from './types'

/** Gallery order — the flagship landing sample leads. */
export const SAMPLE_PROJECTS: SampleProject[] = [
  arcRelay,
  componentSystems,
  motionLab,
  controlRoom,
  editorial,
]

export const sampleById = (id: string | undefined): SampleProject | undefined =>
  SAMPLE_PROJECTS.find((s) => s.id === id)

export type { SampleProject } from './types'
