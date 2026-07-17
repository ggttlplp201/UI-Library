import { newPageId, type Page } from '../canvas'
import { inst, preset, type SampleProject } from './types'

/**
 * Field Notes — the editorial sample flipped to paper in the Editorial-Stack
 * register: a butter-yellow page, a giant Garamond masthead with a witty
 * parenthetical standfirst, the Marginalia notebook kit doing the doodling,
 * and photographs pinned like a works strip.
 */
const PAPER = '#F7F3CF'
const INK = '#17150f'
const SOFT = '#5c5643'
const REDPEN = '#b3402f'
const SERIF = "'EB Garamond', Georgia, serif"
const HAND = "'Caveat', cursive"

function build(): Page[] {
  const page: Page = {
    id: newPageId(),
    name: 'Field Notes',
    nodeX: 90,
    nodeY: 130,
    artboardWidth: 1280,
    boardHeight: 3700,
    fx: { loader: 'bar', loaderAccent: INK, loaderMs: 900 },
    instances: [
      inst(preset('src/basics/PageBackdrop.tsx'), 0, 0, {
        w: 1280,
        h: 3700,
        args: { accent: '#EFE6A6', base: PAPER, glowStrength: 0.3 },
      }),
      // — Masthead with serif corners —
      inst(preset('src/basics/TextBlock.tsx'), 70, 72, {
        args: { text: 'Menu', size: 20, color: INK, font: SERIF },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 1120, 72, {
        args: { text: 'Contact', size: 20, color: INK, font: SERIF, align: 'right', maxWidth: 90 },
      }),
      inst(preset('src/basics/Heading.tsx'), 0, 40, {
        w: 1280,
        args: { text: 'Field Notes', size: 132, color: INK, font: SERIF, weight: 500, align: 'center', tracking: -0.02, lineHeight: 0.95 },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 240, 210, {
        args: {
          text: 'Photographs, studies, margins.',
          size: 21,
          color: SOFT,
          font: SERIF,
          align: 'center',
          maxWidth: 800,
          italic: true,
        },
      }),
      // — The desk: notebook kit scattered like marginalia —
      inst(preset('src/marginalia/StickyNote.tsx'), 90, 360, {}),
      inst(preset('src/marginalia/RedStamp.tsx'), 400, 400, {}),
      inst(preset('src/marginalia/PaperClipBadge.tsx'), 640, 390, {}),
      inst(preset('src/marginalia/MarginTab.tsx'), 860, 400, {}),
      inst(preset('src/marginalia/HighlighterText.tsx'), 90, 620, {}),
      inst(preset('src/marginalia/Checklist.tsx'), 560, 500, {}),
      // — Works strip: three pinned photographs, staggered like the poster row —
      inst(preset('src/basics/ImageBlock.tsx'), 60, 800, {
        args: {
          imageSrc: 'https://picsum.photos/id/1041/720/920',
          width: 360,
          height: 460,
          radius: 2,
          caption: 'Harbor light, 6:14 — the only ten minutes it stopped raining.',
        },
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.6, delay: 0, easing: 'ease-out', once: true },
      }),
      inst(preset('src/basics/ImageBlock.tsx'), 460, 850, {
        args: {
          imageSrc: 'https://picsum.photos/id/1080/720/520?grayscale',
          width: 360,
          height: 260,
          radius: 2,
          caption: 'Market fruit, shot for texture. Unplanned.',
        },
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.6, delay: 0.12, easing: 'ease-out', once: true },
      }),
      inst(preset('src/basics/ImageBlock.tsx'), 860, 810, {
        args: {
          imageSrc: 'https://picsum.photos/id/1015/720/800',
          width: 360,
          height: 400,
          radius: 2,
          caption: 'The river the brief never sends you to.',
        },
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.6, delay: 0.24, easing: 'ease-out', once: true },
      }),
      // — Notebook spread —
      inst(preset('src/marginalia/NotebookCard.tsx'), 60, 1440, {}),
      inst(preset('src/basics/TextBlock.tsx'), 500, 1480, {
        args: {
          text: 'Notes from between assignments.',
          size: 19,
          color: SOFT,
          font: SERIF,
          maxWidth: 420,
          italic: true,
        },
      }),
      // — Studies —
      inst(preset('src/basics/Heading.tsx'), 60, 1900, {
        args: { text: 'Studies', size: 52, color: INK, font: SERIF, weight: 500 },
      }),
      inst(preset('src/basics/Divider.tsx'), 60, 1975, { args: { width: 1160, color: 'rgba(23,21,15,0.18)' } }),
      inst(preset('src/hover/HoverExpand.tsx', 'HoverExpand_001'), 60, 2020, {}),
      inst(preset('src/basics/TextBlock.tsx'), 60, 2400, {
        args: { text: 'Hover studies.', size: 19, color: SOFT, font: SERIF, italic: true },
      }),
      // — Index: hover a row, its photograph appears —
      inst(preset('src/basics/Divider.tsx'), 60, 2560, { args: { width: 1160, color: 'rgba(23,21,15,0.18)' } }),
      inst(preset('src/basics/Heading.tsx'), 60, 2620, {
        args: { text: 'Index', size: 52, color: INK, font: SERIF, weight: 500 },
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.5, delay: 0, easing: 'ease-out', once: true },
      }),
      inst(preset('src/sections/HoverIndexReveal.tsx'), 60, 2710, {
        args: {
          rows: 'Harbor | 2026\nMarket | 2025\nRiver | 2025\nRidge | 2024',
          images:
            'https://picsum.photos/id/1041/640/800\nhttps://picsum.photos/id/1080/640/800?grayscale\nhttps://picsum.photos/id/1015/640/800\nhttps://picsum.photos/id/1036/640/800?grayscale',
          ink: INK,
          accent: REDPEN,
          font: SERIF,
          fontSize: 44,
          width: 1160,
        },
      }),
      // — Signed closer —
      inst(preset('src/text/SignatureOverType.tsx'), 60, 3220, {
        args: {
          lines: 'FIELD NOTES\n2019–2026',
          signature: '— L.',
          ink: INK,
          signatureColor: REDPEN,
          size: 140,
          signatureSize: 110,
          width: 1160,
        },
        anim: { preset: 'fade', trigger: 'scroll', duration: 0.7, delay: 0, easing: 'ease-out', once: true },
      }),
      inst(preset('src/marginalia/InkButton.tsx'), 540, 3560, {}),
    ],
  }
  return [page]
}

export const editorial: SampleProject = {
  id: 'field-notes',
  title: 'Field Notes',
  tagline: 'A notebook on butter-yellow paper',
  detail:
    'Giant Garamond masthead, a witty parenthetical standfirst, the Marginalia kit scattered like real desk clutter, pinned photographs with handwritten margin notes, and an ink-button sign-off.',
  accent: '#E8DFA0',
  build,
}
