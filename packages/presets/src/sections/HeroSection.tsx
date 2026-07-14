import { cn } from "../lib/utils";

/**
 * Centered hero: headline, subline, primary + secondary actions. The first
 * thing a landing page says.
 */
export const HeroSection = ({
  title = "Design pages people remember",
  subtitle = "Compose real components, style them visually, and ship a working site — all from one canvas.",
  primaryCta = "Start building",
  secondaryCta = "See examples",
  className,
}: {
  title?: string;
  subtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
  className?: string;
}) => {
  return (
    <section
      className={cn(
        "flex w-[960px] max-w-full flex-col items-center gap-5 rounded-3xl border border-border bg-background px-8 py-16 text-center",
        className,
      )}
    >
      <h1 className="max-w-2xl text-5xl font-bold leading-[1.05] tracking-tight">{title}</h1>
      <p className="max-w-xl text-base leading-relaxed text-muted-foreground">{subtitle}</p>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          data-link-slot="primary"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
        >
          {primaryCta}
        </button>
        <button
          type="button"
          data-link-slot="secondary"
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          {secondaryCta}
        </button>
      </div>
    </section>
  );
};
