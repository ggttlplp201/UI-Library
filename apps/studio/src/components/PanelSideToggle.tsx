export type PanelSide = 'left' | 'right'

/** Small button that flips a dock panel to the other side of the canvas. */
export function PanelSideToggle({ side, onToggle }: { side: PanelSide; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={`Move to ${side === 'left' ? 'right' : 'left'} side`}
      className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-[11px] leading-none"
    >
      {side === 'left' ? '⇥' : '⇤'}
    </button>
  )
}
