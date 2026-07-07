export interface PrimaryButtonProps {
  /** Button label */
  children?: React.ReactNode
}

/** Solid accent call-to-action button. */
export function PrimaryButton({ children = 'Get Started' }: PrimaryButtonProps) {
  return (
    <button
      type="button"
      className="bg-primary text-white text-sm font-medium rounded-lg px-5 py-2 whitespace-nowrap tracking-tight"
    >
      {children}
    </button>
  )
}
