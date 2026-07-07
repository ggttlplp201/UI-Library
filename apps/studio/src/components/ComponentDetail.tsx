import type { RegistryEntry } from '@component-style-studio/registry'

export function ComponentDetail({ entry }: { entry: RegistryEntry }) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-base font-semibold tracking-tight">{entry.name}</h2>
          {entry.category && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-primary/20 text-accent-foreground">
              {entry.category}
            </span>
          )}
        </div>
        <p className="text-[11px] font-mono text-muted-foreground mb-3">{entry.filePath}</p>
        {entry.description && (
          <p className="text-xs text-muted-foreground mb-4">{entry.description}</p>
        )}

        {entry.flags.needsMocking && (
          <div className="mb-5 rounded-md border border-amber-400/25 bg-amber-400/10 px-3 py-2">
            <p className="text-[11px] text-amber-300 font-medium mb-0.5">
              Unresolvable runtime dependencies — preview will use placeholder mocks
            </p>
            <p className="text-[11px] text-muted-foreground">
              {[
                entry.flags.usesContext ? 'reads React context' : null,
                entry.flags.externalHooks.length > 0
                  ? `external hooks: ${entry.flags.externalHooks.join(', ')}`
                  : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>
        )}

        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
          Props {entry.props.length > 0 && `(${entry.props.length})`}
        </p>
        {entry.props.length === 0 ? (
          <p className="text-xs text-muted-foreground">No props detected.</p>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-muted text-muted-foreground">
                  <th className="font-medium px-3 py-2">Name</th>
                  <th className="font-medium px-3 py-2">Type</th>
                  <th className="font-medium px-3 py-2">Default</th>
                  <th className="font-medium px-3 py-2">Required</th>
                </tr>
              </thead>
              <tbody>
                {entry.props.map((prop) => (
                  <tr key={prop.name} className="border-t border-border align-top">
                    <td className="px-3 py-2 font-mono whitespace-nowrap">
                      {prop.name}
                      {prop.description && (
                        <span className="block font-sans text-[10px] text-muted-foreground max-w-52 whitespace-normal">
                          {prop.description}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 font-mono text-accent-foreground break-all">
                      {prop.type}
                    </td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">
                      {prop.defaultValue ?? '—'}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {prop.required ? 'yes' : 'no'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
