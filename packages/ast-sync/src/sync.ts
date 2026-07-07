import { injectStableIds, rootIdFor, stripStableIds } from './ids.js'
import { applyTextEdit } from './text-edit.js'
import { applyStyleEdit, type StyleEdit } from './style-edit.js'
import { applyPositionEdit, type PositionEdit } from './position-edit.js'
import { applyAnimationAttach, type AnimAttach } from './animation-attach.js'

/** A canvas instance's full edit state, mapped from `Instance` in the Studio. */
export interface InstanceSync {
  exportName: string
  /** Edited text content (Style-tab text override or primary text arg) */
  text?: string
  style?: StyleEdit
  position?: PositionEdit
  anim?: AnimAttach
}

export interface SyncSkip {
  step: 'locate' | 'text' | 'style' | 'position' | 'animation'
  reason: string
}

export interface SyncOutcome {
  /** Final source with ids stripped — what the code pane shows and export writes */
  code: string
  changed: boolean
  /** Edits that were requested but couldn't be applied to this source */
  skipped: SyncSkip[]
}

const hasStyle = (s: StyleEdit | undefined): s is StyleEdit =>
  s != null &&
  (s.color != null ||
    s.backgroundColor != null ||
    s.fontFamily != null ||
    s.fontWeight != null ||
    s.fontSize != null)

const hasPosition = (p: PositionEdit | undefined): p is PositionEdit =>
  p != null &&
  ((p.scaleX != null && p.scaleX !== 1) ||
    (p.scaleY != null && p.scaleY !== 1) ||
    (p.rotation != null && p.rotation !== 0))

/**
 * Apply an instance's whole edit state onto *pristine* component source.
 * Always recomputing from the original (instead of mutating the previous
 * output) keeps the sync deterministic — no transform has to be idempotent
 * and repeated edits can't drift.
 */
export function syncInstance(source: string, sync: InstanceSync): SyncOutcome {
  const wantsEdit =
    sync.text != null ||
    hasStyle(sync.style) ||
    hasPosition(sync.position) ||
    (sync.anim != null && sync.anim.preset !== 'none')
  if (!wantsEdit) return { code: source, changed: false, skipped: [] }

  const { code: withIds } = injectStableIds(source)
  const root = rootIdFor(withIds, sync.exportName)
  if (!root) {
    return {
      code: source,
      changed: false,
      skipped: [{ step: 'locate', reason: `No root JSX element found for "${sync.exportName}"` }],
    }
  }

  let code = withIds
  let changed = false
  const skipped: SyncSkip[] = []
  const run = (step: SyncSkip['step'], apply: (cur: string) => ReturnType<typeof applyTextEdit>) => {
    const res = apply(code)
    if (res.changed) {
      code = res.code
      changed = true
    } else if (res.reason) {
      skipped.push({ step, reason: res.reason })
    }
  }

  if (hasStyle(sync.style)) run('style', (cur) => applyStyleEdit(cur, root, sync.style!))
  if (sync.text != null) run('text', (cur) => applyTextEdit(cur, root, sync.text!))
  if (hasPosition(sync.position)) run('position', (cur) => applyPositionEdit(cur, root, sync.position!))
  if (sync.anim && sync.anim.preset !== 'none') {
    run('animation', (cur) => applyAnimationAttach(cur, sync.exportName, sync.anim!))
  }

  return { code: changed ? stripStableIds(code) : source, changed, skipped }
}
