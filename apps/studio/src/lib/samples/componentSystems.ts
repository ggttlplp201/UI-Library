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
    boardHeight: 2350,
    fx: { loader: 'dots', loaderAccent: '#4B3BFF', loaderMs: 800 },
    instances: [
      inst(preset('src/basics/PageBackdrop.tsx'), 0, 0, {
        w: 1280,
        h: 2350,
        args: { accent: '#4B3BFF', base: '#0a0a0f', glowStrength: 0.14 },
      }),
      // Header band: what screen this is.
      inst(preset('src/sections/LampHeader.tsx'), 320, 40, {
        args: {
          title: 'Component systems',
          subtitle: 'One coherent surface — selection, input, feedback, overlays.',
          accent: '#4B3BFF',
          background: 'transparent',
        },
      }),
      // — Selection —
      inst(preset('src/basics/Heading.tsx'), 140, 430, { args: { text: 'Selection', size: 22 } }),
      inst(preset('src/basics/Divider.tsx'), 140, 472, { args: { width: 1000 } }),
      inst(preset('src/kinetic-ui/KineticTabs.tsx'), 140, 510, {}),
      inst(preset('src/kinetic-ui/KineticSegmented.tsx'), 700, 520, {}),
      inst(preset('src/kinetic-ui/KineticChips.tsx'), 700, 620, {}),
      // — Input —
      inst(preset('src/basics/Heading.tsx'), 140, 700, { args: { text: 'Input', size: 22 } }),
      inst(preset('src/basics/Divider.tsx'), 140, 742, { args: { width: 1000 } }),
      inst(preset('src/kinetic-ui/KineticInput.tsx'), 140, 790, {}),
      inst(preset('src/inputs/FloatingLabelInput.tsx'), 460, 795, {}),
      inst(preset('src/inputs/SearchInput.tsx'), 760, 790, {}),
      inst(preset('src/inputs/SelectDemo.tsx'), 1010, 780, {}),
      // — Choice & switches —
      inst(preset('src/basics/Heading.tsx'), 140, 980, { args: { text: 'Choice & switches', size: 22 } }),
      inst(preset('src/basics/Divider.tsx'), 140, 1022, { args: { width: 1000 } }),
      inst(preset('src/inputs/RadioGroupDemo.tsx'), 140, 1070, {}),
      inst(preset('src/kinetic-ui/KineticCheckbox.tsx'), 460, 1090, {}),
      inst(preset('src/kinetic-ui/KineticSwitch.tsx'), 760, 1090, {}),
      inst(preset('src/toggles/GlossySwitch.tsx'), 1060, 1075, {}),
      // — Feedback —
      inst(preset('src/basics/Heading.tsx'), 140, 1300, { args: { text: 'Feedback', size: 22 } }),
      inst(preset('src/basics/Divider.tsx'), 140, 1342, { args: { width: 1000 } }),
      inst(preset('src/feedback/AlertBanner.tsx'), 140, 1390, { w: 560 }),
      inst(preset('src/feedback/ProgressBar.tsx'), 140, 1500, { w: 380 }),
      inst(preset('src/kinetic-ui/KineticProgressBar.tsx'), 560, 1500, {}),
      inst(preset('src/feedback/ToasterDemo.tsx'), 760, 1390, {}),
      inst(preset('src/kinetic-ui/KineticToast.tsx'), 140, 1600, {}),
      // — Overlays (grouped on a quiet panel) —
      inst(preset('src/basics/Heading.tsx'), 140, 1650, { args: { text: 'Overlays', size: 22 } }),
      inst(preset('src/basics/PanelBand.tsx'), 100, 1700, { args: { width: 1080, height: 240 } }),
      inst(preset('src/overlays/DialogDemo.tsx'), 160, 1750, {}),
      inst(preset('src/overlays/DropdownMenuDemo.tsx'), 420, 1750, {}),
      inst(preset('src/overlays/PopoverDemo.tsx'), 680, 1750, {}),
      inst(preset('src/kinetic-ui/KineticTooltip.tsx'), 940, 1750, {}),
      inst(preset('src/kinetic-ui/KineticDropdown.tsx'), 1045, 1750, {}),
      // — Identity —
      inst(preset('src/basics/Heading.tsx'), 140, 2020, { args: { text: 'Identity', size: 22 } }),
      inst(preset('src/basics/Divider.tsx'), 140, 2062, { args: { width: 1000 } }),
      inst(preset('src/badges/AvatarChip.tsx'), 140, 2110, {}),
      inst(preset('src/badges/PillBadge.tsx'), 360, 2120, {}),
      inst(preset('src/badges/StatusBadge.tsx'), 560, 2120, {}),
      inst(preset('src/kinetic-ui/KineticBadge.tsx'), 740, 2120, {}),
      inst(preset('src/kinetic-ui/KineticAvatarStack.tsx'), 940, 2100, {}),
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
