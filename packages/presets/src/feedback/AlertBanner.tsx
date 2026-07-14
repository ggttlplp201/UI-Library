export interface AlertBannerProps {
  /** Alert message */
  children?: React.ReactNode
}

/** Success alert banner with a check icon. */
export function AlertBanner({ children = 'Changes saved successfully' }: AlertBannerProps) {
  return (
    <div className="rounded-lg px-3.5 py-2.5 border border-success/20 bg-success/5 flex gap-2.5 items-start min-w-[230px]">
      <span className="text-success leading-none mt-px">✓</span>
      <span className="text-card-foreground text-[13px] leading-relaxed">{children}</span>
    </div>
  )
}
