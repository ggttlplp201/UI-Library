import { newPageId, type Page } from '../canvas'
import { inst, preset, type SampleProject } from './types'

/**
 * Motion Lab — the scroll-driven set pieces re-cut as a Kino-Archive reel:
 * a signal-red field, black film-frame panels around each act, italic serif
 * interludes, and an asterisk marquee ribbon to close.
 */
const RED = '#E3241B'
const FILM = '#0e0b0a'
const CREAM = '#f3e9dc'
const INKRED = '#140d0b'
const DISPLAY = "'Syne', system-ui, sans-serif"
const SERIF = "'Playfair Display', Georgia, serif"

/** Italic serif act header, Kino-style. */
const act = (y: number, text: string) =>
  inst(preset('src/basics/Heading.tsx'), 60, y, {
    args: { text, size: 30, color: INKRED, font: SERIF, weight: 600, tracking: 0, italic: true },
  })

/** Black film frame behind a set piece. */
const filmFrame = (x: number, y: number, width: number, height: number) =>
  inst(preset('src/basics/PanelBand.tsx'), x, y, {
    args: { width, height, background: FILM, borderColor: FILM, radius: 26 },
  })

function build(): Page[] {
  const page: Page = {
    id: newPageId(),
    name: 'Motion Lab',
    nodeX: 90,
    nodeY: 130,
    artboardWidth: 1280,
    boardHeight: 3960,
    fx: {
      loader: 'equalizer',
      loaderAccent: RED,
      loaderMs: 1100,
      cursor: 'blend',
      cursorAccent: RED,
    },
    instances: [
      inst(preset('src/basics/PageBackdrop.tsx'), 0, 0, {
        w: 1280,
        h: 3960,
        args: { accent: '#ff5a4f', base: RED, glowStrength: 0.12 },
      }),
      // — Title card: red display type inside a black frame —
      filmFrame(40, 40, 1200, 430),
      inst(preset('src/basics/Heading.tsx'), 90, 95, {
        args: { text: 'MOTION\nLAB', size: 120, color: RED, font: DISPLAY, weight: 800, tracking: -0.02, lineHeight: 0.88 },
      }),
      inst(preset('src/text/RotatingText.tsx'), 660, 320, {
        args: { texts: ['reveals', 'zooms', 'counters', 'cursors'] },
        style: { fontSize: 48, color: CREAM, fontWeight: '600', fontFamily: SERIF, fontStyle: 'italic' },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 880, 120, {
        args: {
          text: 'Six acts. Scroll slowly — each one is driven by where you are on the page, not by a timer.',
          maxWidth: 300,
          size: 17,
          color: CREAM,
          font: SERIF,
          lineHeight: 1.5,
          italic: true,
        },
      }),
      // — Act I · character reveal —
      act(540, 'Act I — Character reveal'),
      filmFrame(60, 600, 1160, 660),
      inst(preset('src/scroll/CharacterScrollReveal.tsx'), 340, 650, {}),
      // — Act II · rolling band —
      act(1330, 'Act II — Rolling band'),
      inst(preset('src/text/LoopText.tsx'), 0, 1400, { w: 1280 }),
      // — Act III · sticky stack —
      act(1570, 'Act III — Sticky stack'),
      filmFrame(60, 1630, 1160, 800),
      inst(preset('src/scroll/StickyCardStack.tsx'), 110, 1680, {}),
      // — Act IV · fade rhythm —
      act(2500, 'Act IV — Fade rhythm'),
      filmFrame(60, 2560, 620, 560),
      inst(preset('src/scroll/ScrollFadeList.tsx'), 110, 2610, {}),
      inst(preset('src/basics/TextBlock.tsx'), 760, 2650, {
        args: {
          text: 'Each row fades in on its own beat as it enters the scrollport — rhythm, not spectacle.',
          maxWidth: 380,
          size: 19,
          color: INKRED,
          font: SERIF,
          lineHeight: 1.5,
          italic: true,
        },
      }),
      // — Act V · numbers that move —
      act(3190, 'Act V — Numbers that move'),
      inst(preset('src/text/NumberTicker.tsx'), 60, 3260, {
        args: { value: 4096 },
        style: { fontSize: 88, color: INKRED, fontWeight: '800', fontFamily: DISPLAY },
        anim: { preset: 'fade', trigger: 'scroll', duration: 0.5, delay: 0, easing: 'ease-out', once: true },
      }),
      inst(preset('src/text/TextRoll.tsx'), 480, 3290, {
        args: { children: 'Hover me' },
        style: { color: INKRED },
      }),
      // — Act VI · hover instruments —
      act(3440, 'Act VI — Hover instruments'),
      inst(preset('src/hover/AnimatedLink.tsx', 'Link003'), 60, 3520, {}),
      inst(preset('src/hover/ClipReveal.tsx', 'ClipDiv'), 380, 3510, {}),
      inst(preset('src/effects/ClickSpark.tsx'), 1090, 3520, {
        args: { children: 'Click here' },
        style: { fontSize: 24, color: INKRED, fontFamily: SERIF, fontStyle: 'italic' },
      }),
      // — Closing ribbon: asterisk marquee on a black band —
      inst(preset('src/basics/PanelBand.tsx'), 0, 3800, {
        args: { width: 1280, height: 120, background: FILM, borderColor: FILM, radius: 0 },
      }),
      inst(preset('src/effects/Marquee.tsx'), 0, 3826, {
        w: 1280,
        args: { children: 'Reveals * Zooms * Counters * Cursors * Motion Lab *' },
        style: { fontFamily: SERIF, fontStyle: 'italic', fontSize: 42, color: RED },
      }),
    ],
  }
  return [page]
}

export const motionLab: SampleProject = {
  id: 'motion-lab',
  title: 'Motion Lab',
  tagline: 'Six scroll-driven acts on a red reel',
  detail:
    'Character reveals, rolling bands, a sticky stack, fade rhythms, live counters and hover instruments — each act framed in black film panels on a signal-red field, closed by an asterisk marquee.',
  accent: RED,
  build,
}
