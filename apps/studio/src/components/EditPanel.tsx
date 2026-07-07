import { useState } from 'react'
import type { RegistryEntry } from '@component-style-studio/registry'
import type { ControlSpec, StyleOverride } from '../lib/controls'
import { ControlInput } from './controls/ControlInput'
import { StyleTab } from './StyleTab'
import { PanelSideToggle, type PanelSide } from './PanelSideToggle'

type Tab = 'controls' | 'style' | 'animation'

export function EditPanel({
  side,
  onToggleSide,
  entry,
  controls,
  args,
  onArgChange,
  style,
  onStyleChange,
  position,
  onPositionChange,
  animationSlot,
}: {
  side: PanelSide
  onToggleSide: () => void
  /** Null when nothing is selected — the bar stays mounted and shows an empty state. */
  entry: RegistryEntry | null
  controls: ControlSpec[]
  args: Record<string, unknown>
  onArgChange: (name: string, value: unknown) => void
  style: StyleOverride
  onStyleChange: (next: StyleOverride) => void
  position: { x: number; y: number }
  onPositionChange: (x: number, y: number) => void
  animationSlot?: React.ReactNode
}) {
  const [tab, setTab] = useState<Tab>('controls')
  const posClass =
    'w-full rounded-md px-2 py-1 text-xs bg-input border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-ring'

  const borderClass = side === 'left' ? 'border-r' : 'border-l'

  const tabs: { id: Tab; label: string }[] = [
    { id: 'controls', label: 'Controls' },
    { id: 'style', label: 'Style' },
    { id: 'animation', label: 'Animation' },
  ]

  return (
    <div className={`w-[280px] ${borderClass} border-border flex flex-col shrink-0 bg-card`}>
      <div className="px-3 pt-3 pb-2 border-b border-border shrink-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
            Configure
          </p>
          <PanelSideToggle side={side} onToggle={onToggleSide} />
        </div>
        {entry ? (
          <>
            <p className="text-xs font-semibold tracking-tight truncate mt-1">{entry.name}</p>
            <p className="text-[10px] font-mono text-muted-foreground truncate mb-2">{entry.filePath}</p>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
                Pos
              </span>
              <label className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground">X</span>
                <input
                  type="number"
                  value={Math.round(position.x)}
                  onChange={(e) => onPositionChange(Number(e.target.value), position.y)}
                  className={posClass}
                />
              </label>
              <label className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground">Y</span>
                <input
                  type="number"
                  value={Math.round(position.y)}
                  onChange={(e) => onPositionChange(position.x, Number(e.target.value))}
                  className={posClass}
                />
              </label>
            </div>
          </>
        ) : null}
      </div>

      {!entry ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-[11px] text-muted-foreground text-center">
            Select a component on the canvas to edit its props, style, and animation.
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-0.5 px-2 pt-2 shrink-0">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex-1 px-2 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {tab === 'controls' &&
              (controls.length === 0 ? (
                <p className="text-[11px] text-muted-foreground">No editable props detected.</p>
              ) : (
                controls.map((control) => (
                  <ControlInput
                    key={control.name}
                    control={control}
                    value={args[control.name]}
                    onChange={(v) => onArgChange(control.name, v)}
                  />
                ))
              ))}
            {tab === 'style' && <StyleTab value={style} onChange={onStyleChange} />}
            {tab === 'animation' && animationSlot}
          </div>
        </>
      )}
    </div>
  )
}
