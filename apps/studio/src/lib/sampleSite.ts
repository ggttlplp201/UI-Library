import { newInstanceId, newPageId, type Instance, type Page } from './canvas'

/**
 * The starter composition a fresh preset-library session opens with: a real
 * two-page landing site assembled from library components, so the first thing
 * a new user sees is what the app is FOR — not an empty board. Everything is
 * ordinary instances: select, edit, restyle, delete.
 */

const inst = (
  entryId: string,
  x: number,
  y: number,
  extra: Partial<Instance> = {},
): Instance => ({
  id: newInstanceId(),
  entryId,
  x,
  y,
  args: {},
  style: {},
  ...extra,
})

export function sampleSitePages(): Page[] {
  const homeId = newPageId()
  const aboutId = newPageId()

  const home: Page = {
    id: homeId,
    name: 'Home',
    nodeX: 90,
    nodeY: 130,
    artboardWidth: 1280,
    boardHeight: 1620,
    fx: { loader: 'bouncing-balls', loaderAccent: '#7c6fff', loaderMs: 1200 },
    instances: [
      inst('src/sections/SiteNavbar.tsx#SiteNavbar', 0, 0, {
        w: 1280,
        args: { brand: 'Lumen', links: 'Features, Pricing, About', cta: 'Get started' },
        links: { cta: aboutId, About: aboutId },
      }),
      inst('src/sections/HeroSection.tsx#HeroSection', 0, 72, {
        w: 1280,
        args: {
          title: 'Design pages people remember',
          subtitle:
            'Compose real components, style them visually, and ship a working site — all from one canvas.',
          primaryCta: 'Start building',
          secondaryCta: 'See examples',
        },
        links: { primary: aboutId, secondary: aboutId },
        anim: { preset: 'fade', duration: 0.8, delay: 0, easing: 'ease-out' },
      }),
      inst('src/sections/FeatureGrid.tsx#FeatureGrid', 0, 640, {
        w: 1280,
        args: {
          heading: 'Everything you need',
          features:
            'Fast: Builds in milliseconds, not minutes | Flexible: Compose any component with any animation | Portable: Exports a working site you own',
        },
        anim: { preset: 'slide-up', trigger: 'scroll', duration: 0.7, delay: 0, easing: 'ease-out', once: true },
      }),
      inst('src/sections/CtaSection.tsx#CtaSection', 0, 1100, {
        w: 1280,
        args: {
          title: 'Ready to build your page?',
          subtitle: 'Start from any component in the library.',
          cta: 'Get started free',
        },
        links: { cta: aboutId },
      }),
      inst('src/sections/SiteFooter.tsx#SiteFooter', 0, 1420, {
        w: 1280,
        args: { brand: 'Lumen', copyright: '© 2026 Lumen. All rights reserved.' },
      }),
    ],
  }

  const about: Page = {
    id: aboutId,
    name: 'About',
    nodeX: 340,
    nodeY: 130,
    artboardWidth: 1280,
    boardHeight: 900,
    fx: { loader: 'newtons-cradle', loaderAccent: '#7c6fff', loaderMs: 1200 },
    instances: [
      inst('src/sections/LampHeader.tsx#LampHeader', 320, 96, {
        args: {
          title: 'Built from the library',
          subtitle: 'Every block on these pages is a live component you can restyle.',
          accent: '#7c6fff',
        },
      }),
      inst('src/kinetic-ui/KineticAvatarStack.tsx#KineticAvatarStack', 560, 470, {
        args: { initials: 'AL, MK, JD, +5' },
      }),
      inst('src/buttons/GlossyJoinButton.tsx#GlossyJoinButton', 512, 600, {
        args: { label: 'Back home' },
        linkTo: homeId,
      }),
    ],
  }

  return [home, about]
}
