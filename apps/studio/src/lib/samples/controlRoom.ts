import { newPageId, type Page } from '../canvas'
import { inst, preset, type SampleProject } from './types'

/**
 * Control Room — the instrument-panel sample built on Kinetic Lab and the
 * industrial toggles: fills, rings, sliders, switch banks and readouts laid
 * out like a machine console. Green phosphor on near-black.
 */
const PHOSPHOR = '#12A150'

function build(): Page[] {
  const page: Page = {
    id: newPageId(),
    name: 'Control Room',
    nodeX: 90,
    nodeY: 130,
    artboardWidth: 1280,
    boardHeight: 2000,
    fx: {
      loader: 'newtons-cradle',
      loaderAccent: PHOSPHOR,
      loaderMs: 1200,
      cursor: 'glow',
      cursorAccent: PHOSPHOR,
    },
    instances: [
      inst(preset('src/sections/LampHeader.tsx'), 320, 50, {
        args: {
          title: 'Control room',
          subtitle: 'Fills, rings, faders and switch banks — every instrument live.',
          accent: PHOSPHOR,
          background: '#0a0c0a',
        },
      }),
      // — TELEMETRY zone —
      inst(preset('src/basics/Heading.tsx'), 140, 430, { args: { text: 'TELEMETRY', size: 16, color: PHOSPHOR, tracking: 0.18, weight: 600 } }),
      inst(preset('src/basics/PanelBand.tsx'), 100, 470, { args: { width: 1080, height: 300, background: 'rgba(18,161,80,0.05)', borderColor: 'rgba(18,161,80,0.18)' } }),
      inst(preset('src/kinetic-lab/LiquidFill.tsx'), 160, 520, { args: { defaultValue: 64 } }),
      inst(preset('src/kinetic-ui/KineticRingProgress.tsx'), 450, 525, { args: { defaultValue: 82 } }),
      inst(preset('src/text/AnimatedNumbers.tsx', 'AnimatedNumberTicker'), 740, 555, {}),
      inst(preset('src/badges/StatusBadge.tsx'), 1100, 555, {}),
      // — POWER zone —
      inst(preset('src/basics/Heading.tsx'), 140, 850, { args: { text: 'POWER', size: 16, color: PHOSPHOR, tracking: 0.18, weight: 600 } }),
      inst(preset('src/basics/PanelBand.tsx'), 100, 890, { args: { width: 520, height: 300, background: 'rgba(18,161,80,0.05)', borderColor: 'rgba(18,161,80,0.18)' } }),
      inst(preset('src/toggles/IndustrialSwitch.tsx'), 160, 930, {}),
      inst(preset('src/kinetic-lab/ElasticToggle.tsx'), 180, 1090, {}),
      inst(preset('src/kinetic-ui/KineticSwitch.tsx'), 340, 1095, {}),
      // — SIGNAL zone —
      inst(preset('src/basics/Heading.tsx'), 680, 850, { args: { text: 'SIGNAL', size: 16, color: PHOSPHOR, tracking: 0.18, weight: 600 } }),
      inst(preset('src/basics/PanelBand.tsx'), 660, 890, { args: { width: 520, height: 300, background: 'rgba(18,161,80,0.05)', borderColor: 'rgba(18,161,80,0.18)' } }),
      inst(preset('src/kinetic-ui/KineticSlider.tsx'), 700, 950, { w: 260, args: { defaultValue: 36 } }),
      inst(preset('src/kinetic-lab/RadialMenu.tsx'), 980, 935, {}),
      inst(preset('src/feedback/ProgressBar.tsx'), 700, 1090, { w: 280 }),
      // — CONSOLE row —
      inst(preset('src/basics/Heading.tsx'), 140, 1280, { args: { text: 'CONSOLE', size: 16, color: PHOSPHOR, tracking: 0.18, weight: 600 } }),
      inst(preset('src/basics/Divider.tsx'), 140, 1318, { args: { width: 1000, color: 'rgba(18,161,80,0.25)' } }),
      inst(preset('src/overlays/DynamicIslandDemo.tsx'), 140, 1360, {}),
      inst(preset('src/buttons/MusicToggleButton.tsx'), 720, 1400, {}),
      inst(preset('src/buttons/PushButton3D.tsx'), 950, 1410, {
        args: { label: 'ARM', hue: 130 },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 142, 1700, {
        args: { text: 'Every instrument on this panel is a live component — drag a switch, spin the ring, arm the relay.', maxWidth: 520, size: 13, color: '#7fae91' },
      }),
      inst(preset('src/text/TextShimmer.tsx'), 140, 1780, {
        args: { children: 'ALL SYSTEMS NOMINAL' },
        style: { fontSize: 18 },
      }),
    ],
  }
  return [page]
}

export const controlRoom: SampleProject = {
  id: 'control-room',
  title: 'Control Room',
  tagline: 'An instrument panel, every control live',
  detail:
    'Liquid fills, progress rings, faders, industrial switch banks, readouts and a dynamic-island console — machined dark hardware energy.',
  accent: PHOSPHOR,
  build,
}
