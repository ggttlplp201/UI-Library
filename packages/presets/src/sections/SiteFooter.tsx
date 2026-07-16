import { cn } from "../lib/utils";

/** Simple page footer: brand, link columns, copyright line. */
export const SiteFooter = ({
  brand = "Acme",
  /** Comma-separated footer links */
  links = "Privacy, Terms, Contact, Careers",
  copyright = "© 2026 Acme Inc. All rights reserved.",
  className,
}: {
  brand?: string;
  links?: string;
  copyright?: string;
  className?: string;
}) => {
  const items = links.split(",").map((l) => l.trim()).filter(Boolean);
  return (
    <footer
      className={cn(
        "w-[960px] max-w-full rounded-2xl border border-border bg-background px-6 py-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="text-sm font-bold tracking-tight">{brand}</span>
        {items.map((item) => (
          <span
            key={item}
            data-link-slot={item}
            className="cursor-pointer text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          >
            {item}
          </span>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground/70">{copyright}</p>
    </footer>
  );
};
