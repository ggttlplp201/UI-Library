import type { AnimConfig } from '../lib/canvas'
import { ANIM_PRESETS, DEFAULT_ANIM, EASINGS } from '../lib/animation'

/**
 * Animation tab (plan §5.5): pick a GSAP entrance preset plus duration/delay/
 * easing. Edits update the instance's anim config, which the preview harness
 * replays via GSAP. "Play" re-triggers the animation without other edits.
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

  return (
    <div>
      <Field label="Preset">
        <select
          value={anim.preset}
          onChange={(e) => set('preset', e.target.value)}
          className={inputClass}
        >
          {ANIM_PRESETS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </Field>

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
          disabled={anim.preset === 'bounce'}
          className={`${inputClass} disabled:opacity-50`}
        >
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
        ▶ Play animation
      </button>
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
