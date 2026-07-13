import { describe, expect, it } from 'vitest'
import { buildZip, crc32, type ZipEntry } from '../src/zip.js'

const enc = new TextEncoder()
const dec = new TextDecoder()

/** Minimal store-only reader: walk local file headers and slice out each entry. */
function readZip(buf: Uint8Array): Record<string, string> {
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)
  const out: Record<string, string> = {}
  let p = 0
  while (p + 4 <= buf.length && view.getUint32(p, true) === 0x04034b50) {
    const size = view.getUint32(p + 18, true)
    const nameLen = view.getUint16(p + 26, true)
    const extraLen = view.getUint16(p + 28, true)
    const nameStart = p + 30
    const dataStart = nameStart + nameLen + extraLen
    const name = dec.decode(buf.subarray(nameStart, nameStart + nameLen))
    out[name] = dec.decode(buf.subarray(dataStart, dataStart + size))
    p = dataStart + size
  }
  return out
}

describe('crc32', () => {
  it('matches known IEEE vectors', () => {
    expect(crc32(new Uint8Array(0))).toBe(0)
    expect(crc32(enc.encode('123456789'))).toBe(0xcbf43926)
    expect(crc32(enc.encode('The quick brown fox jumps over the lazy dog'))).toBe(0x414fa339)
  })
})

describe('buildZip', () => {
  it('round-trips entries (parse back to identical content)', () => {
    const entries: ZipEntry[] = [
      { path: 'src/ui/button.tsx', content: 'export const Button = () => <button/>\n' },
      { path: 'src/ui/card.tsx', content: 'export const Card = () => <div/>\n' },
    ]
    const zip = buildZip(entries)
    const back = readZip(zip)
    expect(Object.keys(back).sort()).toEqual(['src/ui/button.tsx', 'src/ui/card.tsx'])
    expect(back['src/ui/button.tsx']).toBe(entries[0].content)
    expect(back['src/ui/card.tsx']).toBe(entries[1].content)
  })

  it('starts with the local file header signature (PK\\x03\\x04)', () => {
    const zip = buildZip([{ path: 'a.txt', content: 'hi' }])
    expect([zip[0], zip[1], zip[2], zip[3]]).toEqual([0x50, 0x4b, 0x03, 0x04])
  })

  it('ends with an end-of-central-directory record listing every entry', () => {
    const zip = buildZip([
      { path: 'a.txt', content: 'a' },
      { path: 'b.txt', content: 'bb' },
    ])
    const view = new DataView(zip.buffer, zip.byteOffset, zip.byteLength)
    const eocd = zip.length - 22
    expect(view.getUint32(eocd, true)).toBe(0x06054b50)
    expect(view.getUint16(eocd + 10, true)).toBe(2) // total central dir entries
  })

  it('preserves UTF-8 content', () => {
    const content = 'const s = "café — π ✓"\n'
    const back = readZip(buildZip([{ path: 'u.ts', content }]))
    expect(back['u.ts']).toBe(content)
  })

  it('produces an empty but valid archive for no entries', () => {
    const zip = buildZip([])
    const view = new DataView(zip.buffer, zip.byteOffset, zip.byteLength)
    expect(zip.length).toBe(22)
    expect(view.getUint32(0, true)).toBe(0x06054b50)
    expect(view.getUint16(10, true)).toBe(0)
  })
})
