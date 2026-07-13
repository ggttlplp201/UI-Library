/**
 * Minimal store-only (uncompressed) ZIP writer — zero dependencies (plan §5.7 /
 * Phase 8). Source files are tiny, so skipping DEFLATE costs almost nothing and
 * keeps the format trivial: local file header + data per entry, a central
 * directory, and an end-of-central-directory record.
 */

export interface ZipEntry {
  /** Path inside the archive, posix separators (e.g. src/ui/button.tsx) */
  path: string
  /** UTF-8 text content */
  content: string
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

/** CRC-32 (IEEE) of a byte array — the checksum every ZIP entry carries. */
export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ bytes[i]) & 0xff]
  }
  return (crc ^ 0xffffffff) >>> 0
}

const encoder = new TextEncoder()
// General-purpose flag bit 11: filenames/content are UTF-8.
const UTF8_FLAG = 0x0800
// DOS date for 1980-01-01 (the epoch of the format); time left at 0.
const DOS_DATE = 0x21

/** Build a store-only ZIP archive from the given entries. */
export function buildZip(entries: ZipEntry[]): Uint8Array {
  const chunks: Uint8Array[] = []
  const central: Uint8Array[] = []
  let offset = 0

  for (const entry of entries) {
    const name = encoder.encode(entry.path)
    const data = encoder.encode(entry.content)
    const crc = crc32(data)

    const local = new DataView(new ArrayBuffer(30))
    local.setUint32(0, 0x04034b50, true) // local file header signature
    local.setUint16(4, 20, true) // version needed
    local.setUint16(6, UTF8_FLAG, true)
    local.setUint16(8, 0, true) // method: 0 = store
    local.setUint16(10, 0, true) // mod time
    local.setUint16(12, DOS_DATE, true) // mod date
    local.setUint32(14, crc, true)
    local.setUint32(18, data.length, true) // compressed size
    local.setUint32(22, data.length, true) // uncompressed size
    local.setUint16(26, name.length, true)
    local.setUint16(28, 0, true) // extra length
    const localBytes = new Uint8Array(local.buffer)
    chunks.push(localBytes, name, data)

    const cd = new DataView(new ArrayBuffer(46))
    cd.setUint32(0, 0x02014b50, true) // central dir header signature
    cd.setUint16(4, 20, true) // version made by
    cd.setUint16(6, 20, true) // version needed
    cd.setUint16(8, UTF8_FLAG, true)
    cd.setUint16(10, 0, true) // method
    cd.setUint16(12, 0, true) // mod time
    cd.setUint16(14, DOS_DATE, true) // mod date
    cd.setUint32(16, crc, true)
    cd.setUint32(20, data.length, true) // compressed size
    cd.setUint32(24, data.length, true) // uncompressed size
    cd.setUint16(28, name.length, true)
    cd.setUint16(30, 0, true) // extra length
    cd.setUint16(32, 0, true) // comment length
    cd.setUint16(34, 0, true) // disk number start
    cd.setUint16(36, 0, true) // internal attrs
    cd.setUint32(38, 0, true) // external attrs
    cd.setUint32(42, offset, true) // local header offset
    central.push(new Uint8Array(cd.buffer), name)

    offset += localBytes.length + name.length + data.length
  }

  const cdStart = offset
  let cdSize = 0
  for (const c of central) {
    chunks.push(c)
    cdSize += c.length
  }

  const end = new DataView(new ArrayBuffer(22))
  end.setUint32(0, 0x06054b50, true) // end of central dir signature
  end.setUint16(4, 0, true) // disk number
  end.setUint16(6, 0, true) // disk with central dir
  end.setUint16(8, entries.length, true) // entries on this disk
  end.setUint16(10, entries.length, true) // total entries
  end.setUint32(12, cdSize, true)
  end.setUint32(16, cdStart, true)
  end.setUint16(20, 0, true) // comment length
  chunks.push(new Uint8Array(end.buffer))

  let total = 0
  for (const c of chunks) total += c.length
  const out = new Uint8Array(total)
  let p = 0
  for (const c of chunks) {
    out.set(c, p)
    p += c.length
  }
  return out
}
