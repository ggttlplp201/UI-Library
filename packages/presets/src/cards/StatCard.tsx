export interface StatCardProps {
  /** Metric label */
  label?: string
  /** Primary metric value */
  value?: string
  /** Change indicator shown below the value */
  delta?: string
}

/** KPI stat card: label, big value, and a change delta. */
export function StatCard({
  label = 'Monthly Revenue',
  value = '$48,291',
  delta = '18.2% this month',
}: StatCardProps) {
  return (
    <div className="bg-card rounded-xl p-4 border border-border min-w-[160px]">
      <div className="text-[11px] text-muted/70 mb-1.5">{label}</div>
      <div className="text-2xl font-bold text-fg tracking-tight">{value}</div>
      <div className="text-xs text-success mt-1.5">↑ {delta}</div>
    </div>
  )
}
