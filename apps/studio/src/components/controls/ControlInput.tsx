import { useRef } from 'react'
import type { ControlSpec } from '../../lib/controls'
import { fileLabel, fileToDataUrl, imageSrcOf, shapeImage } from '../../lib/images'

/** "shimmerDuration" → "Shimmer duration" — controls read like settings, not code. */
export function prettyControlName(name: string): string {
  const spaced = name
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase()
}

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
      <span
        className="text-[11px] font-medium text-foreground truncate"
        title={`${control.name}${control.description ? ' — ' + control.description : ''}`}
      >
        {prettyControlName(control.name)}
        {control.required && <span className="text-destructive"> *</span>}
      </span>
      <span className="text-[9px] font-mono text-muted-foreground">{control.kind}</span>
    </label>
  )

  return (
    <div className="mb-3">
      {label}
      {control.description && (
        <p className="text-[10px] leading-snug text-muted-foreground mb-1">{control.description}</p>
      )}
      {renderInput(control, value, onChange)}
    </div>
  )
}

function renderInput(control: ControlSpec, value: unknown, onChange: (value: unknown) => void) {
  const inputClass =
    'w-full rounded-md px-2.5 py-1.5 text-xs bg-input border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring'

  switch (control.kind) {
    case 'select': {
      const opts = control.options ?? []
      // A handful of options reads better as one-tap chips than a dropdown.
      if (opts.length > 0 && opts.length <= 4) {
        return (
          <div className="flex flex-wrap gap-1">
            {opts.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(opt)}
                className={`px-2 py-1 rounded-md text-[11px] border transition-colors ${
                  String(value ?? '') === opt
                    ? 'border-primary/60 bg-primary/15 text-foreground'
                    : 'border-border bg-input text-muted-foreground hover:text-foreground'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )
      }
      return (
        <select
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        >
          {!control.required && <option value="">—</option>}
          {opts.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )
    }
    case 'list': {
      // Row editor for string[] props (menu items, tab labels, words):
      // edit each row, remove with ×, append with + Add.
      const items = Array.isArray(value)
        ? (value as string[])
        : Array.isArray(control.defaultValue)
          ? (control.defaultValue as string[])
          : []
      const set = (next: string[]) => onChange(next)
      return (
        <div className="flex flex-col gap-1">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-1">
              <input
                value={item}
                onChange={(e) => set(items.map((x, j) => (j === i ? e.target.value : x)))}
                className={inputClass}
              />
              <button
                type="button"
                title="Remove row"
                onClick={() => set(items.filter((_, j) => j !== i))}
                className="shrink-0 w-6 h-6 rounded-md text-muted-foreground hover:text-destructive hover:bg-secondary text-xs"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => set([...items, `Item ${items.length + 1}`])}
            className="self-start px-2 py-1 rounded-md text-[11px] text-muted-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary"
          >
            + Add row
          </button>
        </div>
      )
    }
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
    case 'number': {
      // Slider + field: the range is inferred from the default so durations
      // get 0-few-seconds and pixel sizes get a sensible sweep.
      const cur = value == null ? Number(control.defaultValue ?? 0) : Number(value)
      const base = Math.abs(Number(control.defaultValue ?? cur ?? 10)) || 10
      const max = Math.max(Math.ceil(base * 4), cur, 1)
      const step = base <= 2 ? 0.1 : base <= 20 ? 1 : Math.ceil(base / 20)
      return (
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={max}
            step={step}
            value={Number.isFinite(cur) ? cur : 0}
            onChange={(e) => onChange(Number(e.target.value))}
            className="flex-1 accent-[#7c6fff]"
          />
          <input
            type="number"
            value={value == null ? '' : Number(value)}
            onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
            className={inputClass + ' !w-16 shrink-0'}
          />
        </div>
      )
    }
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
    case 'image':
      return <ImageInput value={value} onChange={onChange} />
    case 'images':
      return <ImageListInput control={control} value={value} onChange={onChange} />
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

const uploadButtonClass =
  'w-full rounded-md px-2.5 py-1.5 text-xs bg-secondary border border-border text-foreground hover:bg-secondary/70 transition-colors'

/** Single photo: upload replaces the component's bundled image. */
function ImageInput({ value, onChange }: { value: unknown; onChange: (value: unknown) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const src = imageSrcOf(value)
  return (
    <div className="flex items-center gap-2">
      {src && (
        <img
          src={src}
          alt=""
          className="w-8 h-8 rounded border border-border object-cover shrink-0"
        />
      )}
      <button type="button" onClick={() => fileRef.current?.click()} className={uploadButtonClass}>
        {src ? 'Replace photo…' : 'Upload photo…'}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (file) onChange(await fileToDataUrl(file))
        }}
      />
    </div>
  )
}

/**
 * Photo set for carousels / galleries / scroll walls: upload the user's own
 * photos and the component's animation runs on them. Empty = the component's
 * bundled sample images.
 */
function ImageListInput({
  control,
  value,
  onChange,
}: {
  control: ControlSpec
  value: unknown
  onChange: (value: unknown) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const items = Array.isArray(value) ? value : []
  // Async conversions read the freshest list, so a slow upload can't clobber
  // an add/remove that happened while files were being resized.
  const itemsRef = useRef(items)
  itemsRef.current = items
  return (
    <div>
      {items.length > 0 && (
        <div className="grid grid-cols-5 gap-1 mb-2">
          {items.map((item, i) => {
            const src = imageSrcOf(item)
            return (
              <button
                key={i}
                type="button"
                title="Remove photo"
                onClick={() => {
                  const next = items.filter((_, j) => j !== i)
                  onChange(next.length > 0 ? next : undefined)
                }}
                className="relative group/photo aspect-square rounded border border-border overflow-hidden bg-input"
              >
                {src && <img src={src} alt="" className="w-full h-full object-cover" />}
                <span className="absolute inset-0 hidden group-hover/photo:flex items-center justify-center bg-black/50 text-white text-xs">
                  ×
                </span>
              </button>
            )
          })}
        </div>
      )}
      <button type="button" onClick={() => fileRef.current?.click()} className={uploadButtonClass}>
        {items.length > 0 ? 'Add photos…' : 'Upload your photos…'}
      </button>
      {items.length === 0 && (
        <p className="text-[10px] text-muted-foreground mt-1">
          The animation runs on the bundled sample images until you upload your own.
        </p>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={async (e) => {
          const files = [...(e.target.files ?? [])]
          e.target.value = ''
          if (files.length === 0) return
          const shaped = await Promise.all(
            files.map(async (file) =>
              shapeImage(await fileToDataUrl(file), fileLabel(file), control.imageKeys),
            ),
          )
          onChange([...itemsRef.current, ...shaped])
        }}
      />
    </div>
  )
}
