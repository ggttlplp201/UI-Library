interface ButtonProps {
  /** The label shown inside the button */
  label: string
  variant?: 'solid' | 'outline'
  size?: number
  className?: string
}

/** A plain presentational button. */
export function Button({ label, variant = 'solid', size = 14, className }: ButtonProps) {
  return (
    <button type="button" data-variant={variant} style={{ fontSize: size }} className={className}>
      {label}
    </button>
  )
}
