/**
 * In-memory working copies of touched source files (plan §5.6/§5.7): the
 * user's files on disk are never written — edits live here until Phase 8's
 * export diffs `original` against `current` and packages the changed files.
 */
export interface VirtualFile {
  path: string
  original: string
  current: string
}

export class VirtualFS {
  private files = new Map<string, VirtualFile>()

  /** Load a file into the FS (reading at most once); returns the entry. */
  open(path: string, read: () => string): VirtualFile {
    let file = this.files.get(path)
    if (!file) {
      const original = read()
      file = { path, original, current: original }
      this.files.set(path, file)
    }
    return file
  }

  get(path: string): VirtualFile | undefined {
    return this.files.get(path)
  }

  update(path: string, code: string): void {
    const file = this.files.get(path)
    if (file) file.current = code
  }

  /** Files whose working copy differs from the on-disk original. */
  diff(): VirtualFile[] {
    return [...this.files.values()].filter((f) => f.current !== f.original)
  }
}
