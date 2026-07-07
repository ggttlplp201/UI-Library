import { useCallback, useEffect, useRef, useState } from 'react'
import { ensurePreviewUrl, type PreviewMessage } from '../lib/preview'

export interface PreviewFrameProps {
  /** Imported-project root (the scan result's root) */
  root: string
  /** Component file path relative to root, e.g. src/components/ui/buttons/button.tsx */
  filePath: string
  exportName: string
  /** Props posted to the harness; changing this re-renders the component in place */
  renderProps: Record<string, unknown>
  className?: string
  /** Called with rendered content size, for size-to-content hosts (canvas) */
  onSize?: (size: { width: number; height: number }) => void
  /**
   * When true (default), the frame sizes itself to the rendered content. Set
   * false for fixed-size hosts (e.g. library cards that clip/scale).
   */
  autoSize?: boolean
  /**
   * When false, the iframe ignores pointer events so the host (card) receives
   * hover/drag instead. Default true.
   */
  interactive?: boolean
}

type Status = 'loading' | 'ready' | 'error'

/**
 * Renders one imported component inside the child preview server's iframe and
 * drives it over postMessage. A single iframe can switch component/props
 * without reloading — the harness handles successive render messages.
 */
export function PreviewFrame({
  root,
  filePath,
  exportName,
  renderProps,
  className,
  onSize,
  autoSize = true,
  interactive = true,
}: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)
  const [size, setSize] = useState<{ width: number; height: number } | null>(null)
  const readyRef = useRef(false)
  const propsRef = useRef(renderProps)
  propsRef.current = renderProps
  const onSizeRef = useRef(onSize)
  onSizeRef.current = onSize

  useEffect(() => {
    let alive = true
    ensurePreviewUrl(root)
      .then((u) => alive && setUrl(u))
      .catch((e) => {
        if (!alive) return
        setStatus('error')
        setError(e instanceof Error ? e.message : String(e))
      })
    return () => {
      alive = false
    }
  }, [root])

  const postRender = useCallback(() => {
    const win = iframeRef.current?.contentWindow
    if (!win || !readyRef.current) return
    win.postMessage(
      { source: 'studio', type: 'render', module: filePath, exportName, props: propsRef.current },
      '*',
    )
  }, [filePath, exportName])

  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      if (ev.source !== iframeRef.current?.contentWindow) return
      const data = ev.data as PreviewMessage
      if (!data || data.source !== 'preview') return
      if (data.type === 'ready') {
        readyRef.current = true
        postRender()
      } else if (data.type === 'rendered') {
        setStatus('ready')
        setError(null)
        setSize({ width: data.width, height: data.height })
        onSizeRef.current?.({ width: data.width, height: data.height })
      } else if (data.type === 'error') {
        setStatus('error')
        setError(data.message)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [postRender])

  // Re-post whenever the component or its props change.
  useEffect(() => {
    postRender()
  }, [postRender, renderProps])

  const sizeStyle =
    autoSize && size ? { width: size.width, height: size.height } : undefined

  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', ...sizeStyle }}>
      {url && (
        <iframe
          ref={iframeRef}
          src={`${url}__preview__`}
          title={`${exportName} preview`}
          style={{
            width: '100%',
            height: '100%',
            border: 0,
            colorScheme: 'light',
            pointerEvents: interactive ? 'auto' : 'none',
          }}
        />
      )}
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[10px] text-muted-foreground">rendering…</span>
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center p-2 pointer-events-none">
          <span className="text-[10px] text-destructive text-center line-clamp-3" title={error ?? ''}>
            {error}
          </span>
        </div>
      )}
    </div>
  )
}
