import type { AnimConfig } from '../lib/canvas'
import { ANIM_PRESETS, ANIM_TRIGGERS, DEFAULT_ANIM, EASINGS, presetById } from '../lib/animation'

/**
 * Animation tab: fine-tune the instance's applied animation — effect,
 * trigger (which REAL user interaction plays it), duration/delay/easing.
 * Presets are usually applied from the Animations library menu; this tab
 * edits the details.
 */
export function AnimationTab({
  value,
  onChange,
  onReplay,
}: {
  value: AnimConfig | undefined
  onChange: (next: AnimConfig) => void
  onReplay: () => void
}) {
  const anim = value ?? DEFAULT_ANIM
  const set = <K extends keyof AnimConfig>(key: K, v: AnimConfig[K]) =>
    onChange({ ...anim, [key]: v })

  const inputClass =
    'w-full rounded-md px-2.5 py-1.5 text-xs bg-input border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring'

  const trigger = anim.trigger ?? 'entrance'
  const triggerHint = ANIM_TRIGGERS.find((t) => t.id === trigger)?.hint

  return (
    <div>
      <Field label="Effect">
        <select
          value={anim.preset}
          onChange={(e) => {
            const preset = e.target.value
            const def = presetById(preset)
            onChange({
              ...anim,
              preset,
              // Adopt the effect's natural trigger/duration when switching
              ...(def ? { trigger: def.defaultTrigger, duration: def.duration } : {}),
            })
          }}
          className={inputClass}
        >
          {ANIM_PRESETS.map((p) => (
            <option key={p} value={p}>
              {p === 'none' ? 'none' : (presetById(p)?.name ?? p)}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Trigger">
        <select
          value={trigger}
          onChange={(e) => set('trigger', e.target.value as AnimConfig['trigger'])}
          disabled={anim.preset === 'none'}
          className={`${inputClass} disabled:opacity-50`}
        >
          {ANIM_TRIGGERS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        {triggerHint && anim.preset !== 'none' && (
          <p className="text-[10px] text-muted-foreground mt-1">{triggerHint}</p>
        )}
      </Field>

      {trigger === 'scroll' && anim.preset !== 'none' && (
        <Field label="Repeat">
          <label className="flex items-center gap-2 text-[11px] text-foreground">
            <input
              type="checkbox"
              checked={!(anim.once ?? true)}
              onChange={(e) => set('once', !e.target.checked)}
            />
            Replay every time it re-enters the viewport
          </label>
        </Field>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Field label="Duration (s)">
          <input
            type="number"
            step="0.05"
            min="0"
            value={anim.duration}
            onChange={(e) => set('duration', Number(e.target.value))}
            className={inputClass}
          />
        </Field>
        <Field label="Delay (s)">
          <input
            type="number"
            step="0.05"
            min="0"
            value={anim.delay}
            onChange={(e) => set('delay', Number(e.target.value))}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Easing">
        <select
          value={anim.easing}
          onChange={(e) => set('easing', e.target.value)}
          className={inputClass}
        >
          {EASINGS.includes(anim.easing) ? null : (
            <option value={anim.easing}>{anim.easing}</option>
          )}
          {EASINGS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </Field>

      <button
        type="button"
        onClick={onReplay}
        disabled={anim.preset === 'none'}
        className="w-full mt-1 px-3 py-2 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-default transition-colors"
      >
        ▶ Preview animation
      </button>
      {anim.preset !== 'none' && trigger !== 'entrance' && (
        <p className="text-[10px] text-muted-foreground mt-2">
          Or trigger it for real ({triggerHint}) — the selected instance is live on the canvas.
        </p>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <p className="text-[11px] font-medium text-foreground mb-1">{label}</p>
      {children}
    </div>
  )
}
