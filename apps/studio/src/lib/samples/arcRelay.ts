import { newPageId, type Page } from '../canvas'
import { inst, preset, type SampleProject } from './types'

/**
 * ARC RELAY — brutalist launch signage in the Neonflux register: a flat
 * black stage, a colossal edge-to-edge wordmark, mono catalog numbers in the
 * corners, spec-sheet blocks, and one amber signal color. Voltura's
 * dark-luxe telemetry carries the specs page.
 */
const AMBER = '#E3B23C'
const INK = '#f4f2ec'
const MUTED = '#b0aa9c'
const DISPLAY = "'Inter Tight', system-ui, sans-serif"
const MONO = "'Space Mono', ui-monospace, monospace"

function build(): Page[] {
  const launchId = newPageId()
  const specsId = newPageId()
  const accessId = newPageId()

  const launch: Page = {
    id: launchId,
    name: 'Launch',
    nodeX: 90,
    nodeY: 130,
    artboardWidth: 1280,
    boardHeight: 3160,
    fx: { loader: 'orbit', loaderAccent: AMBER, loaderMs: 1300, cursor: 'glow', cursorAccent: AMBER },
    instances: [
      inst(preset('src/basics/PageBackdrop.tsx'), 0, 0, {
        w: 1280,
        h: 3160,
        args: { accent: AMBER, base: '#0a0a0a', glowStrength: 0.05 },
      }),
      inst(preset('src/sections/SiteNavbar.tsx'), 0, 0, {
        w: 1280,
        args: { brand: 'ARC RELAY', links: 'Launch, Specs, Access', cta: 'Request access' },
        links: { cta: accessId, Launch: launchId, Specs: specsId, Access: accessId },
        style: { backgroundColor: 'rgba(10,10,10,0.92)', color: INK },
      }),
      // — Catalog corners, then the wordmark takes the whole stage —
      inst(preset('src/basics/TextBlock.tsx'), 60, 130, {
        args: { text: 'No.', size: 14, color: INK, font: MONO },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 1140, 130, {
        args: { text: '001', size: 14, color: AMBER, font: MONO, align: 'right', maxWidth: 80 },
      }),
      inst(preset('src/text/SplitText.tsx'), 45, 190, {
        w: 1200,
        args: { text: 'ARC RELAY' },
        style: { fontSize: 168, color: INK, fontWeight: '800', fontFamily: DISPLAY, letterSpacing: '-0.04em', lineHeight: 0.9 },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 410, 470, {
        args: {
          text: 'A desk-scale signal machine — one cable between your hands and the software.',
          size: 15,
          color: MUTED,
          align: 'center',
          maxWidth: 460,
          font: MONO,
        },
      }),
      inst(preset('src/buttons/ShimmerButton.tsx'), 480, 580, {
        args: { children: 'Request access', shimmerColor: AMBER, background: 'rgba(10,10,10,1)' },
        linkTo: accessId,
      }),
      inst(preset('src/buttons/GhostButton.tsx'), 700, 590, {
        args: { children: 'Read the specs' },
        linkTo: specsId,
        style: { color: MUTED },
      }),
      // — 01 · the signal, measured —
      inst(preset('src/basics/TextBlock.tsx'), 60, 780, {
        args: { text: '01 — SIGNAL, MEASURED', size: 12, color: AMBER, font: MONO },
      }),
      inst(preset('src/basics/Heading.tsx'), 60, 815, {
        args: { text: 'The signal, measured.', size: 52, color: INK, font: DISPLAY, tracking: -0.03, lineHeight: 0.95 },
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.6, delay: 0, easing: 'ease-out', once: true },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 62, 895, {
        args: {
          text: 'Every relay ships with its own numbers. Not projections — measurements from the unit on your desk, updated as it runs.',
          maxWidth: 540,
          color: MUTED,
        },
      }),
      inst(preset('src/basics/PanelBand.tsx'), 60, 1000, {
        args: { width: 1160, height: 210, background: 'rgba(244,242,236,0.03)', borderColor: 'rgba(244,242,236,0.1)', radius: 4 },
      }),
      inst(preset('src/cards/StatCard.tsx'), 110, 1040, {
        args: { label: 'Round-trip latency', value: '12 ms', delta: '1.1 ms under spec', background: '#121110', color: INK },
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.6, delay: 0, easing: 'ease-out', once: true },
      }),
      inst(preset('src/cards/StatCard.tsx'), 480, 1040, {
        args: { label: 'Relay nodes online', value: '240', delta: '12 new this week', background: '#121110', color: INK },
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.6, delay: 0.1, easing: 'ease-out', once: true },
      }),
      inst(preset('src/cards/StatCard.tsx'), 850, 1040, {
        args: { label: 'Signal integrity', value: '99.99%', delta: '0.002% packet loss', background: '#121110', color: INK },
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.6, delay: 0.2, easing: 'ease-out', once: true },
      }),
      // — 02 · one cable (copy left, hardware right) —
      inst(preset('src/basics/TextBlock.tsx'), 60, 1330, {
        args: { text: '02 — ONE CABLE', size: 12, color: AMBER, font: MONO },
      }),
      inst(preset('src/basics/Heading.tsx'), 60, 1365, {
        args: { text: 'One cable.\nEvery instrument.', size: 56, color: INK, font: DISPLAY, tracking: -0.03, lineHeight: 0.95 },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 62, 1520, {
        args: {
          text: 'Arc Relay sits between your controllers and your software. It reads every knob, fader and key you own, converts them to one protocol, and delivers them with the latency of a wired keypress.\n\nNo drivers. No mapping software. Plug it in and the machine listens.',
          maxWidth: 460,
          color: MUTED,
        },
      }),
      inst(preset('src/basics/ImageBlock.tsx'), 700, 1360, {
        args: {
          imageSrc: 'https://picsum.photos/seed/arc-bench/880/560?grayscale',
          width: 440,
          height: 300,
          radius: 4,
          caption: 'FIELD TEST — WK 30.',
        },
        anim: { preset: 'fade', trigger: 'scroll', duration: 0.8, delay: 0, easing: 'ease-out', once: true },
      }),
      // — 03 · hold it —
      inst(preset('src/basics/TextBlock.tsx'), 60, 1810, {
        args: { text: '03 — HOLD IT FIRST', size: 12, color: AMBER, font: MONO },
      }),
      inst(preset('src/basics/Heading.tsx'), 60, 1845, {
        args: { text: 'Hold it before you buy it.', size: 40, color: INK, font: DISPLAY, tracking: -0.03 },
      }),
      inst(preset('src/scroll/StickyCardZoom.tsx'), 140, 1920, {
        anim: { preset: 'fade', trigger: 'scroll', duration: 0.8, delay: 0, easing: 'ease-out', once: true },
      }),
      // — Ticker + close —
      inst(preset('src/voltura/TickerRow.tsx'), 140, 2620, { w: 1000 }),
      inst(preset('src/basics/Heading.tsx'), 0, 2740, {
        w: 1280,
        args: { text: 'The relay opens soon.', size: 72, color: INK, font: DISPLAY, weight: 800, tracking: -0.04, align: 'center', lineHeight: 0.95 },
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.6, delay: 0, easing: 'ease-out', once: true },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 390, 2840, {
        args: { text: 'FIRST RUN IS 500 UNITS. SIGNAL INTEGRITY OVER HYPE.', size: 12, color: MUTED, font: MONO, align: 'center', maxWidth: 500 },
      }),
      inst(preset('src/buttons/SparkleButton.tsx'), 555, 2890, {
        args: { label: 'Request access' },
        linkTo: accessId,
      }),
      inst(preset('src/sections/SiteFooter.tsx'), 0, 3000, {
        w: 1280,
        args: { brand: 'ARC RELAY', links: 'Launch, Specs, Access', copyright: '© 2026 Arc Industries.' },
        links: { Launch: launchId, Specs: specsId, Access: accessId },
        style: { backgroundColor: 'rgba(10,10,10,0.92)', color: INK },
      }),
    ],
  }

  const specs: Page = {
    id: specsId,
    name: 'Specs',
    nodeX: 340,
    nodeY: 130,
    artboardWidth: 1280,
    boardHeight: 1760,
    fx: { loader: 'bar', loaderAccent: AMBER, loaderMs: 900, cursor: 'glow', cursorAccent: AMBER },
    instances: [
      inst(preset('src/basics/PageBackdrop.tsx'), 0, 0, {
        w: 1280,
        h: 1760,
        args: { accent: AMBER, base: '#0a0a0a', glowStrength: 0.05 },
      }),
      inst(preset('src/sections/SiteNavbar.tsx'), 0, 0, {
        w: 1280,
        args: { brand: 'ARC RELAY', links: 'Launch, Specs, Access', cta: 'Request access' },
        links: { cta: accessId, Launch: launchId, Specs: specsId, Access: accessId },
        style: { backgroundColor: 'rgba(10,10,10,0.92)', color: INK },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 60, 120, {
        args: { text: 'No.', size: 14, color: INK, font: MONO },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 1140, 120, {
        args: { text: '002', size: 14, color: AMBER, font: MONO, align: 'right', maxWidth: 80 },
      }),
      inst(preset('src/basics/Heading.tsx'), 55, 170, {
        args: { text: 'Under the hood', size: 108, color: INK, font: DISPLAY, tracking: -0.04, weight: 800, lineHeight: 0.9 },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 62, 300, {
        args: { text: 'INSTRUMENTED, MEASURED, AND HONEST ABOUT BOTH.', size: 12, color: MUTED, font: MONO },
      }),
      // — 01 · interface & protocol —
      inst(preset('src/basics/TextBlock.tsx'), 60, 420, {
        args: { text: '01 — INTERFACE & PROTOCOL', size: 12, color: AMBER, font: MONO },
      }),
      inst(preset('src/voltura/VolturaTabs.tsx'), 60, 480, {}),
      inst(preset('src/disclosure/AccordionDemo.tsx'), 660, 470, {}),
      // — 02 · live telemetry (voltura dark-luxe instruments) —
      inst(preset('src/basics/TextBlock.tsx'), 60, 950, {
        args: { text: '02 — LIVE TELEMETRY', size: 12, color: AMBER, font: MONO },
      }),
      inst(preset('src/basics/PanelBand.tsx'), 60, 1000, {
        args: { width: 1160, height: 330, background: 'rgba(216,194,106,0.04)', borderColor: 'rgba(216,194,106,0.16)', radius: 4 },
      }),
      inst(preset('src/voltura/DepthMeter.tsx'), 110, 1050, {}),
      inst(preset('src/voltura/SparkStat.tsx'), 470, 1060, {}),
      inst(preset('src/voltura/PositionBadge.tsx'), 830, 1070, {}),
      inst(preset('src/voltura/TickerRow.tsx'), 140, 1400, { w: 1000 }),
      inst(preset('src/buttons/GhostButton.tsx'), 60, 1620, {
        args: { children: '← Back to launch' },
        linkTo: launchId,
      }),
    ],
  }

  const access: Page = {
    id: accessId,
    name: 'Access',
    nodeX: 590,
    nodeY: 130,
    artboardWidth: 1280,
    boardHeight: 1100,
    fx: { loader: 'newtons-cradle', loaderAccent: AMBER, loaderMs: 1100, cursor: 'glow', cursorAccent: AMBER },
    instances: [
      inst(preset('src/backgrounds/Meteors.tsx'), 0, 0, {
        w: 1280,
        h: 1040,
        args: { count: 10, accent: '#8a8272', background: '#0a0a0a' },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 60, 80, {
        args: { text: 'No.', size: 14, color: INK, font: MONO },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 1140, 80, {
        args: { text: '003', size: 14, color: AMBER, font: MONO, align: 'right', maxWidth: 80 },
      }),
      inst(preset('src/basics/Heading.tsx'), 445, 120, {
        args: { text: 'Access is limited.', size: 44, color: INK, font: DISPLAY, tracking: -0.03 },
      }),
      inst(preset('src/cards/BrutalistNewsletterCard.tsx'), 490, 210, {
        args: {
          title: 'REQUEST ACCESS',
          description: 'First batch ships to 500 desks. No spam — one confirmation, one shipping note.',
          buttonLabel: 'JOIN THE LIST',
          accent: AMBER,
        },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 475, 660, {
        args: {
          text: 'ONE UNIT PER PERSON.',
          maxWidth: 330,
          size: 11,
          color: '#8a8578',
          font: MONO,
        },
      }),
      inst(preset('src/buttons/GhostButton.tsx'), 561, 780, {
        args: { children: '← Back to launch' },
        linkTo: launchId,
        style: { color: MUTED },
      }),
    ],
  }

  return [launch, specs, access]
}

export const arcRelay: SampleProject = {
  id: 'arc-relay',
  title: 'Arc Relay',
  tagline: 'Brutalist launch signage, 3 linked pages',
  detail:
    'A colossal edge-to-edge wordmark on a flat black stage, mono catalog numbers, spec-sheet stat blocks, a scroll set-piece, and dark-luxe Voltura telemetry — one amber signal over everything.',
  accent: AMBER,
  build,
}
