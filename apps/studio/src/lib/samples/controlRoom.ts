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
    boardHeight: 1700,
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
      // Gauge row.
      inst(preset('src/kinetic-lab/LiquidFill.tsx'), 140, 440, { args: { defaultValue: 64 } }),
      inst(preset('src/kinetic-ui/KineticRingProgress.tsx'), 430, 445, { args: { defaultValue: 82 } }),
      inst(preset('src/kinetic-ui/KineticSlider.tsx'), 720, 470, { args: { defaultValue: 36 } }),
      inst(preset('src/kinetic-lab/RadialMenu.tsx'), 1040, 430, {}),
      // Switch bank.
      inst(preset('src/toggles/IndustrialSwitch.tsx'), 140, 760, {}),
      inst(preset('src/toggles/IndustrialSwitch.tsx'), 400, 760, { args: { ledColor: '#E5484D' } }),
      inst(preset('src/kinetic-lab/ElasticToggle.tsx'), 680, 780, {}),
      inst(preset('src/kinetic-ui/KineticSwitch.tsx'), 950, 790, {}),
      // Readouts.
      inst(preset('src/feedback/ProgressBar.tsx'), 140, 1030, { w: 460 }),
      inst(preset('src/text/AnimatedNumbers.tsx'), 680, 1000, {}),
      inst(preset('src/badges/StatusBadge.tsx'), 1040, 1010, {}),
      // Console island + spark.
      inst(preset('src/overlays/DynamicIslandDemo.tsx'), 140, 1200, {}),
      inst(preset('src/buttons/MusicToggleButton.tsx'), 720, 1230, {}),
      inst(preset('src/buttons/PushButton3D.tsx'), 950, 1240, {
        args: { label: 'ARM', hue: 130 },
      }),
      inst(preset('src/text/TextShimmer.tsx'), 140, 1520, {
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
