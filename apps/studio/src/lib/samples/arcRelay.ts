import { newPageId, type Page } from '../canvas'
import { inst, preset, type SampleProject } from './types'

/**
 * ARC RELAY — the flagship sample: a cinematic launch page for a fictional
 * creative-hardware interface. Near-black stage, one amber signal color,
 * beams + huge type up top, real body copy and imagery through the middle,
 * dense spec instrumentation on page two, focused access page.
 */
const AMBER = '#E3B23C'
const INK = '#f4f2ec'
const MUTED = '#b0aa9c'

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
    boardHeight: 3050,
    fx: { loader: 'orbit', loaderAccent: AMBER, loaderMs: 1300, cursor: 'glow', cursorAccent: AMBER },
    instances: [
      inst(preset('src/sections/SiteNavbar.tsx'), 0, 0, {
        w: 1280,
        args: { brand: 'ARC RELAY', links: 'Signal, Specs, Access', cta: 'Request access' },
        links: { cta: accessId, Specs: specsId, Access: accessId },
      }),
      // — The lit stage —
      inst(preset('src/backgrounds/BackgroundBeams.tsx'), 0, 96, {
        w: 1280,
        h: 560,
        args: { accent: AMBER, background: '#0a0a0c', speed: 8 },
      }),
      inst(preset('src/text/SplitText.tsx'), 140, 200, {
        w: 760,
        args: { text: 'ARC RELAY' },
        style: { fontSize: 88, color: INK, fontWeight: '800' },
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
        style: { color: MUTED },
      }),
      // — The signal, measured —
      inst(preset('src/basics/Heading.tsx'), 140, 740, {
        args: { text: 'The signal, measured.', size: 40, color: INK },
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.6, delay: 0, easing: 'ease-out', once: true },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 142, 806, {
        args: {
          text: 'Every relay ships with its own numbers. Not projections — measurements from the unit on your desk, updated as it runs.',
          maxWidth: 540,
          color: MUTED,
        },
      }),
      inst(preset('src/basics/PanelBand.tsx'), 100, 920, {
        args: { width: 1080, height: 210 },
      }),
      inst(preset('src/cards/StatCard.tsx'), 150, 960, {
        args: { label: 'Round-trip latency', value: '12', suffix: 'ms' },
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.6, delay: 0, easing: 'ease-out', once: true },
      }),
      inst(preset('src/cards/StatCard.tsx'), 510, 960, {
        args: { label: 'Relay nodes online', value: '240', suffix: '' },
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.6, delay: 0.1, easing: 'ease-out', once: true },
      }),
      inst(preset('src/cards/StatCard.tsx'), 870, 960, {
        args: { label: 'Signal integrity', value: '99.99', suffix: '%' },
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.6, delay: 0.2, easing: 'ease-out', once: true },
      }),
      // — What it is (asymmetric: copy left, hardware right) —
      inst(preset('src/basics/Divider.tsx'), 140, 1230, { args: { width: 1000 } }),
      inst(preset('src/basics/Heading.tsx'), 140, 1310, {
        args: { text: 'One cable.\nEvery instrument.', size: 44, color: INK },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 142, 1470, {
        args: {
          text: 'Arc Relay sits between your controllers and your software. It reads every knob, fader and key you own, converts them to one protocol, and delivers them with the latency of a wired keypress.\n\nNo drivers. No mapping software. Plug it in and the machine listens.',
          maxWidth: 460,
          color: MUTED,
        },
      }),
      inst(preset('src/basics/ImageBlock.tsx'), 700, 1300, {
        args: {
          imageSrc: 'https://picsum.photos/seed/arc-hardware/880/560',
          width: 440,
          height: 300,
          radius: 12,
          caption: 'Relay unit, first production run — anodized shell, single amber status lamp.',
        },
        anim: { preset: 'fade', trigger: 'scroll', duration: 0.8, delay: 0, easing: 'ease-out', once: true },
      }),
      // — Scroll set-piece —
      inst(preset('src/basics/Heading.tsx'), 140, 1780, {
        args: { text: 'Hold it before you buy it.', size: 34, color: INK },
      }),
      inst(preset('src/scroll/StickyCardZoom.tsx'), 140, 1860, {
        anim: { preset: 'fade', trigger: 'scroll', duration: 0.8, delay: 0, easing: 'ease-out', once: true },
      }),
      // — Rolling band + close —
      inst(preset('src/effects/Marquee.tsx'), 0, 2450, {
        w: 1280,
        args: { children: 'SIGNAL OVER HYPE — SIGNAL OVER HYPE — SIGNAL OVER HYPE —' },
      }),
      inst(preset('src/sections/CtaSection.tsx'), 0, 2560, {
        w: 1280,
        args: {
          title: 'The relay opens soon.',
          subtitle: 'First run is 500 units. Signal integrity over hype.',
          cta: 'Request access',
        },
        links: { cta: accessId },
      }),
      inst(preset('src/sections/SiteFooter.tsx'), 0, 2880, {
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
    boardHeight: 1950,
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
      inst(preset('src/basics/Heading.tsx'), 140, 540, {
        args: { text: 'Interface & protocol', size: 28, color: INK },
      }),
      inst(preset('src/kinetic-ui/KineticTabs.tsx'), 140, 610, {}),
      inst(preset('src/disclosure/AccordionDemo.tsx'), 700, 600, {}),
      inst(preset('src/basics/Divider.tsx'), 140, 990, { args: { width: 1000 } }),
      // Telemetry band.
      inst(preset('src/basics/Heading.tsx'), 140, 1050, {
        args: { text: 'Live telemetry', size: 28, color: INK },
      }),
      inst(preset('src/basics/PanelBand.tsx'), 100, 1120, { args: { width: 1080, height: 300 } }),
      inst(preset('src/kinetic-lab/LiquidFill.tsx'), 160, 1170, { args: { defaultValue: 72 } }),
      inst(preset('src/kinetic-ui/KineticRingProgress.tsx'), 440, 1180, { args: { defaultValue: 64 } }),
      inst(preset('src/text/AnimatedNumbers.tsx'), 720, 1200, {}),
      inst(preset('src/badges/StatusBadge.tsx'), 1000, 1200, {}),
      inst(preset('src/feedback/ProgressBar.tsx'), 160, 1490, { w: 480 }),
      inst(preset('src/basics/TextBlock.tsx'), 700, 1480, {
        args: {
          text: 'Sustained throughput at the wall: the bar above is the live buffer, not an illustration.',
          maxWidth: 420,
          size: 13,
          color: MUTED,
        },
      }),
      inst(preset('src/buttons/GhostButton.tsx'), 140, 1650, {
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
    boardHeight: 1100,
    fx: { loader: 'newtons-cradle', loaderAccent: AMBER, loaderMs: 1100, cursor: 'glow', cursorAccent: AMBER },
    instances: [
      inst(preset('src/backgrounds/Meteors.tsx'), 0, 0, {
        w: 1280,
        h: 1040,
        args: { count: 10, accent: '#8a8272', background: '#0a0a0c' },
      }),
      inst(preset('src/basics/Heading.tsx'), 470, 110, {
        args: { text: 'Access is limited.', size: 34, color: INK },
      }),
      inst(preset('src/cards/BrutalistNewsletterCard.tsx'), 470, 200, {
        args: {
          title: 'REQUEST ACCESS',
          description: 'First batch ships to 500 desks. No spam — one confirmation, one shipping note.',
          buttonLabel: 'JOIN THE LIST',
          accent: AMBER,
        },
      }),
      inst(preset('src/basics/TextBlock.tsx'), 472, 640, {
        args: {
          text: 'Allocation is one unit per person. Review takes about a week; payment only after approval.',
          maxWidth: 330,
          size: 12,
          color: '#8a8578',
        },
      }),
      inst(preset('src/buttons/GhostButton.tsx'), 555, 760, {
        args: { children: '← Back to launch' },
        linkTo: launchId,
        style: { color: MUTED },
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
    'Beams, huge type, animated signal numbers, real body copy and hardware imagery, a scroll set-piece, and a focused access page. One amber accent on a near-black stage.',
  accent: AMBER,
  build,
}
