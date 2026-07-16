/**
 * Web-font catalog for the Style tab: the fonts working designers actually
 * reach for. Loaded once (Google Fonts) in the preview harness and injected
 * into exports, so an override renders identically on canvas, in preview,
 * and in the shipped site.
 */
export const WEB_FONTS: { label: string; value: string }[] = [
  { label: 'Default', value: '' },
  // Grotesks / UI sans
  { label: 'Inter', value: "'Inter', system-ui, sans-serif" },
  { label: 'Inter Tight', value: "'Inter Tight', system-ui, sans-serif" },
  { label: 'Space Grotesk', value: "'Space Grotesk', system-ui, sans-serif" },
  { label: 'Manrope', value: "'Manrope', system-ui, sans-serif" },
  { label: 'Sora', value: "'Sora', system-ui, sans-serif" },
  { label: 'DM Sans', value: "'DM Sans', system-ui, sans-serif" },
  { label: 'Plus Jakarta Sans', value: "'Plus Jakarta Sans', system-ui, sans-serif" },
  { label: 'Archivo', value: "'Archivo', system-ui, sans-serif" },
  { label: 'Syne', value: "'Syne', system-ui, sans-serif" },
  // Display
  { label: 'Archivo Black', value: "'Archivo Black', 'Arial Black', sans-serif" },
  { label: 'Bebas Neue', value: "'Bebas Neue', 'Arial Narrow', sans-serif" },
  // Serifs
  { label: 'Playfair Display', value: "'Playfair Display', Georgia, serif" },
  { label: 'Fraunces', value: "'Fraunces', Georgia, serif" },
  { label: 'EB Garamond', value: "'EB Garamond', Georgia, serif" },
  // Mono
  { label: 'IBM Plex Mono', value: "'IBM Plex Mono', ui-monospace, monospace" },
  { label: 'JetBrains Mono', value: "'JetBrains Mono', ui-monospace, monospace" },
  { label: 'Space Mono', value: "'Space Mono', ui-monospace, monospace" },
  // Handwriting
  { label: 'Caveat', value: "'Caveat', cursive" },
  // System fallbacks
  { label: 'System sans', value: 'system-ui, sans-serif' },
  { label: 'System serif', value: 'Georgia, serif' },
  { label: 'System mono', value: 'ui-monospace, monospace' },
]

/** One combined stylesheet for every catalog font (shared with the export). */
export const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Inter+Tight:wght@400;600;800&family=Space+Grotesk:wght@400;500;700&family=Manrope:wght@400;600;800&family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;600;800&family=Archivo:wght@400;600;800&family=Syne:wght@400;600;800&family=Archivo+Black&family=Bebas+Neue&family=Playfair+Display:wght@400;600;800&family=Fraunces:wght@400;600;900&family=EB+Garamond:wght@400;600&family=IBM+Plex+Mono:wght@400;600&family=JetBrains+Mono:wght@400;600&family=Space+Mono:wght@400;700&family=Caveat:wght@500;700&display=swap'
