import { newPageId, type Page } from '../canvas'
import { inst, preset, type SampleProject } from './types'

/**
 * Control Room — the instrument panel rebuilt in the Depot register: one
 * frosted glass console over a cold near-black stage, mono data tables,
 * oversized stat numerals, and flanking glass bays of live instruments.
 * Ice-blue signal instead of chrome.
 */
const ICE = '#9FC2D4'
const INK = '#eef3f6'
const DIM = 'rgba(238,243,246,0.55)'
const MONO = "'IBM Plex Mono', ui-monospace, monospace"
const DISPLAY = "'Inter Tight', system-ui, sans-serif"

const GLASS = 'rgba(16,22,27,0.55)'
const GLASS_EDGE = 'rgba(255,255,255,0.13)'

/** Mono zone label above a glass bay. */
const zone = (x: number, y: number, text: string) =>
  inst(preset('src/basics/TextBlock.tsx'), x, y, {
    args: { text, size: 12, color: ICE, font: MONO },
  })

/** Frosted glass bay. */
const bay = (x: number, y: number, width: number, height: number) =>
  inst(preset('src/basics/PanelBand.tsx'), x, y, {
    args: { width, height, background: GLASS, borderColor: GLASS_EDGE, radius: 18 },
  })

function build(): Page[] {
  const page: Page = {
    id: newPageId(),
    name: 'Control Room',
    nodeX: 90,
    nodeY: 130,
    artboardWidth: 1280,
    boardHeight: 2200,
    fx: {
      loader: 'newtons-cradle',
      loaderAccent: ICE,
      loaderMs: 1200,
      cursor: 'glow',
      cursorAccent: ICE,
    },
    instances: [
      inst(preset('src/basics/PageBackdrop.tsx'), 0, 0, {
        w: 1280,
        h: 2200,
        args: { accent: '#7fa8bd', base: '#05080b', glowStrength: 0.11 },
      }),
      // — The console: wordmark, mono table, stat numerals in one glass slab —
      bay(300, 60, 680, 600),
      inst(preset('src/basics/Heading.tsx'), 344, 105, {
        args: { text: 'CONTROL ROOM', size: 28, color: INK, font: DISPLAY, weight: 800, tracking: -0.01 },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 700, 108, {
        args: {
          text: 'THOUGHTFUL FROM START TO FINISH\n— PRECISE, SIMPLE, EFFECTIVE.',
          size: 10,
          color: DIM,
          font: MONO,
          lineHeight: 1.6,
          maxWidth: 250,
        },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 344, 180, {
        args: { text: 'PANEL', size: 11, color: DIM, font: MONO },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 344, 215, {
        args: {
          text: 'HOLO\nNEURAL\nFLUX\nGHOST\nPULSE\nNANO\nECHO\nPHOTON',
          size: 12,
          color: INK,
          font: MONO,
          lineHeight: 1.9,
        },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 590, 215, {
        args: {
          text: 'IDENTITY\nBRANDING\nCAMPAIGN\nINTERFACE\nVISUALS\nNARRATIVE\nMATE\nLAUNCH',
          size: 12,
          color: DIM,
          font: MONO,
          lineHeight: 1.9,
        },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 860, 215, {
        args: {
          text: '2027\n2028\n2028\n2029\n2026\n2029\n2030\n2030',
          size: 12,
          color: DIM,
          font: MONO,
          lineHeight: 1.9,
        },
      }),
      // Stat numerals along the console floor.
      inst(preset('src/basics/Heading.tsx'), 344, 500, {
        args: { text: '29+', size: 36, color: INK, font: DISPLAY, weight: 700 },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 344, 548, {
        args: { text: 'COMPLETED\nPROJECTS', size: 9, color: DIM, font: MONO, lineHeight: 1.5 },
      }),
      inst(preset('src/basics/Heading.tsx'), 505, 500, {
        args: { text: '75K+', size: 36, color: INK, font: DISPLAY, weight: 700 },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 505, 548, {
        args: { text: 'MONTHLY ORGANIC\nTRAFFIC', size: 9, color: DIM, font: MONO, lineHeight: 1.5 },
      }),
      inst(preset('src/basics/Heading.tsx'), 690, 500, {
        args: { text: '98%', size: 36, color: INK, font: DISPLAY, weight: 700 },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 690, 548, {
        args: { text: 'PANEL HAPPINESS\nINDEX', size: 9, color: DIM, font: MONO, lineHeight: 1.5 },
      }),
      inst(preset('src/basics/Heading.tsx'), 855, 500, {
        args: { text: '2M+', size: 36, color: INK, font: DISPLAY, weight: 700 },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 855, 548, {
        args: { text: 'SIGNALS\nSERVED', size: 9, color: DIM, font: MONO, lineHeight: 1.5 },
      }),
      // — TELEMETRY bay —
      zone(80, 715, 'TELEMETRY'),
      bay(60, 745, 540, 430),
      inst(preset('src/kinetic-lab/LiquidFill.tsx'), 100, 795, { args: { defaultValue: 64 } }),
      inst(preset('src/kinetic-ui/KineticRingProgress.tsx'), 380, 805, { args: { defaultValue: 82 } }),
      inst(preset('src/text/AnimatedNumbers.tsx', 'AnimatedNumberTicker'), 100, 1050, {}),
      inst(preset('src/badges/StatusBadge.tsx'), 460, 1060, {}),
      // — POWER bay —
      zone(700, 715, 'POWER'),
      bay(680, 745, 540, 430),
      inst(preset('src/toggles/IndustrialSwitch.tsx'), 720, 790, {}),
      inst(preset('src/kinetic-lab/ElasticToggle.tsx'), 730, 1000, {}),
      inst(preset('src/cupertino/CupertinoSwitch.tsx'), 900, 1000, {}),
      inst(preset('src/cupertino/CupertinoStepper.tsx'), 900, 1090, {}),
      // — SIGNAL bay —
      zone(80, 1230, 'SIGNAL'),
      bay(60, 1260, 540, 400),
      inst(preset('src/kinetic-ui/KineticSlider.tsx'), 100, 1320, { w: 260, args: { defaultValue: 36 } }),
      inst(preset('src/kinetic-lab/RadialMenu.tsx'), 400, 1300, {}),
      inst(preset('src/cupertino/CupertinoSlider.tsx'), 100, 1450, {}),
      inst(preset('src/cupertino/CupertinoProgress.tsx'), 100, 1560, {}),
      // — SYSTEM bay —
      zone(700, 1230, 'SYSTEM'),
      bay(680, 1260, 540, 400),
      inst(preset('src/navigation/SettingsNavList.tsx'), 720, 1305, {}),
      // — CONSOLE row —
      zone(80, 1720, 'CONSOLE'),
      inst(preset('src/basics/Divider.tsx'), 60, 1750, { args: { width: 1160, color: 'rgba(159,194,212,0.25)' } }),
      inst(preset('src/overlays/DynamicIslandDemo.tsx'), 60, 1790, {}),
      inst(preset('src/buttons/MusicToggleButton.tsx'), 700, 1830, {}),
      inst(preset('src/buttons/PushButton3D.tsx'), 950, 1840, {
        args: { label: 'ARM', hue: 205 },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 62, 2050, {
        args: {
          text: 'EVERY INSTRUMENT ON THIS PANEL IS LIVE — DRAG A FADER, SPIN THE RING, ARM THE RELAY.',
          maxWidth: 560,
          size: 11,
          color: DIM,
          font: MONO,
        },
      }),
      inst(preset('src/text/TextShimmer.tsx'), 60, 2110, {
        args: { children: 'ALL SYSTEMS NOMINAL' },
        style: { fontSize: 18, fontFamily: MONO },
      }),
    ],
  }
  return [page]
}

export const controlRoom: SampleProject = {
  id: 'control-room',
  title: 'Control Room',
  tagline: 'A frosted console over a cold dark stage',
  detail:
    'One glass console with mono tables and oversized stat numerals, flanked by glass bays of live instruments — liquid fills, rings, faders, switch banks, Cupertino glass controls and a dynamic-island console.',
  accent: ICE,
  build,
}
