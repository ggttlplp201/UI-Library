import { newPageId, type Page } from '../canvas'
import { inst, preset, type SampleProject } from './types'

/**
 * Control Room — the instrument panel in the Depot register, effects and
 * all: a frosted glass console floats over full-bleed photography, its mono
 * index inverts row by row and swaps the photograph behind the glass as you
 * hover. Glass bays of live instruments below, ice-blue signal throughout.
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

/** Oversized stat numeral + mono sublabel, Depot console-floor style. */
const stat = (x: number, y: number, value: string, label: string) => [
  inst(preset('src/basics/Heading.tsx'), x, y, {
    args: { text: value, size: 40, color: INK, font: DISPLAY, weight: 700 },
  }),
  inst(preset('src/basics/TextBlock.tsx'), x, y + 52, {
    args: { text: label, size: 9, color: DIM, font: MONO, lineHeight: 1.5 },
  }),
]

function build(): Page[] {
  const page: Page = {
    id: newPageId(),
    name: 'Control Room',
    nodeX: 90,
    nodeY: 130,
    artboardWidth: 1280,
    boardHeight: 2400,
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
        h: 2400,
        args: { accent: '#7fa8bd', base: '#05080b', glowStrength: 0.11 },
      }),
      // — The hero IS the effect: hover a row, the photograph behind the
      //   glass swaps and the row floods white.
      inst(preset('src/sections/ImageRevealIndex.tsx'), 0, 0, {
        w: 1280,
        h: 860,
        args: {
          brand: 'CONTROL ROOM',
          tagline: 'THOUGHTFUL FROM START TO FINISH\n— PRECISE, SIMPLE, EFFECTIVE.',
          nav: 'PANEL | TELEMETRY | POWER | CALL',
          label: 'INSTRUMENTS',
          header: 'NAME | TYPE | YEAR',
          rows: 'HOLO | IDENTITY | 2027\nNEURAL | BRANDING | 2028\nFLUX | CAMPAIGN | 2028\nGHOST | INTERFACE | 2029\nPULSE | VISUALS | 2026\nNANO | NARRATIVE | 2029\nECHO | MATE | 2030\nPHOTON | LAUNCH | 2030',
          width: 1280,
          height: 860,
          ink: INK,
          hoverBg: INK,
          hoverInk: '#05080b',
        },
      }),
      // Stat numerals land on the open floor of the glass console.
      ...stat(370, 650, '29+', 'COMPLETED\nPROJECTS'),
      ...stat(520, 650, '75K+', 'MONTHLY ORGANIC\nTRAFFIC'),
      ...stat(690, 650, '98%', 'PANEL HAPPINESS\nINDEX'),
      ...stat(845, 650, '2M+', 'SIGNALS\nSERVED'),
      // — TELEMETRY bay —
      zone(80, 920, 'TELEMETRY'),
      bay(60, 950, 540, 430),
      inst(preset('src/kinetic-lab/LiquidFill.tsx'), 100, 1000, { args: { defaultValue: 64 } }),
      inst(preset('src/kinetic-ui/KineticRingProgress.tsx'), 380, 1010, { args: { defaultValue: 82 } }),
      inst(preset('src/text/AnimatedNumbers.tsx', 'AnimatedNumberTicker'), 100, 1255, {}),
      inst(preset('src/badges/StatusBadge.tsx'), 460, 1265, {}),
      // — POWER bay —
      zone(700, 920, 'POWER'),
      bay(680, 950, 540, 430),
      inst(preset('src/toggles/IndustrialSwitch.tsx'), 720, 995, {}),
      inst(preset('src/kinetic-lab/ElasticToggle.tsx'), 730, 1205, {}),
      inst(preset('src/cupertino/CupertinoSwitch.tsx'), 900, 1205, {}),
      inst(preset('src/cupertino/CupertinoStepper.tsx'), 900, 1295, {}),
      // — SIGNAL bay —
      zone(80, 1435, 'SIGNAL'),
      bay(60, 1465, 540, 400),
      inst(preset('src/kinetic-ui/KineticSlider.tsx'), 100, 1525, { w: 260, args: { defaultValue: 36 } }),
      inst(preset('src/kinetic-lab/RadialMenu.tsx'), 400, 1505, {}),
      inst(preset('src/cupertino/CupertinoSlider.tsx'), 100, 1655, {}),
      inst(preset('src/cupertino/CupertinoProgress.tsx'), 100, 1765, {}),
      // — SYSTEM bay —
      zone(700, 1435, 'SYSTEM'),
      bay(680, 1465, 540, 400),
      inst(preset('src/navigation/SettingsNavList.tsx'), 720, 1510, {}),
      // — CONSOLE row —
      zone(80, 1925, 'CONSOLE'),
      inst(preset('src/basics/Divider.tsx'), 60, 1955, { args: { width: 1160, color: 'rgba(159,194,212,0.25)' } }),
      inst(preset('src/overlays/DynamicIslandDemo.tsx'), 60, 1995, {}),
      inst(preset('src/buttons/MusicToggleButton.tsx'), 700, 2035, {}),
      inst(preset('src/buttons/PushButton3D.tsx'), 950, 2045, {
        args: { label: 'ARM', hue: 205 },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 62, 2255, {
        args: {
          text: 'EVERY INSTRUMENT ON THIS PANEL IS LIVE — DRAG A FADER, SPIN THE RING, ARM THE RELAY.',
          maxWidth: 560,
          size: 11,
          color: DIM,
          font: MONO,
        },
      }),
      inst(preset('src/text/TextShimmer.tsx'), 60, 2315, {
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
  tagline: 'Glass console over photography that answers your cursor',
  detail:
    'A frosted console floats over full-bleed photography — hover the mono index and each row floods white while the photograph behind the glass swaps. Glass bays of live instruments below: fills, rings, faders, switch banks, Cupertino glass and a dynamic island.',
  accent: ICE,
  build,
}
