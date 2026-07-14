import { ANIM_TRIGGERS, ANIMATIONS, type AnimPresetDef } from '../lib/animation'

const TRIGGER_BADGE: Record<string, string> = {
  entrance: 'bg-sky-500/15 text-sky-300',
  hover: 'bg-violet-500/15 text-violet-300',
  click: 'bg-amber-500/15 text-amber-300',
  scroll: 'bg-emerald-500/15 text-emerald-300',
}

/**
 * The Animations library: trigger-based motion presets applied ON TOP of a
 * component. Workflow: place a component on the canvas first, select it, then
 * click a preset here — the effect then plays on the real interaction
 * (entrance / hover / click / scroll-into-view). Fine-tuning lives in the
 * Configure panel's Animation tab.
 */
export function AnimationsMenu({
  canApply,
  appliedPreset,
  onApply,
  onClear,
}: {
  /** True when a canvas instance is selected */
  canApply: boolean
  /** Preset id currently applied to the selection (for highlighting) */
  appliedPreset?: string
  onApply: (preset: AnimPresetDef) => void
  onClear: () => void
}) {
  return (
    <div className="flex-1 overflow-y-auto px-2 pb-3">
      <p className="text-[10px] text-muted-foreground px-1 py-2">
        {canApply
          ? 'Click an animation to apply it to the selected component.'
          : 'Select a component on the canvas, then click an animation to apply it.'}
      </p>
      <div className="grid grid-cols-1 gap-1.5">
        {ANIMATIONS.map((a) => {
          const applied = appliedPreset === a.id
          return (
            <button
              key={a.id}
              type="button"
              disabled={!canApply}
              onClick={() => onApply(a)}
              className={`text-left rounded-lg border px-2.5 py-2 transition-colors disabled:opacity-45 disabled:cursor-default ${
                applied
                  ? 'border-primary/50 bg-secondary'
                  : 'border-border/50 bg-muted/20 hover:border-border hover:bg-secondary/40'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium">{a.name}</span>
                <span
                  className={`ml-auto text-[8px] font-semibold uppercase tracking-wider px-1 py-0.5 rounded ${TRIGGER_BADGE[a.defaultTrigger]}`}
                >
                  {ANIM_TRIGGERS.find((t) => t.id === a.defaultTrigger)?.label}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">{a.description}</p>
            </button>
          )
        })}
      </div>
      {canApply && appliedPreset && appliedPreset !== 'none' && (
        <button
          type="button"
          onClick={onClear}
          className="w-full mt-2 px-2 py-1.5 rounded-md text-[11px] text-muted-foreground border border-border/50 hover:text-foreground hover:border-border transition-colors"
        >
          Remove animation
        </button>
      )}
    </div>
  )
}
