import { newPageId, type Page } from '../canvas'
import { inst, preset, type SampleProject } from './types'

/**
 * Motion Lab — a tall page where scroll is the instrument: character
 * reveals, sticky zooms, rolling text, live counters and hover links.
 * Blend-disc cursor and equalizer loader set the mood on entry.
 */
function build(): Page[] {
  const page: Page = {
    id: newPageId(),
    name: 'Motion Lab',
    nodeX: 90,
    nodeY: 130,
    artboardWidth: 1280,
    boardHeight: 3600,
    fx: {
      loader: 'equalizer',
      loaderAccent: '#E5484D',
      loaderMs: 1100,
      cursor: 'blend',
      cursorAccent: '#E5484D',
    },
    instances: [
      inst(preset('src/scroll/ScrollProgressCircle.tsx'), 1160, 60, {}),
      inst(preset('src/text/SplitText.tsx'), 140, 90, {
        args: { text: 'MOTION LAB' },
        style: { fontSize: 72, color: '#f2f0eb', fontWeight: '800' },
      }),
      inst(preset('src/text/RotatingText.tsx'), 140, 220, {
        args: { texts: ['reveals', 'zooms', 'counters', 'cursors'] },
        style: { fontSize: 40, color: '#E5484D', fontWeight: '700' },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 142, 300, {
        args: {
          text: 'Six set pieces. Scroll slowly — each one is driven by where you are on the page, not by a timer.',
          maxWidth: 460,
          color: '#a8a29a',
        },
      }),
      // 01 — character reveal
      inst(preset('src/basics/Heading.tsx'), 140, 430, { args: { text: '01 — Character reveal', size: 22, color: '#E5484D' } }),
      inst(preset('src/scroll/CharacterScrollReveal.tsx'), 320, 500, {}),
      // 02 — rolling band
      inst(preset('src/basics/Heading.tsx'), 140, 1010, { args: { text: '02 — Rolling band', size: 22, color: '#E5484D' } }),
      inst(preset('src/text/LoopText.tsx'), 0, 1080, { w: 1280 }),
      // 03 — sticky zoom
      inst(preset('src/basics/Heading.tsx'), 140, 1290, { args: { text: '03 — Sticky zoom', size: 22, color: '#E5484D' } }),
      inst(preset('src/scroll/StickyCardZoom.tsx'), 140, 1360, {}),
      // 04 — fade rhythm
      inst(preset('src/basics/Heading.tsx'), 140, 2120, { args: { text: '04 — Fade rhythm', size: 22, color: '#E5484D' } }),
      inst(preset('src/scroll/ScrollFadeList.tsx'), 140, 2190, {}),
      inst(preset('src/scroll/TextReveal.tsx'), 700, 2190, {}),
      // 05 — numbers that move
      inst(preset('src/basics/Heading.tsx'), 140, 2760, { args: { text: '05 — Numbers that move', size: 22, color: '#E5484D' } }),
      inst(preset('src/text/NumberTicker.tsx'), 140, 2830, {
        args: { value: 4096 },
        style: { fontSize: 64, color: '#f2f0eb', fontWeight: '800' },
        anim: { preset: 'fade', trigger: 'scroll', duration: 0.5, delay: 0, easing: 'ease-out', once: true },
      }),
      inst(preset('src/text/AnimatedNumbers.tsx'), 500, 2830, {}),
      // 06 — hover instruments
      inst(preset('src/basics/Heading.tsx'), 140, 3040, { args: { text: '06 — Hover instruments', size: 22, color: '#E5484D' } }),
      inst(preset('src/hover/AnimatedLink.tsx'), 140, 3120, {}),
      inst(preset('src/hover/ClipReveal.tsx'), 500, 3090, {}),
      inst(preset('src/effects/ClickSpark.tsx'), 950, 3100, {
        args: { children: 'Click here' },
        style: { fontSize: 24, color: '#f2f0eb' },
      }),
      inst(preset('src/effects/Marquee.tsx'), 0, 3420, {
        w: 1280,
        args: { children: 'MOTION · IS · INFORMATION · MOTION · IS · INFORMATION ·' },
      }),
    ],
  }
  return [page]
}

export const motionLab: SampleProject = {
  id: 'motion-lab',
  title: 'Motion Lab',
  tagline: 'Scroll-driven set pieces, alive end to end',
  detail:
    'Character reveals, sticky zooms, rolling bands, live counters, hover links and a blend-disc cursor — a page you feel by scrolling it.',
  accent: '#E5484D',
  build,
}
