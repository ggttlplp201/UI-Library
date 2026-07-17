import { newPageId, type Page } from '../canvas'
import { inst, preset, type SampleProject } from './types'

/**
 * Motion Lab — the scroll-driven set pieces re-cut as a Kino-Archive reel,
 * interactions included: a rolling film-strip of stills with red caption
 * bars, black film-frame panels around each act, italic serif interludes,
 * a programme index whose pill rows flood black on hover, and an asterisk
 * marquee ribbon to close.
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
    boardHeight: 4800,
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
        h: 4800,
        args: { accent: '#ff5a4f', base: RED, glowStrength: 0.12 },
      }),
      // — Title card: red display type + film still inside a black frame —
      filmFrame(40, 40, 1200, 430),
      inst(preset('src/basics/Heading.tsx'), 90, 95, {
        args: { text: 'MOTION\nLAB', size: 120, color: RED, font: DISPLAY, weight: 800, tracking: -0.02, lineHeight: 0.88 },
      }),
      inst(preset('src/text/RotatingText.tsx'), 660, 320, {
        args: { texts: ['reveals', 'zooms', 'counters', 'cursors'] },
        style: { fontSize: 48, color: CREAM, fontWeight: '600', fontFamily: SERIF, fontStyle: 'italic' },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 880, 110, {
        args: {
          text: 'Six acts. Scroll slowly — each one is driven by where you are on the page, not by a timer.',
          maxWidth: 280,
          size: 16,
          color: CREAM,
          font: SERIF,
          lineHeight: 1.5,
          italic: true,
        },
      }),
      inst(preset('src/basics/ImageBlock.tsx'), 890, 250, {
        args: {
          imageSrc: 'https://picsum.photos/id/1018/520/320?grayscale',
          width: 260,
          height: 160,
          radius: 4,
          caption: '',
        },
      }),
      // — The reel: rolling film-strip with caption bars, pauses on hover —
      inst(preset('src/effects/FilmStripMarquee.tsx'), 0, 510, {
        w: 1280,
        args: {
          captions: 'Reveal — Act I\nBand — Act II\nStack — Act III\nRhythm — Act IV\nCount — Act V\nHover — Act VI',
          accent: RED,
          film: FILM,
          width: 1280,
        },
      }),
      // — Act I · character reveal —
      act(790, 'Act I — Character reveal'),
      filmFrame(60, 850, 1160, 660),
      inst(preset('src/scroll/CharacterScrollReveal.tsx'), 340, 900, {}),
      // — Act II · rolling band —
      act(1580, 'Act II — Rolling band'),
      inst(preset('src/text/LoopText.tsx'), 0, 1650, { w: 1280 }),
      // — Act III · sticky stack —
      act(1820, 'Act III — Sticky stack'),
      filmFrame(60, 1880, 1160, 800),
      inst(preset('src/scroll/StickyCardStack.tsx'), 110, 1930, {}),
      // — Act IV · fade rhythm —
      act(2750, 'Act IV — Fade rhythm'),
      filmFrame(60, 2810, 620, 560),
      inst(preset('src/scroll/ScrollFadeList.tsx'), 110, 2860, {}),
      inst(preset('src/basics/TextBlock.tsx'), 760, 2900, {
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
      act(3440, 'Act V — Numbers that move'),
      inst(preset('src/text/NumberTicker.tsx'), 60, 3510, {
        args: { value: 4096 },
        style: { fontSize: 88, color: INKRED, fontWeight: '800', fontFamily: DISPLAY },
        anim: { preset: 'fade', trigger: 'scroll', duration: 0.5, delay: 0, easing: 'ease-out', once: true },
      }),
      inst(preset('src/text/TextRoll.tsx'), 480, 3540, {
        args: { children: 'Hover me' },
        style: { color: INKRED },
      }),
      // — Act VI · hover instruments —
      act(3690, 'Act VI — Hover instruments'),
      inst(preset('src/hover/AnimatedLink.tsx', 'Link003'), 60, 3770, {}),
      inst(preset('src/hover/ClipReveal.tsx', 'ClipDiv'), 380, 3760, {}),
      inst(preset('src/effects/ClickSpark.tsx'), 1090, 3770, {
        args: { children: 'Click here' },
        style: { fontSize: 24, color: INKRED, fontFamily: SERIF, fontStyle: 'italic' },
      }),
      // — Programme: pill index, rows flood black on hover —
      act(4020, 'Programme'),
      inst(preset('src/sections/HoverRowTable.tsx'), 60, 4090, {
        args: {
          header: 'Act | Set piece | Driver',
          rows: 'I — Reveal | Character cascade | scroll\nII — Band | Rolling type | loop\nIII — Stack | Sticky cards | pin\nIV — Rhythm | Fade rows | view()\nV — Count | Live numerals | spring\nVI — Hover | Instruments | pointer',
          variant: 'pill',
          ink: INKRED,
          outline: INKRED,
          hoverBg: INKRED,
          hoverInk: RED,
          font: "'Syne', system-ui, sans-serif",
          fontSize: 19,
          width: 1160,
        },
      }),
      // — Closing ribbon: asterisk marquee on a black band —
      inst(preset('src/basics/PanelBand.tsx'), 0, 4620, {
        args: { width: 1280, height: 120, background: FILM, borderColor: FILM, radius: 0 },
      }),
      inst(preset('src/effects/Marquee.tsx'), 0, 4646, {
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
    'A rolling film-strip of captioned stills, character reveals, rolling bands, a sticky stack, fade rhythms, live counters, hover instruments and a programme index whose pill rows flood black on hover — closed by an asterisk marquee.',
  accent: RED,
  build,
}
