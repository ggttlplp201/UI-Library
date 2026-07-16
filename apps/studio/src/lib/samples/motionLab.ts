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
    boardHeight: 3300,
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
      // Scroll the panel: characters pull themselves together.
      inst(preset('src/scroll/CharacterScrollReveal.tsx'), 320, 360, {}),
      // Rolling text band.
      inst(preset('src/text/LoopText.tsx'), 0, 880, { w: 1280 }),
      // Sticky zoom set-piece.
      inst(preset('src/scroll/StickyCardZoom.tsx'), 140, 1060, {}),
      // Fade-list rhythm.
      inst(preset('src/scroll/ScrollFadeList.tsx'), 140, 1850, {}),
      inst(preset('src/scroll/TextReveal.tsx'), 700, 1850, {}),
      // Numbers that move.
      inst(preset('src/text/NumberTicker.tsx'), 140, 2500, {
        args: { value: 4096 },
        style: { fontSize: 64, color: '#f2f0eb', fontWeight: '800' },
        anim: { preset: 'fade', trigger: 'scroll', duration: 0.5, delay: 0, easing: 'ease-out', once: true },
      }),
      inst(preset('src/text/AnimatedNumbers.tsx'), 500, 2500, {}),
      // Hover instruments.
      inst(preset('src/hover/AnimatedLink.tsx'), 140, 2800, {}),
      inst(preset('src/hover/ClipReveal.tsx'), 500, 2760, {}),
      inst(preset('src/effects/ClickSpark.tsx'), 950, 2780, {
        args: { children: 'Click here' },
        style: { fontSize: 24, color: '#f2f0eb' },
      }),
      inst(preset('src/effects/Marquee.tsx'), 0, 3050, {
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
