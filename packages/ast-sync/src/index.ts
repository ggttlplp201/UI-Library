/**
 * AST Sync Engine (plan §5.6, Phase 7): narrow transforms that write canvas
 * edits back into component source, modeled on Onlook's code-edit pattern —
 * one small function per edit type, style/text/position/animation only,
 * never app logic.
 */
export { injectStableIds, stripStableIds, rootIdFor, CSID_ATTR } from './ids.js'
export { applyTextEdit } from './text-edit.js'
export { applyStyleEdit, type StyleEdit } from './style-edit.js'
export { applyPositionEdit, type PositionEdit } from './position-edit.js'
export { applyAnimationAttach, type AnimAttach } from './animation-attach.js'
export { syncInstance, type InstanceSync, type SyncOutcome, type SyncSkip } from './sync.js'
export { VirtualFS, type VirtualFile } from './virtual-fs.js'
export {
  collectChanges,
  type ExportInstance,
  type ExportConflict,
  type ExportSkip,
  type ExportChange,
  type ExportResult,
} from './export.js'
export { buildZip, crc32, type ZipEntry } from './zip.js'
export type { TransformResult } from './types.js'
