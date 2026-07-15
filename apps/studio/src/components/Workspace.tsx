import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RegistryEntry, ScanResult } from '@component-style-studio/registry'
import { deriveControls, initialArgs, type ControlSpec, type StyleOverride } from '../lib/controls'
import {
  newInstanceId,
  newPageId,
  pageSlug,
  type AnimConfig,
  type Instance,
  type Page,
  type PageFx,
} from '../lib/canvas'
import { LOADER_CSS, PAGE_FX_CATEGORIES, loaderById, loaderHtml } from '../lib/pagefx'
import { PagesView } from './PagesView'
import {
  exportSource,
  fetchPresets,
  type CodeSyncPayload,
  type ExportConflict,
  type ExportInstancePayload,
  type ExportSkip,
  type PresetLibrary,
} from '../lib/api'
import { CodePane } from './CodePane'
import { LibraryPanel } from './LibraryPanel'
import { EditPanel } from './EditPanel'
import { AnimationTab } from './AnimationTab'
import { Canvas, type CanvasHandle, type CanvasTheme } from './Canvas'
import type { PanelSide } from './PanelSideToggle'

const NO_PRESETS: PresetLibrary = { root: '', entries: [] }

// Default text color a dropped component gets so it's legible against the
// current canvas background (dark canvas → light text, and vice versa).
const CONTRAST_TEXT: Record<CanvasTheme, string> = { dark: '#e8e8ed', light: '#111115' }
// Exported page background per canvas theme (mirrors the canvas surface).
const CONTRAST_BG: Record<CanvasTheme, string> = { dark: '#0c0c0f', light: '#ffffff' }

export function Workspace({ result, onReset }: { result: ScanResult; onReset: () => void }) {
  const [presets, setPresets] = useState<PresetLibrary>(NO_PRESETS)
  // The composition is a set of PAGES; the canvas edits one page at a time and
  // the Pages view shows them as linked nodes (Blender-style).
  // Composition persists per project so a reload (or an accidental tab
  // discard) doesn't wipe the user's pages.
  const storageKey = `css-workspace:${result.root || 'presets'}`
  const [pages, setPages] = useState<Page[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const saved = JSON.parse(raw) as { pages?: Page[] }
        if (Array.isArray(saved.pages) && saved.pages.length > 0) return saved.pages
      }
    } catch {
      // corrupted/legacy state — start fresh
    }
    return [{ id: newPageId(), name: 'Home', instances: [], nodeX: 90, nodeY: 130 }]
  })
  const [activePageId, setActivePageId] = useState<string | null>(null)
  // Open page tabs (browser-style strip in the header). Opening a page's
  // canvas adds a tab; closing a tab only closes the tab, never the page.
  const [openTabs, setOpenTabs] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const saved = JSON.parse(raw) as { pages?: Page[]; openTabs?: string[] }
        const ids = new Set((saved.pages ?? []).map((p) => p.id))
        const tabs = (saved.openTabs ?? []).filter((id) => ids.has(id))
        if (tabs.length > 0) return tabs
        if (saved.pages && saved.pages.length > 0) return [saved.pages[0].id]
      }
    } catch {
      // fall through
    }
    return []
  })
  const [view, setView] = useState<'canvas' | 'pages'>('canvas')
  // Selection: possibly multiple instances (marquee). The single `selectedId`
  // drives the config panel/code pane and only exists for a 1-item selection.
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const selectedId = selectedIds.length === 1 ? selectedIds[0] : null
  const setSelectedId = useCallback(
    (id: string | null) => setSelectedIds(id ? [id] : []),
    [],
  )

  const activePage = pages.find((p) => p.id === activePageId) ?? pages[0]
  const instances = activePage.instances
  const activePageIdResolved = activePage.id
  /** Update the ACTIVE page's instances (same call shape as a state setter). */
  const setInstances = useCallback(
    (updater: (prev: Instance[]) => Instance[]) => {
      setPages((prev) =>
        prev.map((p) =>
          p.id === activePageIdResolved ? { ...p, instances: updater(p.instances) } : p,
        ),
      )
    },
    [activePageIdResolved],
  )
  const [canvasTheme, setCanvasTheme] = useState<CanvasTheme>('dark')
  const [librarySide, setLibrarySide] = useState<PanelSide>('right')
  const [configSide, setConfigSide] = useState<PanelSide>('left')
  const [showCode, setShowCode] = useState(true)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [previewBusy, setPreviewBusy] = useState(false)
  const [exportReport, setExportReport] = useState<{
    files: number
    conflicts: ExportConflict[]
    skipped: ExportSkip[]
    error?: string
  } | null>(null)
  const canvasRef = useRef<CanvasHandle>(null)

  useEffect(() => {
    let alive = true
    fetchPresets().then((p) => alive && setPresets(p))
    return () => {
      alive = false
    }
  }, [])

  // Debounced autosave of the composition.
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ pages, openTabs }))
      } catch {
        // storage full/unavailable — persistence is best-effort
      }
    }, 400)
    return () => clearTimeout(t)
  }, [pages, openTabs, storageKey])

  // Canvas keyboard shortcuts (ignored while typing in a field): Escape
  // deselects, Delete/Backspace removes the selection, arrows nudge it
  // (Shift = 10px). Uses the stable state setters so it depends only on which
  // instance is selected.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.tagName === 'SELECT' ||
          t.isContentEditable)
      )
        return
      // Leave browser/OS shortcuts (Cmd/Ctrl/Alt combos) alone.
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'Escape') {
        setPreviewHtml(null)
        setSelectedIds([])
        return
      }
      if (selectedIds.length === 0) return
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        setInstances((prev) => prev.filter((i) => !selectedIds.includes(i.id)))
        setSelectedIds([])
        return
      }
      const step = e.shiftKey ? 10 : 1
      const delta: Record<string, [number, number]> = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      }
      const d = delta[e.key]
      if (d) {
        e.preventDefault()
        setInstances((prev) =>
          prev.map((i) =>
            selectedIds.includes(i.id)
              ? { ...i, x: Math.max(0, i.x + d[0]), y: Math.max(0, i.y + d[1]) }
              : i,
          ),
        )
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedIds, setInstances])

  const entries = useMemo(
    () => [...result.entries, ...presets.entries],
    [result.entries, presets.entries],
  )
  // Loaders/cursor effects are PAGE effects (picked in Page settings), not
  // placeable components — keep them out of the library grid. Only preset
  // entries are filtered: an imported project's own "loaders" folder is none
  // of our business.
  const placeableEntries = useMemo(
    () => entries.filter((e) => !(e.source === 'preset' && PAGE_FX_CATEGORIES.has(e.category ?? ''))),
    [entries],
  )
  const entryById = useMemo(() => {
    const map = new Map(entries.map((e) => [e.id, e]))
    return (id: string) => map.get(id)
  }, [entries])
  const rootFor = useCallback(
    (e: RegistryEntry) => (e.source === 'preset' ? presets.root : result.root),
    [presets.root, result.root],
  )

  const selected = instances.find((i) => i.id === selectedId) ?? null
  const selectedEntry = selected ? (entryById(selected.entryId) ?? null) : null
  const controls = useMemo(
    () => (selectedEntry ? deriveControls(selectedEntry) : []),
    [selectedEntry],
  )

  const addInstance = (entryId: string, x: number, y: number) => {
    const entry = entryById(entryId)
    if (!entry) return
    const inst: Instance = {
      id: newInstanceId(),
      entryId,
      x,
      y,
      args: initialArgs(deriveControls(entry)),
      // Seed a contrasting text color so text-bearing components are visible
      // on the current canvas background; the user can override in Style.
      style: { color: CONTRAST_TEXT[canvasTheme] },
    }
    setInstances((prev) => [...prev, inst])
    setSelectedId(inst.id)
  }
  const addFromLibrary = (entryId: string) => {
    const offset = 40 + (instances.length % 6) * 28
    addInstance(entryId, offset, offset)
  }
  const patchInstance = (id: string, patch: Partial<Instance>) =>
    setInstances((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  const removeInstance = (id: string) => {
    setInstances((prev) => prev.filter((i) => i.id !== id))
    setSelectedIds((cur) => cur.filter((x) => x !== id))
  }
  // Nested updates read from `prev` (not the captured `selected`) so rapid /
  // batched edits can't clobber each other.
  const updateSelected = (fn: (inst: Instance) => Instance) => {
    if (!selectedId) return
    setInstances((prev) => prev.map((i) => (i.id === selectedId ? fn(i) : i)))
  }
  const setArg = (name: string, value: unknown) =>
    updateSelected((i) => {
      const next: Instance = { ...i, args: { ...i.args, [name]: value } }
      // Changing a variant/type select restyles the component from its own
      // palette — drop any custom color/background override so the new
      // variant shows its true default look.
      const control = controls.find((c) => c.name === name)
      if (control?.kind === 'select') {
        next.style = {
          ...i.style,
          color: CONTRAST_TEXT[canvasTheme],
          backgroundColor: undefined,
        }
      }
      return next
    })
  const setStyle = (next: StyleOverride) => updateSelected((i) => ({ ...i, style: next }))
  const setAnim = (next: AnimConfig) => updateSelected((i) => ({ ...i, anim: next }))
  const replayAnim = () => updateSelected((i) => ({ ...i, replay: (i.replay ?? 0) + 1 }))
  const setLinkTo = (pageId: string | undefined) =>
    updateSelected((i) => ({ ...i, linkTo: pageId }))
  const setPageFx = (fx: PageFx) =>
    setPages((prev) =>
      prev.map((p) => (p.id === activePageIdResolved ? { ...p, fx } : p)),
    )
  const setLinkSlot = (slot: string, pageId: string | undefined) =>
    updateSelected((i) => {
      const links = { ...i.links }
      if (pageId) links[slot] = pageId
      else delete links[slot]
      return { ...i, links: Object.keys(links).length > 0 ? links : undefined }
    })
  // Which named button slots each rendered instance exposes (harness-reported).
  const [slotsByInstance, setSlotsByInstance] = useState<Record<string, string[]>>({})
  const reportSlots = useCallback((instanceId: string, slots: string[]) => {
    setSlotsByInstance((prev) => {
      const cur = prev[instanceId]
      if (cur && cur.length === slots.length && cur.every((s, i) => s === slots[i])) return prev
      return { ...prev, [instanceId]: slots }
    })
  }, [])

  // ---- Pages ---------------------------------------------------------------
  const addPage = () => {
    const n = pages.length + 1
    const page: Page = {
      id: newPageId(),
      name: `Page ${n}`,
      instances: [],
      nodeX: 90 + (pages.length % 4) * 240,
      nodeY: 130 + Math.floor(pages.length / 4) * 150,
    }
    setPages((prev) => [...prev, page])
    setActivePageId(page.id)
    openTab(page.id)
  }
  const removePage = (id: string) => {
    setPages((prev) => {
      const next = prev.filter((p) => p.id !== id)
      // Clear dangling links into the removed page.
      return next.map((p) => ({
        ...p,
        instances: p.instances.map((i) => {
          let inst = i
          if (inst.linkTo === id) inst = { ...inst, linkTo: undefined }
          if (inst.links && Object.values(inst.links).includes(id)) {
            const links = Object.fromEntries(Object.entries(inst.links).filter(([, v]) => v !== id))
            inst = { ...inst, links: Object.keys(links).length > 0 ? links : undefined }
          }
          return inst
        }),
      }))
    })
    setActivePageId((cur) => (cur === id ? null : cur))
    setOpenTabs((t) => t.filter((x) => x !== id))
    setSelectedId(null)
  }
  const renamePage = (id: string, name: string) =>
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)))
  const movePageNode = (id: string, nodeX: number, nodeY: number) =>
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, nodeX, nodeY } : p)))
  const openTab = useCallback(
    (id: string) => setOpenTabs((t) => (t.includes(id) ? t : [...t, id])),
    [],
  )
  // Whatever page the canvas is showing always has a tab (covers first run,
  // navigation, and removing the active page).
  useEffect(() => {
    if (view === 'canvas') openTab(activePageIdResolved)
  }, [view, activePageIdResolved, openTab])
  const openPageCanvas = (id: string) => {
    setActivePageId(id)
    setSelectedId(null)
    setView('canvas')
    openTab(id)
  }
  const closeTab = (id: string) => {
    const next = openTabs.filter((x) => x !== id)
    setOpenTabs(next)
    // Closing the active page's tab moves focus to the last remaining tab,
    // or back to the Root graph when none are left.
    if (activePage.id === id) {
      if (next.length > 0) setActivePageId(next[next.length - 1])
      else setView('pages')
    }
  }

  // Unique slug per page (duplicate names get -2, -3, …) for export hrefs.
  const slugById = useMemo(() => {
    const used = new Map<string, number>()
    const map = new Map<string, string>()
    for (const p of pages) {
      const base = pageSlug(p)
      const n = used.get(base) ?? 0
      used.set(base, n + 1)
      map.set(p.id, n === 0 ? base : `${base}-${n + 1}`)
    }
    return map
  }, [pages])
  const linkHrefFor = useCallback(
    (inst: Instance) => (inst.linkTo && slugById.has(inst.linkTo) ? `#/${slugById.get(inst.linkTo)}` : null),
    [slugById],
  )
  const slotHrefFor = useCallback(
    (inst: Instance, slot: string) => {
      const target = inst.links?.[slot]
      return target && slugById.has(target) ? `#/${slugById.get(target)}` : null
    },
    [slugById],
  )

  // The primary editable-text prop of a component: children (injected or real),
  // else its first text control. Used for double-click inline text editing.
  const primaryTextName = (entry: RegistryEntry): string | undefined => {
    const c: ControlSpec[] = deriveControls(entry)
    return (c.find((x) => x.name === 'children') ?? c.find((x) => x.kind === 'text'))?.name
  }
  const textOf = (inst: Instance): string => {
    if (inst.style.text != null) return inst.style.text
    const entry = entryById(inst.entryId)
    const name = entry ? primaryTextName(entry) : undefined
    return name ? String(inst.args[name] ?? '') : ''
  }
  const setInstanceText = (id: string, text: string) => {
    setInstances((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i
        const entry = entryById(i.entryId)
        const name = entry ? primaryTextName(entry) : undefined
        return name
          ? { ...i, args: { ...i.args, [name]: text } }
          : { ...i, style: { ...i.style, text } }
      }),
    )
  }

  // An instance's edit state as a code-sync request (Phase 7). Canvas x/y stay
  // composition-level and are not written into the component's source; text is
  // sent only when it differs from the component's default.
  const payloadFor = useCallback(
    (inst: Instance): CodeSyncPayload | null => {
      const entry = entryById(inst.entryId)
      if (!entry) return null
      const root = rootFor(entry)
      if (!root) return null
      const { text: styleText, ...style } = inst.style
      const ctrls = deriveControls(entry)
      const textName = primaryTextName(entry)
      const textControl = ctrls.find((c) => c.name === textName)
      const argText =
        textName != null && textControl && inst.args[textName] !== textControl.defaultValue
          ? String(inst.args[textName] ?? '')
          : undefined
      const text = styleText ?? argText
      return {
        root,
        filePath: entry.filePath,
        exportName: entry.exportName,
        ...(text != null ? { text } : {}),
        style,
        position: {
          ...(inst.scaleX != null ? { scaleX: inst.scaleX } : {}),
          ...(inst.scaleY != null ? { scaleY: inst.scaleY } : {}),
          ...(inst.rotation != null ? { rotation: inst.rotation } : {}),
        },
        ...(inst.anim ? { anim: inst.anim } : {}),
      }
    },
    [entryById, rootFor],
  )

  const codePayload = useMemo<CodeSyncPayload | null>(
    () => (selected ? payloadFor(selected) : null),
    [selected, payloadFor],
  )

  const downloadBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  }

  // Export the whole composition as ONE self-contained HTML file: every page
  // becomes a section, a tiny hash router switches between them (works from
  // file://), instance links become real <a href="#/slug"> anchors, and each
  // instance's animation replays on its real trigger (entrance / hover /
  // click / scroll-into-view).
  const buildSiteHtml = async (): Promise<string | null> => {
    setView('canvas')
    const originalPage = activePage.id
    const cssBlocks = new Set<string>()
    const animCss = new Set<string>()
    const sections: string[] = []
    const overlays: string[] = []

    const settle = (ms: number) => new Promise((r) => setTimeout(r, ms))
    for (const page of pages) {
      setActivePageId(page.id)
      // Frames for the newly active page mount + render asynchronously; retry
      // the snapshot until every instance serialized (or we give up).
      let snap = null as Awaited<ReturnType<NonNullable<typeof canvasRef.current>['snapshotPage']>> | null
      for (let attempt = 0; attempt < 10; attempt++) {
        await settle(attempt === 0 ? 350 : 700)
        snap = (await canvasRef.current?.snapshotPage()) ?? null
        if (snap && snap.serialized >= page.instances.length) break
      }
      if (!snap) continue
      for (const c of snap.cssBlocks) cssBlocks.add(c)
      for (const c of snap.animCss) animCss.add(c)
      const slug = slugById.get(page.id) ?? page.id
      const fx = page.fx
      const cursorAttr = fx?.cursor
        ? ` data-cursor="${fx.cursor}" data-cursor-accent="${fx.cursorAccent || '#E3B23C'}"`
        : ''
      sections.push(`<section data-page="${slug}" class="ss-page"${cursorAttr}>\n${snap.body}\n</section>`)
      const loaderDef = loaderById(fx?.loader)
      if (loaderDef) {
        overlays.push(
          `<div class="ss-loading" data-for="${slug}" data-ms="${fx?.loaderMs ?? 1400}" style="background:${CONTRAST_BG[canvasTheme]}">${loaderHtml(loaderDef, fx?.loaderAccent || '#4B3BFF')}</div>`,
        )
      }
    }
    setActivePageId(originalPage)

    const firstSlug = slugById.get(pages[0].id) ?? pages[0].id
    const runtime = `
(function () {
  var first = ${JSON.stringify(firstSlug)};
  function currentSlug() {
    var h = location.hash.replace(/^#\\/?/, '');
    return h || first;
  }
  function wireAnims(scope) {
    scope.querySelectorAll('[data-anim]').forEach(function (el) {
      if (el.__wired) return;
      el.__wired = true;
      var cfg = JSON.parse(el.getAttribute('data-anim'));
      var run = function () {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = cfg.value;
      };
      if (cfg.trigger === 'hover') el.addEventListener('pointerenter', run);
      else if (cfg.trigger === 'click') el.addEventListener('click', run);
      else if (cfg.trigger === 'scroll') {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) { run(); if (cfg.once) io.disconnect(); }
          });
        }, { threshold: 0.25 });
        io.observe(el);
      } else el.__entrance = run;
    });
  }
  // Page-level effects: the loading screen shows on first load and on every
  // navigation to its page; the cursor effect follows the active page.
  var loaderTimer = null;
  function showLoading(slug) {
    document.querySelectorAll('.ss-loading').forEach(function (o) {
      if (o.getAttribute('data-for') !== slug) { o.style.display = 'none'; return; }
      clearTimeout(loaderTimer);
      o.style.display = 'flex';
      o.style.opacity = '1';
      var ms = Number(o.getAttribute('data-ms')) || 1400;
      loaderTimer = setTimeout(function () {
        o.style.opacity = '0';
        setTimeout(function () { o.style.display = 'none'; }, 400);
      }, ms);
    });
  }
  var cursorEl = null;
  function applyCursor(section) {
    var kind = section ? section.getAttribute('data-cursor') : null;
    var acc = (section && section.getAttribute('data-cursor-accent')) || '#E3B23C';
    if (cursorEl) { cursorEl.remove(); cursorEl = null; }
    document.body.style.cursor = '';
    if (!kind) return;
    cursorEl = document.createElement('div');
    if (kind === 'blend') {
      cursorEl.style.cssText = 'position:fixed;top:0;left:0;width:66px;height:66px;border-radius:50%;background:' + acc + ';mix-blend-mode:difference;pointer-events:none;z-index:9999;transform:translate(-120px,-120px);transition:transform .14s cubic-bezier(.2,.8,.3,1)';
      document.body.style.cursor = 'none';
    } else {
      cursorEl.style.cssText = 'position:fixed;top:0;left:0;width:34px;height:34px;border-radius:50%;background:radial-gradient(circle,' + acc + 'aa,transparent 70%);pointer-events:none;z-index:9999;transform:translate(-120px,-120px);transition:transform .12s ease-out';
    }
    document.body.appendChild(cursorEl);
  }
  document.addEventListener('mousemove', function (e) {
    if (!cursorEl) return;
    var half = cursorEl.offsetWidth / 2;
    cursorEl.style.transform = 'translate(' + (e.clientX - half) + 'px,' + (e.clientY - half) + 'px)';
  });
  function show() {
    var slug = currentSlug();
    var activeSection = null;
    document.querySelectorAll('.ss-page').forEach(function (p) {
      var active = p.getAttribute('data-page') === slug;
      p.classList.toggle('active', active);
      if (active) {
        activeSection = p;
        wireAnims(p);
        p.querySelectorAll('[data-anim]').forEach(function (el) {
          if (el.__entrance) el.__entrance();
        });
      }
    });
    showLoading(slug);
    applyCursor(activeSection);
  }
  window.addEventListener('hashchange', show);
  // Per-button links: components stamp data-nav="#/slug" on individual buttons.
  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('[data-nav]') : null;
    if (el) { e.preventDefault(); location.hash = el.getAttribute('data-nav'); }
  });
  show();
})();
`
    const html = [
      '<!doctype html>',
      '<html><head><meta charset="utf-8" />',
      '<title>Style Studio export</title>',
      `<style>${[...cssBlocks].join('\n')}</style>`,
      `<style>${[...animCss].join('\n')}</style>`,
      // display:block beats the preview harness's body{display:flex} rule that
      // rides along in the collected component CSS.
      `<style>body{margin:0;display:block;background:${CONTRAST_BG[canvasTheme]}}.ss-page{display:none;position:relative;min-height:100vh}.ss-page.active{display:block}\n${LOADER_CSS}\n.ss-loading{position:fixed;inset:0;z-index:9998;display:none;align-items:center;justify-content:center;transition:opacity .4s ease}</style>`,
      '</head><body>',
      sections.join('\n'),
      overlays.join('\n'),
      `<script>${runtime}</script>`,
      '</body></html>',
    ].join('\n')
    return html
  }

  const handleExportDemo = async () => {
    setExportMenuOpen(false)
    const html = await buildSiteHtml()
    if (html) downloadBlob(new Blob([html], { type: 'text/html' }), 'style-studio-site.html')
  }

  // Preview mode: the same self-contained site the export produces, shown in
  // a fullscreen iframe — loading screens, button navigation, animations, and
  // cursor effects all run for real, outside the canvas.
  const handlePreview = async () => {
    if (previewBusy) return
    setPreviewBusy(true)
    try {
      const html = await buildSiteHtml()
      if (html) setPreviewHtml(html)
    } finally {
      setPreviewBusy(false)
    }
  }

  // Export the edited component *source files* as a zip (Phase 8). Instances are
  // grouped by project root (a canvas can mix imported + preset components), and
  // each root's changed files download as their own zip.
  const handleExportSource = async () => {
    setExportMenuOpen(false)
    const byRoot = new Map<string, ExportInstancePayload[]>()
    const allInstances = pages.flatMap((p) => p.instances)
    for (const inst of allInstances) {
      const p = payloadFor(inst)
      if (!p) continue
      const { root, ...rest } = p
      const arr = byRoot.get(root)
      if (arr) arr.push(rest)
      else byRoot.set(root, [rest])
    }
    if (byRoot.size === 0) return
    try {
      let files = 0
      const conflicts: ExportConflict[] = []
      const skipped: ExportSkip[] = []
      for (const [root, insts] of byRoot) {
        const res = await exportSource({ root, instances: insts })
        files += res.files.length
        conflicts.push(...res.conflicts)
        skipped.push(...res.skipped)
        if (res.zipBase64) {
          const base = root.replace(/\/+$/, '').split('/').pop() || 'project'
          const name = byRoot.size > 1 ? `style-studio-source-${base}.zip` : 'style-studio-source.zip'
          const bin = atob(res.zipBase64)
          const bytes = new Uint8Array(bin.length)
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
          downloadBlob(new Blob([bytes], { type: 'application/zip' }), name)
        }
      }
      setExportReport({ files, conflicts, skipped })
    } catch (err) {
      setExportReport({
        files: 0,
        conflicts: [],
        skipped: [],
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  const configPanel = (
    <EditPanel
      key="config"
      side={configSide}
      onToggleSide={() => setConfigSide((s) => (s === 'left' ? 'right' : 'left'))}
      entry={selectedEntry}
      controls={controls}
      args={selected?.args ?? {}}
      onArgChange={setArg}
      style={selected?.style ?? {}}
      onStyleChange={setStyle}
      position={{ x: selected?.x ?? 0, y: selected?.y ?? 0 }}
      onPositionChange={(x, y) => selected && patchInstance(selected.id, { x, y })}
      pages={pages.map((p) => ({ id: p.id, name: p.name }))}
      linkTo={selected?.linkTo}
      onLinkToChange={setLinkTo}
      linkSlots={selected ? (slotsByInstance[selected.id] ?? []) : []}
      links={selected?.links ?? {}}
      onLinkSlotChange={setLinkSlot}
      pageName={activePage.name}
      pageFx={activePage.fx}
      onPageFxChange={setPageFx}
      selectionCount={selectedIds.length}
      animationSlot={
        <AnimationTab value={selected?.anim} onChange={setAnim} onReplay={replayAnim} />
      }
    />
  )

  const libraryPanel = (
    <LibraryPanel
      key="library"
      entries={placeableEntries}
      selectedId={selectedEntry?.id ?? null}
      onSelect={addFromLibrary}
      rootFor={rootFor}
      side={librarySide}
      onToggleSide={() => setLibrarySide((s) => (s === 'left' ? 'right' : 'left'))}
      canApplyAnimation={selected != null}
      appliedPreset={selected?.anim?.preset}
      onApplyAnimation={(preset) =>
        updateSelected((i) => ({
          ...i,
          anim: {
            preset: preset.id,
            trigger: preset.defaultTrigger,
            duration: preset.duration,
            delay: 0,
            easing: 'ease-out',
            once: true,
          },
          // Entrance effects show immediately; interaction-triggered ones
          // play when the user actually hovers/clicks/scrolls the instance.
          replay: (i.replay ?? 0) + 1,
        }))
      }
      onClearAnimation={() => updateSelected((i) => ({ ...i, anim: undefined }))}
    />
  )

  return (
    <div className="h-svh flex flex-col">
      <header className="h-11 shrink-0 border-b border-border bg-card flex items-center gap-3 px-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-primary flex items-center justify-center">
            <span className="font-mono text-[9px] font-bold text-primary-foreground leading-none">S</span>
          </div>
          <span className="text-sm font-semibold tracking-[-0.02em]">Style Studio</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <span
          className="text-[11px] font-mono text-muted-foreground truncate max-w-80"
          title={result.root || 'Preset library'}
        >
          {result.root || 'Preset library'}
        </span>
        {/* Tab explorer: permanent Root tab (page graph) + one tab per open
            page. Tabs share the strip width, shrinking as more open and
            growing back as tabs close. Closing a tab never deletes the page. */}
        <div className="flex items-center gap-0.5 rounded-lg bg-secondary/60 p-0.5 min-w-0 flex-1 max-w-[560px]">
          <button
            type="button"
            onClick={() => setView('pages')}
            title="Root — the page graph: see and wire the connections between pages"
            className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              view === 'pages' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            ⌘ Root
          </button>
          {openTabs
            .map((id) => pages.find((pg) => pg.id === id))
            .filter((pg): pg is Page => Boolean(pg))
            .map((pg) => {
              const active = view === 'canvas' && pg.id === activePage.id
              return (
                <div
                  key={pg.id}
                  onClick={() => openPageCanvas(pg.id)}
                  title={pg.name}
                  className={`group/tab flex items-center gap-1 min-w-0 flex-1 basis-0 max-w-40 px-2 py-1 rounded-md text-[11px] font-medium cursor-pointer transition-colors ${
                    active ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="truncate">{pg.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      closeTab(pg.id)
                    }}
                    title="Close tab (the page stays in Root)"
                    className="shrink-0 w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[9px] leading-none text-muted-foreground opacity-0 group-hover/tab:opacity-100 hover:text-foreground hover:bg-secondary transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          <button
            type="button"
            onClick={() => {
              addPage()
              setView('canvas')
            }}
            title="New page"
            className="shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-xs text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
          >
            +
          </button>
        </div>
        {instances.length > 0 && (
          <span className="text-[11px] text-muted-foreground">
            {instances.length} on this page
          </span>
        )}
        <span className="text-[11px] text-muted-foreground ml-auto shrink-0">
          {result.stats.componentsFound} imported · {presets.entries.length} presets
        </span>
        <button
          type="button"
          onClick={() => setShowCode((v) => !v)}
          title={showCode ? 'Hide generated code' : 'Show generated code'}
          className={`shrink-0 px-2 h-7 rounded-lg flex items-center justify-center text-[11px] font-mono transition-colors ${
            showCode ? 'bg-secondary text-foreground' : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
          }`}
        >
          {'</>'}
        </button>
        <button
          type="button"
          onClick={() => setCanvasTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          title={`Canvas: ${canvasTheme} — click for ${canvasTheme === 'dark' ? 'light' : 'dark'}`}
          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs bg-secondary hover:bg-secondary/70 transition-colors"
        >
          {canvasTheme === 'dark' ? '☾' : '☀'}
        </button>
        <button
          type="button"
          onClick={handlePreview}
          disabled={previewBusy || pages.every((p) => p.instances.length === 0)}
          title="Run the site you built — loading screens, buttons, and effects all work (Esc to return)"
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary hover:bg-secondary/70 disabled:opacity-40 disabled:cursor-default transition-colors"
        >
          {previewBusy ? 'Building…' : '▶ Preview'}
        </button>
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setExportMenuOpen((o) => !o)}
            disabled={pages.every((p) => p.instances.length === 0)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-default transition-colors"
          >
            Export ▾
          </button>
          {exportMenuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setExportMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-40 w-56 rounded-lg border border-border bg-popover shadow-xl p-1">
                <button
                  type="button"
                  onClick={handleExportDemo}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-secondary transition-colors"
                >
                  <div className="text-xs font-medium">Demo (HTML)</div>
                  <div className="text-[10px] text-muted-foreground">Self-contained front-end snapshot</div>
                </button>
                <button
                  type="button"
                  onClick={handleExportSource}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-secondary transition-colors"
                >
                  <div className="text-xs font-medium">Source files (.zip)</div>
                  <div className="text-[10px] text-muted-foreground">Edited component source, ready to diff</div>
                </button>
              </div>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={onReset}
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary hover:bg-secondary/70 transition-colors"
        >
          New import
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {configSide === 'left' && configPanel}
        {librarySide === 'left' && libraryPanel}

        <div className="flex-1 flex flex-col min-w-0">
          {view === 'pages' ? (
            <PagesView
              pages={pages}
              activePageId={activePage.id}
              entryNameFor={(pageId, instanceId) => {
                const page = pages.find((p) => p.id === pageId)
                const inst = page?.instances.find((i) => i.id === instanceId)
                return (inst && entryById(inst.entryId)?.name) || 'component'
              }}
              onSetActive={(id) => setActivePageId(id)}
              onOpenCanvas={openPageCanvas}
              onMoveNode={movePageNode}
              onRename={renamePage}
              onAddPage={addPage}
              onRemovePage={removePage}
              onLink={(pageId, instanceId, targetPageId) =>
                setPages((prev) =>
                  prev.map((p) =>
                    p.id === pageId
                      ? {
                          ...p,
                          instances: p.instances.map((i) =>
                            i.id === instanceId ? { ...i, linkTo: targetPageId } : i,
                          ),
                        }
                      : p,
                  ),
                )
              }
            />
          ) : (
            <Canvas
              ref={canvasRef}
              instances={instances}
              entryById={entryById}
              rootFor={rootFor}
              theme={canvasTheme}
              selectedId={selectedId}
              onSelect={setSelectedId}
              selectedIds={selectedIds}
              onSelectMany={setSelectedIds}
              onNavigate={openPageCanvas}
              onAdd={addInstance}
              onMove={(id, x, y) => patchInstance(id, { x, y })}
              onTransform={(id, patch) => patchInstance(id, patch)}
              onRemove={removeInstance}
              textOf={textOf}
              onEditText={setInstanceText}
              linkHrefFor={linkHrefFor}
              slotHrefFor={slotHrefFor}
              onSlotsReported={reportSlots}
            />
          )}
          {showCode && view === 'canvas' && (
            <CodePane
              payload={codePayload}
              title={selectedEntry ? `${selectedEntry.name} — ${selectedEntry.filePath}` : null}
              onClose={() => setShowCode(false)}
            />
          )}
        </div>

        {librarySide === 'right' && libraryPanel}
        {configSide === 'right' && configPanel}
      </div>

      {previewHtml && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black">
          <div className="h-9 shrink-0 flex items-center gap-3 px-3 bg-card border-b border-border">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Preview — your site, running for real
            </span>
            <span className="text-[10px] text-muted-foreground">
              buttons navigate · loading screens + effects play
            </span>
            <button
              type="button"
              onClick={() => setPreviewHtml(null)}
              className="ml-auto px-2.5 py-1 rounded-md text-[11px] font-medium bg-secondary hover:bg-secondary/70 transition-colors"
            >
              ✕ Back to canvas (Esc)
            </button>
          </div>
          <iframe title="Site preview" srcDoc={previewHtml} className="flex-1 w-full border-0 bg-white" />
        </div>
      )}

      {exportReport && (
        <div className="fixed bottom-4 right-4 z-50 w-80 rounded-lg border border-border bg-popover shadow-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold">Source export</span>
            <button
              type="button"
              onClick={() => setExportReport(null)}
              className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              ✕
            </button>
          </div>
          {exportReport.error ? (
            <p className="text-[11px] text-red-400">{exportReport.error}</p>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              {exportReport.files > 0
                ? `${exportReport.files} file${exportReport.files === 1 ? '' : 's'} exported.`
                : 'No edits to export yet — style a component first.'}
            </p>
          )}
          {exportReport.conflicts.length > 0 && (
            <div className="mt-1.5 border-t border-border pt-1.5">
              <p className="text-[10px] font-medium text-amber-500 mb-0.5">
                {exportReport.conflicts.length} conflict
                {exportReport.conflicts.length === 1 ? '' : 's'} (last edit kept)
              </p>
              {exportReport.conflicts.map((c, i) => (
                <p key={i} className="text-[10px] text-muted-foreground truncate" title={c.reason}>
                  {c.exportName} — {c.filePath}
                </p>
              ))}
            </div>
          )}
          {exportReport.skipped.length > 0 && (
            <div className="mt-1.5 border-t border-border pt-1.5">
              <p className="text-[10px] font-medium text-amber-500 mb-0.5">
                {exportReport.skipped.length} skipped
              </p>
              {exportReport.skipped.map((s, i) => (
                <p key={i} className="text-[10px] text-muted-foreground truncate" title={s.reason}>
                  {s.step}: {s.reason}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
