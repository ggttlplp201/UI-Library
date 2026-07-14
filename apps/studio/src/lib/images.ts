/**
 * Turn user-picked photo files into self-contained data URLs the preview
 * iframe (a different origin) can render. Photos are downscaled and
 * re-encoded so a handful of camera shots doesn't bloat instance args.
 */

const MAX_EDGE = 1024
const JPEG_QUALITY = 0.82

export async function fileToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D unavailable')
    ctx.drawImage(bitmap, 0, 0, width, height)

    // Keep PNG for images with alpha (icons, cutouts); JPEG for photos.
    const isPng = file.type === 'image/png'
    return canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', JPEG_QUALITY)
  } finally {
    bitmap.close()
  }
}

let nextImageId = 1

/** Monotonic id for `{ id, image }`-shaped elements — unique across add/remove cycles. */
export function nextUploadId(): number {
  return nextImageId++
}

/** Base name without extension, for alt/title fields. */
export function fileLabel(file: File): string {
  return file.name.replace(/\.[^.]+$/, '')
}

/** Shape one uploaded photo to match the prop's element type. */
export function shapeImage(
  dataUrl: string,
  label: string,
  imageKeys: string[] | undefined,
): unknown {
  if (!imageKeys) return dataUrl
  const entry: Record<string, string | number> = {}
  for (const key of imageKeys) {
    if (key === 'src' || key === 'image') entry[key] = dataUrl
    else if (key === 'id') entry.id = nextUploadId()
    else entry[key] = label
  }
  return entry
}

/** Extract the preview src from a value produced by shapeImage (or a preset default). */
export function imageSrcOf(value: unknown): string | null {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') {
    const o = value as { src?: unknown; image?: unknown }
    if (typeof o.src === 'string') return o.src
    if (typeof o.image === 'string') return o.image
  }
  return null
}
