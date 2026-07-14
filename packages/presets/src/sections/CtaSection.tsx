import { cn } from "../lib/utils";

/** Full-width closing call-to-action band. */
export const CtaSection = ({
  title = "Ready to build your page?",
  subtitle = "Start from any component in the library.",
  cta = "Get started free",
  className,
}: {
  title?: string;
  subtitle?: string;
  cta?: string;
  className?: string;
}) => {
  return (
    <section
      className={cn(
        "flex w-[960px] max-w-full flex-col items-center gap-3 rounded-3xl bg-primary px-8 py-12 text-center text-primary-foreground",
        className,
      )}
    >
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm opacity-80">{subtitle}</p>
      <button
        type="button"
        className="mt-2 rounded-xl bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-transform hover:scale-[1.03] active:scale-95"
      >
        {cta}
      </button>
    </section>
  );
};
