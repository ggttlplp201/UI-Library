import type { StyleOverride } from '../lib/controls'
import { WEB_FONTS } from '../lib/fonts'

const FONT_FAMILIES = WEB_FONTS

const FONT_WEIGHTS = ['', '300', '400', '500', '600', '700', '800']

/**
 * CSS-level style overrides (plan §5.5 Style tab): text content, color,
 * background, font family/weight/size. Applied to the component via the
 * `style` prop, independent of its argTypes.
 */
export function StyleTab({
  value,
  onChange,
}: {
  value: StyleOverride
  onChange: (next: StyleOverride) => void
}) {
  const set = <K extends keyof StyleOverride>(key: K, v: StyleOverride[K]) =>
    onChange({ ...value, [key]: v })

  const inputClass =
    'w-full rounded-md px-2.5 py-1.5 text-xs bg-input border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring'

  return (
    <div>
      <Field label="Text content">
        <input
          type="text"
          value={value.text ?? ''}
          onChange={(e) => set('text', e.target.value || undefined)}
          placeholder="override rendered text"
          className={inputClass}
        />
      </Field>

      <Field label="Text color">
        <ColorRow value={value.color} onChange={(v) => set('color', v)} />
      </Field>

      <Field label="Background">
        <ColorRow value={value.backgroundColor} onChange={(v) => set('backgroundColor', v)} />
      </Field>

      <Field label="Font family">
        <select
          value={value.fontFamily ?? ''}
          onChange={(e) => set('fontFamily', e.target.value || undefined)}
          className={inputClass}
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f.label} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Font weight">
          <select
            value={value.fontWeight ?? ''}
            onChange={(e) => set('fontWeight', e.target.value || undefined)}
            className={inputClass}
          >
            {FONT_WEIGHTS.map((w) => (
              <option key={w} value={w}>
                {w || 'Default'}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Font size (px)">
          <input
            type="number"
            value={value.fontSize ?? ''}
            onChange={(e) => set('fontSize', e.target.value === '' ? undefined : Number(e.target.value))}
            placeholder="—"
            className={inputClass}
          />
        </Field>
      </div>
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

function ColorRow({ value, onChange }: { value?: string; onChange: (v: string | undefined) => void }) {
  const inputClass =
    'w-full rounded-md px-2.5 py-1.5 text-xs bg-input border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring'
  return (
    <div className="flex gap-2">
      <input
        type="color"
        value={value && value.startsWith('#') ? value : '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded border border-border bg-input p-0.5 shrink-0"
      />
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        placeholder="—"
        className={inputClass}
      />
    </div>
  )
}
