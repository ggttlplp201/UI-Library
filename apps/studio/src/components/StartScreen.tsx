import { SAMPLE_PROJECTS, type SampleProject } from '../lib/samples'

/**
 * The app's first screen. The real product is pointing the studio at YOUR
 * project, so that is the primary action; samples are the on-ramp below it.
 */

/** Small deterministic poster for a sample card: accent-lit type on a dark
 *  stage, echoing the sample's own art direction without booting a preview. */
function SamplePoster({ sample, tall = false }: { sample: SampleProject; tall?: boolean }) {
  const word = sample.title.split(' ')[0].toUpperCase()
  return (
    <div
      aria-hidden
      className={`relative overflow-hidden rounded-md ${tall ? 'h-24' : 'h-16'} w-full`}
      style={{
        background: `radial-gradient(120% 140% at 20% 0%, ${sample.accent}26, transparent 55%), #0b0b0d`,
      }}
    >
      <span
        className="absolute left-3 bottom-1 font-extrabold tracking-[-0.04em] leading-none select-none"
        style={{
          fontSize: tall ? 44 : 30,
          color: sample.accent,
          opacity: 0.9,
        }}
      >
        {word}
      </span>
      <span
        className="absolute right-2 top-2 font-mono text-[8px] uppercase tracking-[0.18em]"
        style={{ color: `${sample.accent}aa` }}
      >
        sample
      </span>
    </div>
  )
}

export function StartScreen({
  onOpenSample,
  onStartBuilding,
}: {
  onOpenSample: (sample: SampleProject) => void
  onStartBuilding: () => void
}) {
  const [flagship, ...rest] = SAMPLE_PROJECTS
  return (
    <div className="min-h-svh flex items-center justify-center p-6">
      <div className="w-full max-w-2xl py-10">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-6 h-6 rounded-sm bg-primary flex items-center justify-center">
            <span className="font-mono text-[13px] font-bold text-primary-foreground leading-none">S</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Component Style Studio
          </span>
        </div>

        <h1 className="text-4xl font-semibold tracking-[-0.03em] leading-[1.08] mb-3">
          Style any React component,
          <br />
          <span className="italic font-normal">visually.</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mb-7 leading-relaxed">
          Point the studio at your React project. Rearrange your components on a canvas,
          restyle them, link pages, and export the changed source or a working site.
        </p>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onStartBuilding}
            className="px-5 py-2.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Open your project →
          </button>
          <span className="text-[11px] text-muted-foreground">
            No install into your repo. The folder is scanned in place.
          </span>
        </div>

        <p className="font-mono text-[10px] font-medium text-muted-foreground uppercase tracking-[0.18em] mt-10 mb-3">
          No project handy? Open a sample
        </p>

        {/* Flagship: one wide card, the rest in a tight two-up grid. */}
        <button
          type="button"
          onClick={() => onOpenSample(flagship)}
          className="group w-full text-left rounded-lg border border-border bg-card hover:border-border/0 transition-colors p-4 mb-3"
          style={{ boxShadow: 'inset 0 0 0 1px transparent' }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${flagship.accent}66`)}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'inset 0 0 0 1px transparent')}
        >
          <div className="flex gap-4">
            <div className="w-44 shrink-0">
              <SamplePoster sample={flagship} tall />
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2.5">
                <span className="text-lg font-semibold tracking-tight">{flagship.title}</span>
                <span className="text-[11px] text-muted-foreground">{flagship.tagline}</span>
                <span className="ml-auto text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  Open sample →
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{flagship.detail}</p>
            </div>
          </div>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rest.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onOpenSample(s)}
              className="group text-left rounded-lg border border-border/60 bg-card/60 hover:bg-card hover:border-border transition-colors p-3"
            >
              <SamplePoster sample={s} />
              <div className="flex items-center gap-2 mt-2.5 px-0.5">
                <span className="text-[13px] font-semibold tracking-tight">{s.title}</span>
                <span className="ml-auto text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  Open →
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 px-0.5 leading-relaxed">{s.tagline}</p>
            </button>
          ))}
        </div>

        <p className="text-[11px] text-muted-foreground mt-6">
          Samples are ordinary projects: edit, preview, link pages, and export like anything
          you build yourself.
        </p>
      </div>
    </div>
  )
}
