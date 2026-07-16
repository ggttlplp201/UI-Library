import { newPageId, type Page } from '../canvas'
import { inst, preset, type SampleProject } from './types'

/**
 * Field Notes — the editorial/portfolio sample: poster carousels, image
 * hover treatments, texture cards and a rolling type band. Photography does
 * the talking; type stays quiet and confident.
 */
function build(): Page[] {
  const page: Page = {
    id: newPageId(),
    name: 'Field Notes',
    nodeX: 90,
    nodeY: 130,
    artboardWidth: 1280,
    boardHeight: 3250,
    fx: { loader: 'bar', loaderAccent: '#111111', loaderMs: 900 },
    instances: [
      // Poster wall opens the page — imagery first, no headline shouting.
      inst(preset('src/carousels/Carousels.tsx', 'Carousel_003'), 0, 60, {
        w: 1280,
      }),
      inst(preset('src/text/SplitText.tsx'), 140, 700, {
        args: { text: 'FIELD NOTES' },
        style: { fontSize: 64, color: '#f2f0eb', fontWeight: '800' },
      }),
      inst(preset('src/text/TextShimmer.tsx'), 142, 800, {
        args: { children: 'Selected work, studies, and unfinished thoughts — 2019 to now.' },
        style: { fontSize: 18 },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 760, 706, {
        args: {
          text: 'Most of this was shot between assignments: the walk to the studio, the hour after a job wrapped, the places a brief never sends you. Kept here unretouched.',
          maxWidth: 380,
          size: 14,
          color: '#8a8578',
        },
      }),
      // Mixed editorial row: texture, hover blur, glow flip.
      inst(preset('src/cards/TextureCard.tsx'), 140, 940, {
        args: {},
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.6, delay: 0, easing: 'ease-out', once: true },
      }),
      inst(preset('src/cards/HoverBlurCards.tsx'), 520, 940, {
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.6, delay: 0.1, easing: 'ease-out', once: true },
      }),
      inst(preset('src/cards/GlowFlipCard.tsx'), 930, 940, {
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.6, delay: 0.2, easing: 'ease-out', once: true },
      }),
      // Image hover studies.
      inst(preset('src/basics/Heading.tsx'), 140, 1400, { args: { text: 'Studies', size: 28 } }),
      inst(preset('src/basics/Divider.tsx'), 140, 1450, { args: { width: 1000 } }),
      inst(preset('src/hover/ClipReveal.tsx'), 140, 1500, {}),
      inst(preset('src/hover/HoverExpand.tsx'), 640, 1500, {}),
      // Photo spread — asymmetric pair with captions.
      inst(preset('src/basics/ImageBlock.tsx'), 140, 1990, {
        args: {
          imageSrc: 'https://picsum.photos/seed/field-a/1000/680',
          width: 520,
          height: 350,
          caption: 'Harbor light, 6:14 — the only ten minutes it stopped raining.',
        },
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.6, delay: 0, easing: 'ease-out', once: true },
      }),
      inst(preset('src/basics/ImageBlock.tsx'), 720, 1950, {
        args: {
          imageSrc: 'https://picsum.photos/seed/field-b/800/560',
          width: 420,
          height: 280,
          caption: 'Stairwell, printworks. Unplanned.',
        },
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.6, delay: 0.15, easing: 'ease-out', once: true },
      }),
      // Rolling band between image blocks.
      inst(preset('src/effects/Marquee.tsx'), 0, 2440, {
        w: 1280,
        args: { children: 'FIELD NOTES · STUDIES · PROCESS · FIELD NOTES · STUDIES · PROCESS ·' },
      }),
      // Second poster row + social close.
      inst(preset('src/carousels/Carousels.tsx', 'Carousel_001'), 0, 2560, { w: 1280 }),
      inst(preset('src/hover/SocialHoverGrid.tsx'), 990, 3010, {}),
      inst(preset('src/sections/SiteFooter.tsx'), 0, 3110, {
        w: 1280,
        args: { brand: 'Field Notes', links: 'Archive, About, Contact', copyright: '© 2026 — all photographs their authors.' },
      }),
    ],
  }
  return [page]
}

export const editorial: SampleProject = {
  id: 'field-notes',
  title: 'Field Notes',
  tagline: 'Editorial portfolio — imagery first',
  detail:
    'Poster carousels, clip-reveal and hover-expand image studies, texture cards and a rolling type band. Quiet type, loud photographs.',
  accent: '#b8b2a4',
  build,
}
