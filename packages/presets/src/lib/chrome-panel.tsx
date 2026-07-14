/**
 * Shared Chrome Console panel chrome: brushed-steel plate, 4 corner screws,
 * engraved label, mono readout. Lowercase helper (not a component export) so
 * it never registers as its own library entry.
 */
import type { ReactNode } from "react";
import { CC_KEYFRAMES, sx, type CCMaterials } from "./chrome";

export function ccPanel(
  m: CCMaterials,
  label: string,
  control: ReactNode,
  readout: ReactNode,
): React.JSX.Element {
  return (
    <div style={sx(m.panel)}>
      <style>{CC_KEYFRAMES}</style>
      {m.screws.map((c, i) => (
        <span key={i} style={sx(c.s)}>
          <i style={sx(c.slot)} />
        </span>
      ))}
      <div style={sx(m.label)}>{label}</div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>{control}</div>
      <div style={sx(m.readout)}>{readout}</div>
    </div>
  );
}
