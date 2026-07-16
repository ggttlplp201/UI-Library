import { SAMPLE_PROJECTS, type SampleProject } from '../lib/samples'

/**
 * The app's first screen: open a prebuilt sample project (flagship first) or
 * head to the import screen to start building from a folder / the preset
 * library. Samples open as normal editable workspaces.
 */
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
          Compose live components on a canvas, edit style and motion, then export a working
          site — or the changed source.
        </p>

        <button
          type="button"
          onClick={onStartBuilding}
          className="px-5 py-2.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98] transition-all"
        >
          Start building →
        </button>

        <p className="font-mono text-[10px] font-medium text-muted-foreground uppercase tracking-[0.18em] mt-10 mb-3">
          Or open a sample project
        </p>

        {/* Flagship: one wide card, the rest in a tight two-up grid. */}
        <button
          type="button"
          onClick={() => onOpenSample(flagship)}
          className="group w-full text-left rounded-lg border border-border bg-card hover:border-border/0 transition-colors p-5 mb-3"
          style={{ boxShadow: 'inset 0 0 0 1px transparent' }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${flagship.accent}66`)}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'inset 0 0 0 1px transparent')}
        >
          <div className="flex items-baseline gap-2.5">
            <span className="w-2 h-2 rounded-full shrink-0 translate-y-[-1px]" style={{ background: flagship.accent }} />
            <span className="text-lg font-semibold tracking-tight">{flagship.title}</span>
            <span className="text-[11px] text-muted-foreground">{flagship.tagline}</span>
            <span className="ml-auto text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              Open sample →
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-lg">{flagship.detail}</p>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rest.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onOpenSample(s)}
              className="group text-left rounded-lg border border-border/60 bg-card/60 hover:bg-card hover:border-border transition-colors p-4"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.accent }} />
                <span className="text-[13px] font-semibold tracking-tight">{s.title}</span>
                <span className="ml-auto text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  Open →
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">{s.tagline}</p>
            </button>
          ))}
        </div>

        <p className="text-[11px] text-muted-foreground mt-6">
          Samples are ordinary projects — edit, preview, link pages, and export like anything
          you build yourself.
        </p>
      </div>
    </div>
  )
}
