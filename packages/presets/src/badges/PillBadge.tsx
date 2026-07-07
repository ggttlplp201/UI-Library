export interface PillBadgeProps {
  /** Badge label */
  children?: React.ReactNode
}

/** Uppercase accent pill for tags and labels. */
export function PillBadge({ children = 'New Feature' }: PillBadgeProps) {
  return (
    <span className="bg-primary/15 text-primary text-[11px] font-semibold tracking-[0.06em] uppercase rounded-full px-2.5 py-1 inline-block">
      {children}
    </span>
  )
}
