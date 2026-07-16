import { useEffect, useRef, useState } from 'react'
import type { RegistryEntry } from '@component-style-studio/registry'
import { DEFAULT_ARTBOARD_WIDTH, MIN_BOARD_HEIGHT, type Page } from '../lib/canvas'
import { composeRenderProps } from '../lib/controls'
import { LOADER_CSS, loaderById, loaderHtml } from '../lib/pagefx'
import { PreviewFrame } from './PreviewFrame'
import type { CanvasTheme } from './Canvas'

const BG: Record<CanvasTheme, string> = { dark: '#0c0c0f', light: '#ffffff' }

/**
 * Preview that runs the composition LIVE: every instance is a real mounted
 * component (dropdowns open, checkboxes toggle, effects play) instead of a
 * static snapshot. Navigation follows the same rules as the export: clicking
 * a linked component (or a linked menu row / button slot) switches pages;
 * unlinked interactions stay inside the component. Page loaders and cursor
 * effects play like the exported site.
 */
export function LivePreview({
  pages,
  startPageId,
  theme,
  entryById,
  rootFor,
}: {
  pages: Page[]
  startPageId: string
  theme: CanvasTheme
  entryById: (id: string) => RegistryEntry | undefined
  rootFor: (entry: RegistryEntry) => string
}) {
  const [pageId, setPageId] = useState(startPageId)
  const page = pages.find((p) => p.id === pageId) ?? pages[0]

  // Scale the design-width board down to the window (never up) — the same
  // proportional fit the exported site applies.
  const [vw, setVw] = useState(() => window.innerWidth)
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const boardW = page.artboardWidth ?? DEFAULT_ARTBOARD_WIDTH
  const scale = Math.min(1, vw / boardW)

  // Content-driven board height: instances report their size as they mount.
  const [sizes, setSizes] = useState<Record<string, { w: number; h: number }>>({})
  const contentBottom = page.instances.reduce((b, i) => {
    const s = sizes[i.id]
    return Math.max(b, i.y + (s ? s.h * (i.scaleY ?? 1) : 0))
  }, 0)
  const boardH = Math.max(MIN_BOARD_HEIGHT, page.boardHeight ?? 0, Math.ceil(contentBottom) + 80)

  // Loading screen: plays on entry and on every navigation to a page that has one.
  const [loaderVisible, setLoaderVisible] = useState(() => Boolean(page.fx?.loader))
  const loaderTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (loaderTimer.current) clearTimeout(loaderTimer.current)
    if (page.fx?.loader && loaderById(page.fx.loader)) {
      setLoaderVisible(true)
      loaderTimer.current = setTimeout(() => setLoaderVisible(false), page.fx.loaderMs ?? 1400)
    } else {
      setLoaderVisible(false)
    }
    return () => {
      if (loaderTimer.current) clearTimeout(loaderTimer.current)
    }
  }, [pageId, page.fx?.loader, page.fx?.loaderMs])

  // Cursor effect (same visuals as the export runtime). Two sources feed it:
  // real mousemove over the shell, and forwarded pointer messages from the
  // component iframes — without those the dot freezes whenever the pointer is
  // over a component (iframes swallow mouse events).
  const cursorRef = useRef<HTMLDivElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = cursorRef.current
    if (!el) return
    const moveTo = (x: number, y: number) => {
      const half = el.offsetWidth / 2
      el.style.transform = `translate(${x - half}px, ${y - half}px)`
    }
    const onMove = (e: MouseEvent) => moveTo(e.clientX, e.clientY)
    const onMsg = (ev: MessageEvent) => {
      const d = ev.data as { source?: string; type?: string; x?: number; y?: number } | null
      if (d?.source !== 'preview' || d.type !== 'pointer') return
      const shell = shellRef.current
      if (!shell) return
      for (const f of shell.querySelectorAll('iframe')) {
        if (f.contentWindow === ev.source) {
          // Iframe-local px → viewport px. The visual rect already includes
          // every transform above the frame (board zoom AND per-instance
          // scaleX/scaleY), so map per axis by rendered ÷ layout size.
          const r = f.getBoundingClientRect()
          const fx = f.clientWidth > 0 ? r.width / f.clientWidth : scale
          const fy = f.clientHeight > 0 ? r.height / f.clientHeight : scale
          moveTo(r.left + (d.x ?? 0) * fx, r.top + (d.y ?? 0) * fy)
          return
        }
      }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('message', onMsg)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('message', onMsg)
    }
  }, [page.fx?.cursor, scale])

  const navigate = (targetPageId: string) => {
    if (pages.some((p) => p.id === targetPageId)) setPageId(targetPageId)
  }

  // Replay: re-run every entrance/scroll animation (components remount and
  // play again) and the page's loading screen, without leaving the preview.
  const [replayTick, setReplayTick] = useState(0)
  const replay = () => {
    setReplayTick((t) => t + 1)
    if (page.fx?.loader && loaderById(page.fx.loader)) {
      if (loaderTimer.current) clearTimeout(loaderTimer.current)
      setLoaderVisible(true)
      loaderTimer.current = setTimeout(() => setLoaderVisible(false), page.fx.loaderMs ?? 1400)
    }
  }

  const cursorKind = page.fx?.cursor
  const cursorAccent = page.fx?.cursorAccent || '#E3B23C'
  const loaderDef = loaderById(page.fx?.loader)

  return (
    <div
      ref={shellRef}
      className="flex-1 w-full overflow-y-auto overflow-x-hidden relative"
      style={{ background: BG[theme], cursor: cursorKind === 'blend' ? 'none' : undefined }}
    >
      <div style={{ zoom: scale }}>
        <div
          style={{
            width: boardW,
            minHeight: boardH,
            position: 'relative',
            margin: '0 auto',
            background: BG[theme],
            overflow: 'hidden',
          }}
        >
          {page.instances.map((inst) => {
            const entry = entryById(inst.entryId)
            if (!entry) return null
            const sx = inst.scaleX ?? 1
            const sy = inst.scaleY ?? 1
            const s = sizes[inst.id]
            return (
              <div
                key={inst.id}
                style={{
                  position: 'absolute',
                  left: inst.x,
                  top: inst.y,
                  transform: `rotate(${inst.rotation ?? 0}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                <div style={s ? { width: s.w * sx, height: s.h * sy } : undefined}>
                  <div
                    style={{
                      transform: `scale(${sx}, ${sy})`,
                      transformOrigin: 'top left',
                      width: s?.w,
                      height: s?.h,
                    }}
                  >
                    <PreviewFrame
                      root={rootFor(entry)}
                      filePath={entry.filePath}
                      exportName={entry.exportName}
                      renderProps={composeRenderProps(inst.args, inst.style)}
                      anim={inst.anim}
                      fx={inst.fx}
                      host={inst.w || inst.h ? { w: inst.w, h: inst.h } : undefined}
                      theme={theme}
                      replayKey={replayTick}
                      interactive
                      onSize={(next) =>
                        setSizes((prev) =>
                          prev[inst.id]?.w === next.width && prev[inst.id]?.h === next.height
                            ? prev
                            : { ...prev, [inst.id]: { w: next.width, h: next.height } },
                        )
                      }
                      onUserClick={(slot) => {
                        const target = (slot && inst.links?.[slot]) || inst.linkTo
                        if (target) navigate(target)
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Replay the page's entrances + loader without leaving the preview */}
      <button
        type="button"
        onClick={replay}
        title="Replay this page's animations and loading screen"
        className="fixed bottom-4 right-4 z-[60] px-3 py-1.5 rounded-full text-[11px] font-medium bg-black/70 text-white/90 border border-white/15 backdrop-blur hover:bg-black/85 hover:text-white active:scale-95 transition-all"
      >
        ↻ Replay intro
      </button>

      {/* Loading screen overlay (page fx) */}
      {loaderDef && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center transition-opacity duration-300"
          style={{
            background: BG[theme],
            opacity: loaderVisible ? 1 : 0,
            pointerEvents: loaderVisible ? 'auto' : 'none',
          }}
          dangerouslySetInnerHTML={{
            __html: `<style>${LOADER_CSS}</style>${loaderHtml(loaderDef, page.fx?.loaderAccent || '#4B3BFF')}`,
          }}
        />
      )}

      {/* Cursor effect (page fx) */}
      {cursorKind && (
        <div
          ref={cursorRef}
          className="fixed top-0 left-0 z-50 pointer-events-none rounded-full"
          style={
            cursorKind === 'blend'
              ? {
                  width: 66,
                  height: 66,
                  background: cursorAccent,
                  mixBlendMode: 'difference',
                  transform: 'translate(-120px, -120px)',
                  willChange: 'transform',
                }
              : {
                  width: 34,
                  height: 34,
                  background: `radial-gradient(circle, ${cursorAccent}aa, transparent 70%)`,
                  transform: 'translate(-120px, -120px)',
                  willChange: 'transform',
                }
          }
        />
      )}
    </div>
  )
}
