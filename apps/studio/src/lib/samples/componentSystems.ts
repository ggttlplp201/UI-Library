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
    anim: { preset: 'fade', trigger: 'scroll', duration: 0.5, delay: 0, easing: 'ease-out', once: true },
  })

function build(): Page[] {
  const page: Page = {
    id: newPageId(),
    name: 'Workbench',
    nodeX: 90,
    nodeY: 130,
    artboardWidth: 1280,
    boardHeight: 5620,
    fx: { loader: 'dots', loaderAccent: '#ffffff', loaderMs: 800 },
    instances: [
      inst(preset('src/basics/PageBackdrop.tsx'), 0, 0, {
        w: 1280,
        h: 5620,
        args: { accent: '#ff7a3c', base: ORANGE, glowStrength: 0.1 },
      }),
      // — Masthead + working note —
      inst(preset('src/basics/Heading.tsx'), 60, 60, {
        args: { text: 'Component\nWorkbench', size: 76, color: '#ffffff', font: DISPLAY, weight: 400, tracking: -0.01, lineHeight: 0.95 },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 900, 80, {
        args: { text: 'Every unit is live.', size: 15, color: '#ffffff', maxWidth: 320, font: NOTE },
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
      frame(60, 1390, 1160, 360),
      inst(preset('src/feedback/AlertBanner.tsx'), 100, 1440, { w: 520 }),
      inst(preset('src/feedback/ToasterDemo.tsx'), 700, 1440, {}),
      inst(preset('src/feedback/ProgressBar.tsx'), 100, 1565, { w: 360, args: { labelColor: '#ffffff' } }),
      inst(preset('src/kinetic-ui/KineticToast.tsx'), 560, 1560, {}),
      inst(preset('src/kinetic-ui/KineticProgressBar.tsx'), 100, 1650, { args: { labelColor: '#ffffff' } }),
      label(60, 1765, 1160, 'Feedback'),
      // — Specimen 06 · Overlays —
      frame(60, 1840, 1160, 260),
      inst(preset('src/overlays/DialogDemo.tsx'), 100, 1890, {}),
      inst(preset('src/overlays/DropdownMenuDemo.tsx'), 380, 1890, {}),
      inst(preset('src/overlays/PopoverDemo.tsx'), 660, 1890, {}),
      inst(preset('src/kinetic-ui/KineticDropdown.tsx'), 940, 1890, {}),
      label(60, 2115, 1160, 'Overlays'),
      // — Specimen 07 · Navigation —
      frame(60, 2190, 1160, 320),
      inst(preset('src/navigation/MorphNav.tsx'), 100, 2240, {
        args: { word: 'CLICK', items: 'Projects | About | Contact', ink: '#ffffff', accent: '#140d0b', size: 56, width: 420 },
      }),
      inst(preset('src/navigation/TabsDemo.tsx'), 620, 2260, {}),
      label(60, 2525, 1160, 'Navigation'),
      // — Specimen 08 · Buttons —
      frame(60, 2600, 1160, 400),
      inst(preset('src/boldcase/PopButton.tsx'), 100, 2650, {}),
      inst(preset('src/overworld/TravelButton.tsx'), 500, 2650, {}),
      inst(preset('src/voltura/VolturaButton.tsx'), 900, 2650, {}),
      inst(preset('src/kinetic-ui/KineticButton.tsx'), 100, 2770, {}),
      inst(preset('src/cupertino/CupertinoButton.tsx'), 250, 2770, {}),
      inst(preset('src/chicago95/Win95Button.tsx'), 450, 2775, {}),
      inst(preset('src/spritecraft/SpriteButton.tsx'), 620, 2775, {}),
      inst(preset('src/buttons/PrimaryButton.tsx'), 800, 2770, {}),
      inst(preset('src/buttons/ComicButton.tsx'), 100, 2880, {}),
      inst(preset('src/buttons/IconSlideButton.tsx'), 300, 2880, {}),
      inst(preset('src/buttons/SendButton.tsx'), 500, 2885, {}),
      inst(preset('src/buttons/TextureButton.tsx'), 680, 2880, {}),
      inst(preset('src/buttons/GlossyJoinButton.tsx'), 880, 2880, {}),
      label(60, 3015, 1160, 'Buttons'),
      // — Specimen 09 · Cards —
      frame(60, 3090, 1160, 640),
      inst(preset('src/cards/MinimalCard.tsx'), 100, 3140, {}),
      inst(preset('src/cards/ContentCard.tsx'), 460, 3140, {}),
      inst(preset('src/cards/ShiftCard.tsx'), 820, 3140, {}),
      inst(preset('src/cards/TextureCard.tsx'), 100, 3420, {}),
      inst(preset('src/cards/Glass3DCard.tsx'), 460, 3420, {}),
      inst(preset('src/cards/FlipCreditCard.tsx'), 830, 3420, {}),
      label(60, 3755, 1160, 'Cards'),
      // — Specimen 10 · Spritecraft kit —
      frame(60, 3830, 560, 460),
      inst(preset('src/spritecraft/SpritePanel.tsx'), 100, 3880, {}),
      inst(preset('src/spritecraft/HeartBar.tsx'), 100, 4120, {}),
      inst(preset('src/spritecraft/XPBar.tsx'), 100, 4190, {}),
      inst(preset('src/spritecraft/CoinCounter.tsx'), 370, 4120, {}),
      inst(preset('src/spritecraft/QuestBadge.tsx'), 370, 4190, {}),
      inst(preset('src/spritecraft/SpriteToggle.tsx'), 500, 4120, {}),
      label(60, 4315, 560, 'Spritecraft'),
      // — Specimen 11 · Overworld kit —
      frame(660, 3830, 560, 460),
      inst(preset('src/overworld/WorldBanner.tsx'), 700, 3880, {}),
      inst(preset('src/overworld/QuestLogRow.tsx'), 700, 4030, {}),
      inst(preset('src/overworld/BiomeBadge.tsx'), 700, 4120, {}),
      inst(preset('src/overworld/CoordinateTag.tsx'), 860, 4125, {}),
      inst(preset('src/overworld/PixelDivider.tsx'), 700, 4200, {}),
      label(660, 4315, 560, 'Overworld'),
      // — Specimen 12 · More input —
      frame(60, 4390, 1160, 320),
      inst(preset('src/inputs/WaveLabelInput.tsx'), 100, 4440, {}),
      inst(preset('src/inputs/SmoothInput.tsx'), 400, 4445, {}),
      inst(preset('src/inputs/GliderRadio.tsx'), 700, 4440, {}),
      inst(preset('src/inputs/KeypadRadio.tsx'), 960, 4430, {}),
      inst(preset('src/inputs/SegmentedToggleGroup.tsx'), 100, 4580, {}),
      label(60, 4725, 1160, 'More input'),
      // — Specimen 13 · Background patterns (full-width strips) —
      frame(60, 4800, 1160, 700),
      inst(preset('src/backgrounds/RetroOrbsPattern.tsx'), 100, 4850, { w: 1080, h: 150 }),
      inst(preset('src/backgrounds/RippleWeavePattern.tsx'), 100, 5020, { w: 1080, h: 150 }),
      inst(preset('src/backgrounds/RainBackground.tsx'), 100, 5190, { w: 1080, h: 150 }),
      label(60, 5525, 1160, 'Backgrounds'),
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
