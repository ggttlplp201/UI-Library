export interface AvatarChipProps {
  /** Person's name; the initial seeds the avatar */
  name?: string
}

/** Compact avatar + name chip. */
export function AvatarChip({ name = 'Sarah Kim' }: AvatarChipProps) {
  return (
    <div className="bg-card rounded-full pl-1 pr-3 py-1 border border-border inline-flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-white">
        {(name.charAt(0) || '?').toUpperCase()}
      </div>
      <span className="text-fg text-[13px]">{name}</span>
    </div>
  )
}
