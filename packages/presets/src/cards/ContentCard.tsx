export interface ContentCardProps {
  /** Card heading */
  title?: string
  /** Supporting body text */
  description?: string
}

/** Titled content card with supporting description. */
export function ContentCard({
  title = 'Card Title',
  description = 'Supporting description text for this card.',
}: ContentCardProps) {
  return (
    <div className="bg-card rounded-xl p-4 border border-border min-w-[180px]">
      <div className="font-semibold text-sm text-fg mb-1.5">{title}</div>
      <div className="text-xs text-muted/80 leading-relaxed">{description}</div>
    </div>
  )
}
