import { newPageId, type Page } from '../canvas'
import { inst, preset, type SampleProject } from './types'

/**
 * Component Systems — one dense product-UI surface: navigation, selection,
 * input, toggles, feedback and overlays arranged as a settings screen rather
 * than a catalog grid. Everything is live; open the dropdowns, flip the
 * switches, fire the toast.
 */
function build(): Page[] {
  const page: Page = {
    id: newPageId(),
    name: 'Systems',
    nodeX: 90,
    nodeY: 130,
    artboardWidth: 1280,
    boardHeight: 2050,
    fx: { loader: 'dots', loaderAccent: '#4B3BFF', loaderMs: 800 },
    instances: [
      // Header band: what screen this is.
      inst(preset('src/sections/LampHeader.tsx'), 320, 40, {
        args: {
          title: 'Component systems',
          subtitle: 'One coherent surface — selection, input, feedback, overlays.',
          accent: '#4B3BFF',
          background: '#0a0a0c',
        },
      }),
      // Row 1 — navigation & selection.
      inst(preset('src/kinetic-ui/KineticTabs.tsx'), 140, 440, {}),
      inst(preset('src/kinetic-ui/KineticSegmented.tsx'), 700, 450, {}),
      inst(preset('src/kinetic-ui/KineticChips.tsx'), 1000, 450, {}),
      // Row 2 — text input.
      inst(preset('src/kinetic-ui/KineticInput.tsx'), 140, 650, {}),
      inst(preset('src/inputs/FloatingLabelInput.tsx'), 460, 655, {}),
      inst(preset('src/inputs/SearchInput.tsx'), 760, 650, {}),
      inst(preset('src/inputs/SelectDemo.tsx'), 1040, 640, {}),
      // Row 3 — choice & toggles.
      inst(preset('src/inputs/RadioGroupDemo.tsx'), 140, 850, {}),
      inst(preset('src/kinetic-ui/KineticCheckbox.tsx'), 460, 870, {}),
      inst(preset('src/kinetic-ui/KineticSwitch.tsx'), 760, 870, {}),
      inst(preset('src/toggles/GlossySwitch.tsx'), 1000, 850, {}),
      // Row 4 — feedback.
      inst(preset('src/feedback/AlertBanner.tsx'), 140, 1090, { w: 560 }),
      inst(preset('src/feedback/ProgressBar.tsx'), 140, 1200, { w: 380 }),
      inst(preset('src/kinetic-ui/KineticProgressBar.tsx'), 560, 1200, {}),
      inst(preset('src/feedback/ToasterDemo.tsx'), 760, 1090, {}),
      inst(preset('src/kinetic-ui/KineticToast.tsx'), 1000, 1090, {}),
      // Row 5 — overlays, live.
      inst(preset('src/overlays/DialogDemo.tsx'), 140, 1400, {}),
      inst(preset('src/overlays/DropdownMenuDemo.tsx'), 400, 1400, {}),
      inst(preset('src/overlays/PopoverDemo.tsx'), 660, 1400, {}),
      inst(preset('src/kinetic-ui/KineticTooltip.tsx'), 920, 1400, {}),
      inst(preset('src/kinetic-ui/KineticDropdown.tsx'), 1080, 1400, {}),
      // Row 6 — identity chips.
      inst(preset('src/badges/AvatarChip.tsx'), 140, 1780, {}),
      inst(preset('src/badges/PillBadge.tsx'), 360, 1790, {}),
      inst(preset('src/badges/StatusBadge.tsx'), 560, 1790, {}),
      inst(preset('src/kinetic-ui/KineticBadge.tsx'), 740, 1790, {}),
      inst(preset('src/kinetic-ui/KineticAvatarStack.tsx'), 940, 1770, {}),
    ],
  }
  return [page]
}

export const componentSystems: SampleProject = {
  id: 'component-systems',
  title: 'Component Systems',
  tagline: 'A dense, working product-UI surface',
  detail:
    'Tabs, segmented controls, inputs, radios, switches, alerts, progress, toasts, dialogs, menus and badges — arranged like a settings screen, all live.',
  accent: '#4B3BFF',
  build,
}
