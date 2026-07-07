import type { ControlSpec } from '../../lib/controls'

export function ControlInput({
  control,
  value,
  onChange,
}: {
  control: ControlSpec
  value: unknown
  onChange: (value: unknown) => void
}) {
  const label = (
    <label className="flex items-center justify-between gap-2 mb-1">
      <span className="text-[11px] font-medium text-foreground truncate" title={control.description}>
        {control.name}
        {control.required && <span className="text-destructive"> *</span>}
      </span>
      <span className="text-[9px] font-mono text-muted-foreground">{control.kind}</span>
    </label>
  )

  return (
    <div className="mb-3">
      {label}
      {renderInput(control, value, onChange)}
    </div>
  )
}

function renderInput(control: ControlSpec, value: unknown, onChange: (value: unknown) => void) {
  const inputClass =
    'w-full rounded-md px-2.5 py-1.5 text-xs bg-input border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring'

  switch (control.kind) {
    case 'select':
      return (
        <select
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        >
          {!control.required && <option value="">—</option>}
          {control.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )
    case 'boolean':
      return (
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`relative w-9 h-5 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-secondary'}`}
          role="switch"
          aria-checked={Boolean(value)}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-4' : ''}`}
          />
        </button>
      )
    case 'number':
      return (
        <input
          type="number"
          value={value == null ? '' : Number(value)}
          onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
          className={inputClass}
        />
      )
    case 'color':
      return (
        <div className="flex gap-2">
          <input
            type="color"
            value={typeof value === 'string' && value.startsWith('#') ? value : '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded border border-border bg-input p-0.5 shrink-0"
          />
          <input
            type="text"
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#hex or css color"
            className={inputClass}
          />
        </div>
      )
    default:
      return (
        <input
          type="text"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )
  }
}
