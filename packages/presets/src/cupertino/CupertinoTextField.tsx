import { cuCard, cuControlGlass, cuInk, CuAppearance, CU_FONT } from "../lib/cupertino";

/**
 * Cupertino text field — inline glass field with the loupe icon in search
 * mode; blur reads correctly against the tinted card.
 * Original for Component Style Studio (design handoff: cupertino). MIT.
 */
export const CupertinoTextField = ({
  placeholder = "Search",
  search = true,
  appearance = "light",
  tint1 = "#9fe6b0",
  tint2 = "#7fd8d0",
}: {
  /** Placeholder text */
  placeholder?: string;
  /** Show the search loupe */
  search?: boolean;
  /** Light or dark glass */
  appearance?: CuAppearance;
  /** Card tint, first stop */
  tint1?: string;
  /** Card tint, second stop */
  tint2?: string;
}) => {
  const dark = appearance === "dark";
  const ink = cuInk(dark);
  return (
    <div style={{ ...cuCard(tint1, tint2, dark), minWidth: 260 }}>
      <style>{`
        .cu-tf-input::placeholder { color: ${ink.sub}; }
        .cu-tf-loupe::after {
          content: '';
          position: absolute;
          width: 2px; height: 6px;
          background: ${ink.sub};
          border-radius: 1px;
          bottom: -4px; right: -1px;
          transform: rotate(-45deg);
        }
      `}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 12, ...cuControlGlass(dark) }}>
        {search && (
          <span
            className="cu-tf-loupe"
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              border: `2px solid ${ink.sub}`,
              position: "relative",
              flexShrink: 0,
              boxSizing: "border-box",
            }}
          />
        )}
        <input
          className="cu-tf-input"
          placeholder={placeholder}
          style={{
            flex: 1,
            border: "none",
            background: "none",
            outline: "none",
            fontSize: 15,
            color: ink.head,
            fontFamily: CU_FONT,
            minWidth: 0,
          }}
        />
      </div>
    </div>
  );
};
