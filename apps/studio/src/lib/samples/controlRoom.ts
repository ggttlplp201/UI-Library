import { newPageId, type Page } from '../canvas'
import { inst, preset, type SampleProject } from './types'

/**
 * Control Room — the dark-console showcase: every readout, switch, slider,
 * terminal and retro-OS component in the library, grouped into frosted glass
 * bays on a cold near-black stage (Depot's styling, our content).
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
    anim: { preset: 'fade', trigger: 'scroll', duration: 0.5, delay: 0, easing: 'ease-out', once: true },
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
    boardHeight: 2820,
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
        h: 2820,
        args: { accent: '#7fa8bd', base: '#05080b', glowStrength: 0.11 },
      }),
      // — Masthead —
      inst(preset('src/basics/Heading.tsx'), 60, 50, {
        args: { text: 'CONTROL ROOM', size: 72, color: INK, font: DISPLAY, weight: 800, tracking: -0.03, lineHeight: 0.95 },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 62, 145, {
        args: { text: 'READOUTS · SWITCHES · TERMINALS · SYSTEM', size: 12, color: DIM, font: MONO },
      }),
      // — READOUTS —
      zone(80, 210, 'READOUTS'),
      bay(60, 240, 1160, 430),
      inst(preset('src/kinetic-lab/LiquidFill.tsx'), 100, 290, { args: { defaultValue: 64 } }),
      inst(preset('src/kinetic-ui/KineticRingProgress.tsx'), 390, 300, { args: { defaultValue: 82 } }),
      inst(preset('src/text/AnimatedNumbers.tsx', 'AnimatedNumberTicker'), 680, 330, {}),
      inst(preset('src/badges/StatusBadge.tsx'), 1050, 340, {}),
      inst(preset('src/cupertino/CupertinoProgress.tsx'), 100, 560, {}),
      inst(preset('src/chicago95/Win95Progress.tsx'), 480, 560, {}),
      inst(preset('src/feedback/GradientStrokeLoader.tsx'), 850, 540, {}),
      // — SWITCHES —
      zone(80, 710, 'SWITCHES'),
      bay(60, 740, 1160, 480),
      inst(preset('src/toggles/IndustrialSwitch.tsx'), 100, 790, {}),
      inst(preset('src/toggles/BigRedSwitch.tsx'), 350, 790, {}),
      inst(preset('src/toggles/LeverSwitch.tsx'), 580, 790, {}),
      inst(preset('src/toggles/MoonSwitch.tsx'), 800, 795, {}),
      inst(preset('src/kinetic-lab/ElasticToggle.tsx'), 1020, 800, {}),
      inst(preset('src/cupertino/CupertinoSwitch.tsx'), 100, 1030, {}),
      inst(preset('src/cupertino/CupertinoStepper.tsx'), 300, 1030, {}),
      inst(preset('src/toggles/BookmarkToggle.tsx'), 540, 1030, {}),
      inst(preset('src/toggles/ThemeToggleIcons.tsx'), 700, 1035, {}),
      inst(preset('src/toggles/DynamicIslandToggle.tsx'), 880, 1020, {}),
      // — SLIDERS —
      zone(80, 1260, 'SLIDERS'),
      bay(60, 1290, 560, 340),
      inst(preset('src/kinetic-ui/KineticSlider.tsx'), 100, 1350, { w: 260, args: { defaultValue: 36 } }),
      inst(preset('src/kinetic-lab/RadialMenu.tsx'), 420, 1330, {}),
      inst(preset('src/cupertino/CupertinoSlider.tsx'), 100, 1480, {}),
      // — TERMINAL (Glitchtype kit) —
      zone(700, 1260, 'TERMINAL'),
      bay(680, 1290, 540, 340),
      inst(preset('src/glitchtype/GlitchInput.tsx'), 720, 1340, {}),
      inst(preset('src/glitchtype/GlitchToggle.tsx'), 1020, 1345, {}),
      inst(preset('src/glitchtype/GlitchBadge.tsx'), 1020, 1420, {}),
      inst(preset('src/glitchtype/GlitchButton.tsx'), 720, 1440, {}),
      inst(preset('src/glitchtype/GlitchHeading.tsx'), 720, 1520, {}),
      // — TERMINAL CARDS —
      inst(preset('src/glitchtype/TerminalCard.tsx'), 60, 1690, {}),
      inst(preset('src/glitchtype/ScanlinePanel.tsx'), 500, 1690, {}),
      inst(preset('src/glitchtype/GlitchMarquee.tsx'), 60, 1990, {}),
      // — SYSTEM 95 (Chicago 95 kit) —
      zone(80, 2090, 'SYSTEM 95'),
      bay(60, 2120, 1160, 420),
      inst(preset('src/chicago95/Win95Window.tsx'), 100, 2170, {}),
      inst(preset('src/chicago95/Win95Tabs.tsx'), 560, 2170, {}),
      inst(preset('src/chicago95/Win95Dialog.tsx'), 900, 2170, {}),
      inst(preset('src/basics/PanelBand.tsx'), 545, 2400, {
        args: { width: 430, height: 80, background: '#c0c0c0', borderColor: '#808080', radius: 2 },
      }),
      inst(preset('src/chicago95/Win95Checkbox.tsx'), 565, 2425, {}),
      inst(preset('src/chicago95/Win95Tooltip.tsx'), 810, 2425, {}),
      // — CONSOLE row —
      zone(80, 2590, 'CONSOLE'),
      inst(preset('src/basics/Divider.tsx'), 60, 2620, { args: { width: 1160, color: 'rgba(159,194,212,0.25)' } }),
      inst(preset('src/overlays/DynamicIslandDemo.tsx'), 60, 2650, {}),
      inst(preset('src/buttons/MusicToggleButton.tsx'), 700, 2690, {}),
      inst(preset('src/buttons/PushButton3D.tsx'), 950, 2700, {
        args: { label: 'ARM', hue: 205 },
      }),
      inst(preset('src/chicago95/Win95Taskbar.tsx'), 0, 2770, { w: 1280 }),
    ],
  }
  return [page]
}

export const controlRoom: SampleProject = {
  id: 'control-room',
  title: 'Control Room',
  tagline: 'Every instrument in the library, on one dark console',
  detail:
    'Readouts, switch banks, sliders, the full Glitchtype terminal kit and the Chicago 95 system kit — grouped into frosted glass bays with a Win95 taskbar closing the page. All live.',
  accent: ICE,
  build,
}
