export interface GhostButtonProps {
  /** Button label */
  children?: React.ReactNode
}

/** Low-emphasis outlined button. */
export function GhostButton({ children = 'Learn More' }: GhostButtonProps) {
  return (
    <button
      type="button"
      className="bg-transparent text-muted text-sm font-medium rounded-lg px-5 py-2 border border-white/15 whitespace-nowrap"
    >
      {children}
    </button>
  )
}
