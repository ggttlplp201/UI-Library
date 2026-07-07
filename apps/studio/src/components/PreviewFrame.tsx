import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { ensurePreviewUrl, type PreviewMessage } from '../lib/preview'
import type { AnimConfig } from '../lib/canvas'

/** Imperative handle for exporting a static snapshot of the rendered component. */
export interface PreviewHandle {
  serialize: () => Promise<{ html: string; css: string } | null>
}

export interface PreviewFrameProps {
  /** Imported-project root (the scan result's root) */
  root: string
  /** Component file path relative to root, e.g. src/components/ui/buttons/button.tsx */
  filePath: string
  exportName: string
  /** Props posted to the harness; changing this re-renders the component in place */
  renderProps: Record<string, unknown>
  /** GSAP animation the harness replays after each render */
  anim?: AnimConfig
  /** Bump to replay the animation without other changes */
  replayKey?: number
  className?: string
  /** Called with rendered content size, for size-to-content hosts (canvas) */
  onSize?: (size: { width: number; height: number }) => void
  /**
   * When true (default), the frame sizes itself to the rendered content. Set
   * false for fixed-size hosts (e.g. library cards that clip/scale).
   */
  autoSize?: boolean
  /**
   * Thumbnail mode: render the component at its natural size, then scale it
   * down (never up) to fit this container, centered. Prevents squishing/
   * clipping in the fixed-size library cards. Overrides autoSize.
   */
  fit?: boolean
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
export const PreviewFrame = forwardRef<PreviewHandle, PreviewFrameProps>(function PreviewFrame(
  {
    root,
    filePath,
    exportName,
    renderProps,
    anim,
    replayKey,
    className,
    onSize,
    autoSize = true,
    fit = false,
    interactive = true,
  },
  ref,
) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)
  const [size, setSize] = useState<{ width: number; height: number } | null>(null)
  const [box, setBox] = useState<{ width: number; height: number } | null>(null)
  const readyRef = useRef(false)
  const propsRef = useRef(renderProps)
  propsRef.current = renderProps
  const animRef = useRef(anim)
  animRef.current = anim
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
      {
        source: 'studio',
        type: 'render',
        module: filePath,
        exportName,
        props: propsRef.current,
        anim: animRef.current,
      },
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

  // Re-post whenever the component, its props, or the animation change; a
  // replayKey bump re-posts to replay the animation.
  useEffect(() => {
    postRender()
  }, [postRender, renderProps, anim, replayKey])

  // Track the container size for fit (thumbnail) scaling.
  useEffect(() => {
    if (!fit) return
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      setBox({ width: r.width, height: r.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [fit])

  useImperativeHandle(ref, () => ({
    serialize: () =>
      new Promise((resolve) => {
        const win = iframeRef.current?.contentWindow
        if (!win) return resolve(null)
        const nonce = Math.random().toString(36).slice(2)
        const onMsg = (ev: MessageEvent) => {
          if (ev.source !== win) return
          const d = ev.data
          if (d?.source === 'preview' && d.type === 'serialized' && d.nonce === nonce) {
            window.removeEventListener('message', onMsg)
            resolve({ html: d.html, css: d.css })
          }
        }
        window.addEventListener('message', onMsg)
        win.postMessage({ source: 'studio', type: 'serialize', nonce }, '*')
        setTimeout(() => {
          window.removeEventListener('message', onMsg)
          resolve(null)
        }, 2500)
      }),
  }))

  const sizeStyle =
    autoSize && !fit && size ? { width: size.width, height: size.height } : undefined

  // In fit mode, size the iframe to the content and scale it to fit, centered.
  const fitScale =
    fit && size && box && size.width > 0 && size.height > 0
      ? Math.min(box.width / size.width, box.height / size.height, 1)
      : 1
  const iframeStyle: React.CSSProperties = fit
    ? {
        width: size?.width ?? '100%',
        height: size?.height ?? '100%',
        border: 0,
        colorScheme: 'light',
        pointerEvents: interactive ? 'auto' : 'none',
        transform: `scale(${fitScale})`,
        transformOrigin: 'center center',
      }
    : {
        width: '100%',
        height: '100%',
        border: 0,
        colorScheme: 'light',
        pointerEvents: interactive ? 'auto' : 'none',
      }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...(fit ? { display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}),
        ...sizeStyle,
      }}
    >
      {url && (
        <iframe ref={iframeRef} src={`${url}__preview__`} title={`${exportName} preview`} style={iframeStyle} />
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
})
