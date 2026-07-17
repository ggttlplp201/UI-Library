import { newPageId, type Page } from '../canvas'
import { inst, preset, type SampleProject } from './types'

/**
 * Component Workbench — the systems catalog restaged as a cutting mat in the
 * Portfolio-Workbench register: a saturated orange field, white ink
 * annotations, and dashed specimen frames with centered labels. Every unit
 * pinned to the mat is live.
 */
const ORANGE = '#F94A00'
const PAPER = 'rgba(255,255,255,0.94)'
const DISPLAY = "'Archivo Black', 'Arial Black', sans-serif"
const NOTE = "'Space Grotesk', system-ui, sans-serif"

/** Dashed cutting-mat frame. */
const frame = (x: number, y: number, width: number, height: number) =>
  inst(preset('src/basics/PanelBand.tsx'), x, y, {
    args: {
      width,
      height,
      background: 'transparent',
      borderColor: PAPER,
      borderStyle: 'dashed',
      borderWidth: 2,
      radius: 2,
    },
  })

/** Centered white specimen label under a frame. */
const label = (x: number, y: number, width: number, text: string) =>
  inst(preset('src/basics/TextBlock.tsx'), x, y, {
    w: width,
    args: { text, size: 15, color: '#ffffff', align: 'center', maxWidth: width, font: NOTE },
    style: { fontWeight: '600' },
  })

function build(): Page[] {
  const page: Page = {
    id: newPageId(),
    name: 'Workbench',
    nodeX: 90,
    nodeY: 130,
    artboardWidth: 1280,
    boardHeight: 2480,
    fx: { loader: 'dots', loaderAccent: '#ffffff', loaderMs: 800 },
    instances: [
      inst(preset('src/basics/PageBackdrop.tsx'), 0, 0, {
        w: 1280,
        h: 2480,
        args: { accent: '#ff7a3c', base: ORANGE, glowStrength: 0.1 },
      }),
      // — Masthead + working note —
      inst(preset('src/basics/Heading.tsx'), 60, 60, {
        args: { text: 'Component\nWorkbench', size: 76, color: '#ffffff', font: DISPLAY, weight: 400, tracking: -0.01, lineHeight: 0.95 },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 900, 80, {
        args: {
          text: 'Every unit on this mat is live. Open the menus, flip the switches, fire the toast — then lift what works onto your own pages.',
          size: 15,
          color: '#ffffff',
          maxWidth: 320,
          font: NOTE,
          lineHeight: 1.45,
        },
      }),
      // — Specimen 01 · Selection —
      frame(60, 280, 1160, 290),
      inst(preset('src/kinetic-ui/KineticTabs.tsx'), 100, 330, {}),
      inst(preset('src/kinetic-ui/KineticSegmented.tsx'), 680, 340, {}),
      inst(preset('src/kinetic-ui/KineticChips.tsx'), 680, 440, {}),
      label(60, 585, 1160, 'Selection'),
      // — Specimen 02 · Input —
      frame(60, 660, 1160, 250),
      inst(preset('src/kinetic-ui/KineticInput.tsx'), 100, 710, {}),
      inst(preset('src/inputs/FloatingLabelInput.tsx'), 420, 715, {}),
      inst(preset('src/inputs/SearchInput.tsx'), 720, 710, {}),
      inst(preset('src/inputs/SelectDemo.tsx'), 980, 700, {}),
      label(60, 925, 1160, 'Input'),
      // — Specimen 03 · Choice & switches —
      frame(60, 1000, 560, 300),
      inst(preset('src/inputs/RadioGroupDemo.tsx'), 100, 1050, {}),
      inst(preset('src/kinetic-ui/KineticCheckbox.tsx'), 350, 1070, {}),
      inst(preset('src/kinetic-ui/KineticSwitch.tsx'), 100, 1200, {}),
      inst(preset('src/toggles/GlossySwitch.tsx'), 350, 1185, {}),
      label(60, 1315, 560, 'Choice & switches'),
      // — Specimen 04 · Identity —
      frame(660, 1000, 560, 300),
      inst(preset('src/badges/AvatarChip.tsx'), 700, 1050, {}),
      inst(preset('src/badges/PillBadge.tsx'), 920, 1060, {}),
      inst(preset('src/kinetic-ui/KineticBadge.tsx'), 1070, 1060, {}),
      inst(preset('src/kinetic-ui/KineticAvatarStack.tsx'), 700, 1170, {}),
      label(660, 1315, 560, 'Identity'),
      // — Specimen 05 · Feedback —
      frame(60, 1390, 1160, 300),
      inst(preset('src/feedback/AlertBanner.tsx'), 100, 1440, { w: 520 }),
      inst(preset('src/feedback/ProgressBar.tsx'), 100, 1560, { w: 360 }),
      inst(preset('src/kinetic-ui/KineticProgressBar.tsx'), 520, 1560, {}),
      inst(preset('src/feedback/ToasterDemo.tsx'), 700, 1440, {}),
      inst(preset('src/kinetic-ui/KineticToast.tsx'), 660, 1600, {}),
      label(60, 1705, 1160, 'Feedback'),
      // — Specimen 06 · Overlays —
      frame(60, 1780, 1160, 260),
      inst(preset('src/overlays/DialogDemo.tsx'), 100, 1830, {}),
      inst(preset('src/overlays/DropdownMenuDemo.tsx'), 340, 1830, {}),
      inst(preset('src/overlays/PopoverDemo.tsx'), 580, 1830, {}),
      inst(preset('src/kinetic-ui/KineticTooltip.tsx'), 820, 1830, {}),
      inst(preset('src/kinetic-ui/KineticDropdown.tsx'), 1040, 1830, {}),
      label(60, 2055, 1160, 'Overlays'),
      // — Specimen 07 · Button, eight ways (one per kit) —
      frame(60, 2130, 1160, 240),
      inst(preset('src/kinetic-ui/KineticButton.tsx'), 100, 2180, {}),
      inst(preset('src/cupertino/CupertinoButton.tsx'), 280, 2180, {}),
      inst(preset('src/boldcase/PopButton.tsx'), 480, 2180, {}),
      inst(preset('src/chicago95/Win95Button.tsx'), 680, 2185, {}),
      inst(preset('src/spritecraft/SpriteButton.tsx'), 880, 2185, {}),
      inst(preset('src/glitchtype/GlitchButton.tsx'), 100, 2280, {}),
      inst(preset('src/voltura/VolturaButton.tsx'), 320, 2280, {}),
      inst(preset('src/overworld/TravelButton.tsx'), 540, 2280, {}),
      label(60, 2385, 1160, 'Button, eight ways — one per kit'),
    ],
  }
  return [page]
}

export const componentSystems: SampleProject = {
  id: 'component-systems',
  title: 'Component Workbench',
  tagline: 'The systems catalog on a cutting mat',
  detail:
    'Selection, input, switches, feedback, overlays, identity and one button from every kit — pinned inside dashed specimen frames on a saturated orange mat, white ink annotations, all live.',
  accent: ORANGE,
  build,
}
