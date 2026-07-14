import { cn } from "../lib/utils";

/**
 * Page-width navigation bar: brand, links, call-to-action. The building
 * block for the top of a page — pair with HeroSection below it.
 */
export const SiteNavbar = ({
  /** Brand name shown on the left */
  brand = "Acme",
  /** Comma-separated nav labels */
  links = "Features, Pricing, About",
  /** Call-to-action button label */
  cta = "Get started",
  className,
}: {
  brand?: string;
  links?: string;
  cta?: string;
  className?: string;
}) => {
  const items = links.split(",").map((l) => l.trim()).filter(Boolean);
  return (
    <nav
      className={cn(
        "flex w-[960px] max-w-full items-center gap-8 rounded-2xl border border-border bg-background/90 px-6 py-3.5 backdrop-blur",
        className,
      )}
    >
      <span className="text-sm font-bold tracking-tight">{brand}</span>
      <div className="hidden items-center gap-6 sm:flex">
        {items.map((item) => (
          <span
            key={item}
            className="cursor-pointer text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            {item}
          </span>
        ))}
      </div>
      <button
        type="button"
        className="ml-auto rounded-lg bg-primary px-3.5 py-1.5 text-[13px] font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
      >
        {cta}
      </button>
    </nav>
  );
};
