export interface StatusBadgeProps {
  /** Status label */
  label?: string
  /** Semantic status, drives the dot and tint color */
  status?: 'active' | 'idle' | 'error'
}

const STATUS_COLOR: Record<NonNullable<StatusBadgeProps['status']>, string> = {
  active: '#22c55e',
  idle: '#f59e0b',
  error: '#ef4444',
}

/** Dot + label badge that reflects a semantic status. */
export function StatusBadge({ label = 'Active', status = 'active' }: StatusBadgeProps) {
  const color = STATUS_COLOR[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium"
      style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  )
}
