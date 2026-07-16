import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { ensurePreviewUrl, invalidatePreviewUrl, type PreviewMessage } from '../lib/preview'
import { compileAnim } from '../lib/animation'
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
  /** Animation config; compiled to CSS keyframes + trigger for the harness */
  anim?: AnimConfig
  /** Interaction effect attached to the rendered host (magnetic, ripple, …) */
  fx?: { id: string; accent?: string; text?: string }
  /** Bump to replay the animation without other changes */
  replayKey?: number
  className?: string
  /** Called with rendered content size, for size-to-content hosts (canvas) */
  onSize?: (size: { width: number; height: number }) => void
  /** Fires when the user really clicks inside the live component; `slot` names
   * the data-link-slot button that was hit, if any. */
  onUserClick?: (slot?: string | null) => void
  /** Reports the component's named link slots after each render */
  onSlots?: (slots: string[]) => void
  /**
   * Fires once the render outcome is known: `true` if the component produced a
   * real visual preview, `false` if it errored (needs context) or is blank
   * (bare text). The library uses this to drop non-previewable components.
   */
  onOutcome?: (previewable: boolean) => void
  /**
   * When true (default), the frame sizes itself to the rendered content. Set
   * false for fixed-size hosts (e.g. library cards that clip/scale).
   */
  autoSize?: boolean
  /**
   * Smart-fit resize: render the component AT this size (board px) — the
   * harness pins its mount root and the component fills it, so text reflows.
   */
  host?: { w?: number; h?: number }
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
  /**
   * When true, a component that renders no visual chrome (bare text — usually a
   * structural wrapper showing only its injected name) is replaced by a calm
   * name placeholder instead of raw text. Used by the library grid; the canvas
   * leaves it off so a dropped component always renders as-is.
   */
  placeholderOnBlank?: boolean
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
    fx,
    replayKey,
    className,
    onSize,
    onUserClick,
    onSlots,
    autoSize = true,
    host,
    fit = false,
    interactive = true,
    placeholderOnBlank = false,
    onOutcome,
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
  const [blank, setBlank] = useState(false)
  const readyRef = useRef(false)
  const propsRef = useRef(renderProps)
  propsRef.current = renderProps
  const animRef = useRef(anim)
  animRef.current = anim
  const fxRef = useRef(fx)
  fxRef.current = fx
  const hostRef = useRef(host)
  hostRef.current = host
  const onSizeRef = useRef(onSize)
  onSizeRef.current = onSize
  const onUserClickRef = useRef(onUserClick)
  onUserClickRef.current = onUserClick
  const onSlotsRef = useRef(onSlots)
  onSlotsRef.current = onSlots
  const onOutcomeRef = useRef(onOutcome)
  onOutcomeRef.current = onOutcome
  // Only report a *changed* outcome, so re-renders don't churn the host.
  const outcomeRef = useRef<boolean | null>(null)
  const reportOutcome = useCallback((previewable: boolean) => {
    if (outcomeRef.current === previewable) return
    outcomeRef.current = previewable
    onOutcomeRef.current?.(previewable)
  }, [])

  useEffect(() => {
    let alive = true
    ensurePreviewUrl(root)
      .then((u) => alive && setUrl(u))
      .catch((e) => {
        if (!alive) return
        setStatus('error')
        setError(e instanceof Error ? e.message : String(e))
        // Deliberately don't reportOutcome(false) here: a preview-server load
        // failure is infrastructure, not a broken component. Marking it broken
        // would let a transient hiccup filter good components out of the
        // library permanently. Only genuine render errors/blank mark broken.
      })
    return () => {
      alive = false
    }
  }, [root])

  const postRender = useCallback((playNow = false) => {
    const win = iframeRef.current?.contentWindow
    if (!win || !readyRef.current) return
    const compiled = compileAnim(animRef.current)
    win.postMessage(
      {
        source: 'studio',
        type: 'render',
        module: filePath,
        exportName,
        props: propsRef.current,
        anim: compiled ? { ...compiled, playNow } : null,
        fx: fxRef.current ?? null,
        host: hostRef.current ?? null,
      },
      '*',
    )
  }, [filePath, exportName])

  // Guard against a stale root→URL mapping (child servers can swap ports
  // across studio restarts): if the harness reports serving a different
  // project, drop the cached URL and re-resolve. One attempt per mount.
  const reresolvedRef = useRef(false)

  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      if (ev.source !== iframeRef.current?.contentWindow) return
      const data = ev.data as PreviewMessage
      if (!data || data.source !== 'preview') return
      if (data.type === 'ready') {
        if (data.root && data.root !== root && !reresolvedRef.current) {
          reresolvedRef.current = true
          invalidatePreviewUrl(root)
          setUrl(null)
          ensurePreviewUrl(root).then((u) => setUrl(u)).catch(() => {})
          return
        }
        readyRef.current = true
        postRender()
      } else if (data.type === 'clicked') {
        onUserClickRef.current?.(data.slot)
      } else if (data.type === 'size') {
        // A 0×0 report (pre-paint) must never shrink the frame — the component
        // would then render into a zero-width box and wrap at min-content.
        if (data.width === 0 && data.height === 0) return
        setSize({ width: data.width, height: data.height })
        onSizeRef.current?.({ width: data.width, height: data.height })
      } else if (data.type === 'rendered') {
        setStatus('ready')
        setError(null)
        setBlank(Boolean(data.blank))
        if (data.slots) onSlotsRef.current?.(data.slots)
        // Same 0×0 guard as the size path: a blank-then-hydrating component
        // must not zero the frame it is about to render into.
        if (data.width !== 0 || data.height !== 0) {
          setSize({ width: data.width, height: data.height })
          onSizeRef.current?.({ width: data.width, height: data.height })
        }
        reportOutcome(!data.blank)
      } else if (data.type === 'error') {
        setStatus('error')
        setError(data.message)
        reportOutcome(false)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [postRender, reportOutcome, root])

  // Re-post whenever the component, its props, or the animation change; a
  // replayKey bump re-posts to replay the animation. renderProps/anim are
  // rebuilt on every canvas render, so we key off their serialized *values* —
  // otherwise an unrelated instance re-rendering the canvas would hand this
  // frame a new object reference and needlessly re-post (replaying the
  // animation on every unrelated edit).
  const propsKey = JSON.stringify(renderProps)
  const animKey = JSON.stringify(anim ?? null)
  const fxKey = JSON.stringify(fx ?? null)
  const hostKey = JSON.stringify(host ?? null)
  // A replayKey bump means "Preview animation": ask the harness to play the
  // effect immediately even when its trigger is hover/click/scroll.
  const lastReplayRef = useRef(replayKey)
  useEffect(() => {
    const isReplay = replayKey !== lastReplayRef.current
    lastReplayRef.current = replayKey
    postRender(isReplay)
  }, [postRender, propsKey, animKey, fxKey, hostKey, replayKey])

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
      {(status === 'error' || (placeholderOnBlank && status === 'ready' && blank)) && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-1 p-2 pointer-events-none ${
            placeholderOnBlank ? 'bg-artboard' : ''
          }`}
        >
          {/* Two cases share this calm placeholder: components that error in
              isolation (compound Dialog/DropdownMenu parts), and structural
              wrappers that render as bare text. Both beat showing raw text. */}
          <span className="text-[11px] text-neutral-500 text-center" title={error ?? ''}>
            {exportName}
          </span>
          <span className="text-[8px] text-neutral-400 uppercase tracking-wider">
            {status === 'error' ? 'needs context' : 'no preview'}
          </span>
        </div>
      )}
    </div>
  )
})
