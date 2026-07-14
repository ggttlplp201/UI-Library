import { cn } from "../lib/utils";

/**
 * Three-up feature grid with title/description cells. Feed it pipe-separated
 * "Title: description" entries to change the content.
 */
export const FeatureGrid = ({
  heading = "Everything you need",
  /** Pipe-separated features, each "Title: description" */
  features = "Fast: Builds in milliseconds, not minutes | Flexible: Compose any component with any animation | Portable: Exports a working site you own",
  className,
}: {
  heading?: string;
  features?: string;
  className?: string;
}) => {
  const cells = features
    .split("|")
    .map((f) => {
      const [title, ...rest] = f.split(":");
      return { title: title?.trim() ?? "", body: rest.join(":").trim() };
    })
    .filter((c) => c.title);
  return (
    <section
      className={cn(
        "w-[960px] max-w-full rounded-3xl border border-border bg-background px-8 py-12",
        className,
      )}
    >
      <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">{heading}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {cells.map((cell) => (
          <div
            key={cell.title}
            className="rounded-2xl border border-border bg-muted/40 p-5 transition-transform hover:-translate-y-0.5"
          >
            <h3 className="mb-1.5 text-base font-semibold">{cell.title}</h3>
            <p className="text-[13px] leading-relaxed text-muted-foreground">{cell.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
