/** Result of one narrow transform: new source, or the input unchanged + why. */
export interface TransformResult {
  code: string
  changed: boolean
  reason?: string
}
