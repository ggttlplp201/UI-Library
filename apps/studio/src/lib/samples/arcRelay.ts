import { newPageId, type Page } from '../canvas'
import { inst, preset, type SampleProject } from './types'

/**
 * ARC RELAY — the flagship sample: a cinematic launch page for a fictional
 * creative-hardware interface. Near-black stage, one amber signal color,
 * beams + huge type up top, dense spec instrumentation on page two, and a
 * focused access page. Shows navigation, page effects, scroll motion,
 * animated numbers and smart-fit sections working together.
 */
const AMBER = '#E3B23C'

function build(): Page[] {
  const launchId = newPageId()
  const specsId = newPageId()
  const accessId = newPageId()

  const launch: Page = {
    id: launchId,
    name: 'Launch',
    nodeX: 90,
    nodeY: 130,
    artboardWidth: 1280,
    boardHeight: 2350,
    fx: { loader: 'orbit', loaderAccent: AMBER, loaderMs: 1300, cursor: 'glow', cursorAccent: AMBER },
    instances: [
      inst(preset('src/sections/SiteNavbar.tsx'), 0, 0, {
        w: 1280,
        args: { brand: 'ARC RELAY', links: 'Signal, Specs, Access', cta: 'Request access' },
        links: { cta: accessId, Specs: specsId, Access: accessId },
      }),
      // The lit stage: beams sweep behind the headline.
      inst(preset('src/backgrounds/BackgroundBeams.tsx'), 0, 96, {
        w: 1280,
        h: 560,
        args: { accent: AMBER, background: '#0a0a0c', speed: 8 },
      }),
      inst(preset('src/text/SplitText.tsx'), 140, 200, {
        w: 760,
        args: { text: 'ARC RELAY' },
        style: { fontSize: 88, color: '#f4f2ec', fontWeight: '800' },
      }),
      inst(preset('src/text/TextShimmer.tsx'), 142, 344, {
        w: 640,
        args: { children: 'The relay between your hands and the machine.' },
        style: { fontSize: 22 },
      }),
      inst(preset('src/buttons/ShimmerButton.tsx'), 142, 430, {
        args: { children: 'Request access', shimmerColor: AMBER, background: 'rgba(10,10,12,1)' },
        linkTo: accessId,
      }),
      inst(preset('src/buttons/GhostButton.tsx'), 380, 436, {
        args: { children: 'Read the specs' },
        linkTo: specsId,
        style: { color: '#b8b2a4' },
      }),
      // Signal numbers — animated instrumentation, not marketing chips.
      inst(preset('src/cards/StatCard.tsx'), 140, 760, {
        args: { label: 'Round-trip latency', value: '12', suffix: 'ms' },
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.6, delay: 0, easing: 'ease-out', once: true },
      }),
      inst(preset('src/cards/StatCard.tsx'), 510, 760, {
        args: { label: 'Relay nodes online', value: '240', suffix: '' },
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.6, delay: 0.1, easing: 'ease-out', once: true },
      }),
      inst(preset('src/cards/StatCard.tsx'), 880, 760, {
        args: { label: 'Signal integrity', value: '99.99', suffix: '%' },
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.6, delay: 0.2, easing: 'ease-out', once: true },
      }),
      // Scroll set-piece: the hardware zooms as the page moves.
      inst(preset('src/scroll/StickyCardZoom.tsx'), 140, 1010, {
        anim: { preset: 'fade', trigger: 'scroll', duration: 0.8, delay: 0, easing: 'ease-out', once: true },
      }),
      inst(preset('src/sections/CtaSection.tsx'), 0, 1760, {
        w: 1280,
        args: {
          title: 'The relay opens soon.',
          subtitle: 'First run is 500 units. Signal integrity over hype.',
          cta: 'Request access',
        },
        links: { cta: accessId },
      }),
      inst(preset('src/sections/SiteFooter.tsx'), 0, 2120, {
        w: 1280,
        args: { brand: 'ARC RELAY', links: 'Signal, Specs, Access, Press', copyright: '© 2026 Arc Industries.' },
      }),
    ],
  }

  const specs: Page = {
    id: specsId,
    name: 'Specs',
    nodeX: 340,
    nodeY: 130,
    artboardWidth: 1280,
    boardHeight: 1500,
    fx: { loader: 'bar', loaderAccent: AMBER, loaderMs: 900, cursor: 'glow', cursorAccent: AMBER },
    instances: [
      inst(preset('src/sections/SiteNavbar.tsx'), 0, 0, {
        w: 1280,
        args: { brand: 'ARC RELAY', links: 'Signal, Specs, Access', cta: 'Request access' },
        links: { cta: accessId, Signal: launchId, Access: accessId },
      }),
      inst(preset('src/sections/LampHeader.tsx'), 320, 100, {
        args: {
          title: 'Under the hood',
          subtitle: 'Instrumented, measured, and honest about both.',
          accent: AMBER,
          background: '#0a0a0c',
        },
      }),
      inst(preset('src/kinetic-ui/KineticTabs.tsx'), 140, 520, {}),
      inst(preset('src/disclosure/AccordionDemo.tsx'), 700, 520, {
        args: {},
      }),
      inst(preset('src/kinetic-lab/LiquidFill.tsx'), 140, 860, { args: { defaultValue: 72 } }),
      inst(preset('src/kinetic-ui/KineticRingProgress.tsx'), 420, 860, { args: { defaultValue: 64 } }),
      inst(preset('src/text/AnimatedNumbers.tsx'), 700, 880, {}),
      inst(preset('src/feedback/ProgressBar.tsx'), 140, 1130, { w: 480 }),
      inst(preset('src/buttons/GhostButton.tsx'), 140, 1260, {
        args: { children: '← Back to launch' },
        linkTo: launchId,
      }),
    ],
  }

  const access: Page = {
    id: accessId,
    name: 'Access',
    nodeX: 590,
    nodeY: 130,
    artboardWidth: 1280,
    boardHeight: 1000,
    fx: { loader: 'newtons-cradle', loaderAccent: AMBER, loaderMs: 1100, cursor: 'glow', cursorAccent: AMBER },
    instances: [
      // Meteor field behind the form — quiet, not a light show.
      inst(preset('src/backgrounds/Meteors.tsx'), 0, 0, {
        w: 1280,
        h: 940,
        args: { count: 10, accent: '#8a8272', background: '#0a0a0c' },
      }),
      inst(preset('src/cards/BrutalistNewsletterCard.tsx'), 470, 180, {
        args: {
          title: 'REQUEST ACCESS',
          description: 'First batch ships to 500 desks. No spam — one confirmation, one shipping note.',
          buttonLabel: 'JOIN THE LIST',
          accent: AMBER,
        },
      }),
      inst(preset('src/buttons/GhostButton.tsx'), 555, 640, {
        args: { children: '← Back to launch' },
        linkTo: launchId,
        style: { color: '#b8b2a4' },
      }),
    ],
  }

  return [launch, specs, access]
}

export const arcRelay: SampleProject = {
  id: 'arc-relay',
  title: 'Arc Relay',
  tagline: 'Cinematic product launch — 3 linked pages',
  detail:
    'Beams, huge type, animated signal numbers, a scroll set-piece, and a focused access page. One amber accent on a near-black stage.',
  accent: AMBER,
  build,
}
