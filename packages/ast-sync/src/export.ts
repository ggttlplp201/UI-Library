/**
 * Phase 8 export: turn a canvas's edited instances into the set of changed
 * component source files. Groups instances by file; within a file, different
 * exports edit different components and are all applied (chained onto the
 * accumulating source), while several instances of the *same* export can't all
 * win — a file has one source — so the last edit wins and the rest are reported
 * as conflicts. Pure and I/O-free: the caller supplies `readFile` (the
 * dev-server reads from disk; tests pass a stub).
 */
import { syncInstance, type InstanceSync, type SyncSkip } from './sync.js'

export interface ExportInstance extends InstanceSync {
  /** File path relative to the project root, posix separators */
  filePath: string
}

export interface ExportConflict {
  filePath: string
  exportName: string
  reason: string
}

export interface ExportSkip extends SyncSkip {
  filePath: string
}

export interface ExportChange {
  path: string
  code: string
}

export interface ExportResult {
  /** Files whose source changed, ready to zip */
  files: ExportChange[]
  /** Same-export collisions where a later edit overrode an earlier one */
  conflicts: ExportConflict[]
  /** Edits that couldn't be applied (missing file, unlocatable export, …) */
  skipped: ExportSkip[]
}

export function collectChanges(
  instances: ExportInstance[],
  readFile: (filePath: string) => string,
): ExportResult {
  const files: ExportChange[] = []
  const conflicts: ExportConflict[] = []
  const skipped: ExportSkip[] = []

  // Group by file, preserving first-seen order.
  const byFile = new Map<string, ExportInstance[]>()
  for (const inst of instances) {
    const arr = byFile.get(inst.filePath)
    if (arr) arr.push(inst)
    else byFile.set(inst.filePath, [inst])
  }

  for (const [filePath, group] of byFile) {
    // One source per file: only the last edit for a given export can be kept.
    const lastByExport = new Map<string, ExportInstance>()
    for (const inst of group) {
      if (lastByExport.has(inst.exportName)) {
        conflicts.push({
          filePath,
          exportName: inst.exportName,
          reason: `Multiple "${inst.exportName}" instances edit one source — keeping the last.`,
        })
      }
      lastByExport.set(inst.exportName, inst)
    }

    let source: string
    try {
      source = readFile(filePath)
    } catch (err) {
      skipped.push({
        filePath,
        step: 'locate',
        reason: err instanceof Error ? err.message : String(err),
      })
      continue
    }

    // Chain each distinct export's edit onto the accumulating source; each
    // syncInstance run targets only its own export's JSX, so edits compose.
    let code = source
    let changed = false
    for (const inst of lastByExport.values()) {
      const outcome = syncInstance(code, inst)
      if (outcome.changed) {
        code = outcome.code
        changed = true
      }
      for (const s of outcome.skipped) skipped.push({ filePath, ...s })
    }
    if (changed) files.push({ path: filePath, code })
  }

  return { files, conflicts, skipped }
}
