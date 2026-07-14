export interface ProgressBarProps {
  /** Label shown above the track */
  label?: string
  /** Completion percentage (0–100) */
  value?: number
}

/** Labeled progress bar with a percentage readout. */
export function ProgressBar({ label = 'Uploading assets', value = 68 }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className="min-w-[200px]">
      <div className="flex justify-between mb-2 text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="bg-white/[0.08] rounded-full h-1.5 overflow-hidden">
        <div className="bg-primary h-full rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
