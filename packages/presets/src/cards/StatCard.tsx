export interface StatCardProps {
  /** Metric label */
  label?: string
  /** Primary metric value */
  value?: string
  /** Change indicator shown below the value */
  delta?: string
  /** Card background (defaults to the theme card color) */
  background?: string
  /** Value text color (defaults to the theme foreground) */
  color?: string
}

/** KPI stat card: label, big value, and a change delta. */
export function StatCard({
  label = 'Monthly Revenue',
  value = '$48,291',
  delta = '18.2% this month',
  background,
  color,
}: StatCardProps) {
  return (
    <div
      className="bg-card rounded-xl p-4 border border-border min-w-[160px]"
      style={background ? { background, borderColor: 'rgba(128,128,128,0.25)' } : undefined}
    >
      <div className="text-[11px] text-muted-foreground/70 mb-1.5" style={color ? { color, opacity: 0.55 } : undefined}>
        {label}
      </div>
      <div className="text-2xl font-bold text-card-foreground tracking-tight" style={color ? { color } : undefined}>
        {value}
      </div>
      <div className="text-xs text-success mt-1.5">↑ {delta}</div>
    </div>
  )
}
