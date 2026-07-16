import { BOLD, BOLD_FONT_IMPORT, bentoFrame } from "./libBold";

/**
 * Boldcase bento card — index chip, title, blurb inside the hard-framed
 * offset-shadow surface; hover nudges it against its shadow. Original set
 * for Component Style Studio, inspired by studio-editorial bento systems. MIT.
 */
export const BentoCard = ({
  index = "01",
  title = "Art direction",
  body = "One loud idea per tile. The border does the framing, the shadow does the depth, the type does the shouting.",
  accent = "#2b46ff",
  width = 280,
}: {
  /** Corner index */
  index?: string;
  /** Card title */
  title?: string;
  /** Card copy */
  body?: string;
  /** Index chip color */
  accent?: string;
  /** Card width in px */
  width?: number;
}) => (
  <>
    <style>{`
      ${BOLD_FONT_IMPORT}
      .bc-card { transition: transform .15s ease, box-shadow .15s ease; }
      .bc-card:hover { transform: translate(2px, 2px); box-shadow: 3px 3px 0 0 ${BOLD.ink} !important; }
    `}</style>
    <div style={{ padding: 8, display: "inline-block" }}>
      <div className="bc-card" style={{ ...bentoFrame(), width, padding: "16px 16px 18px", boxSizing: "border-box", fontFamily: BOLD.body }}>
        <span
          style={{
            display: "inline-block",
            fontFamily: BOLD.display,
            fontSize: 13,
            background: accent,
            color: "#fff",
            border: `2px solid ${BOLD.ink}`,
            padding: "2px 8px",
            marginBottom: 12,
          }}
        >
          {index}
        </span>
        <h3 style={{ margin: 0, fontFamily: BOLD.display, fontSize: 24, lineHeight: 1.02, textTransform: "uppercase", color: BOLD.ink }}>
          {title}
        </h3>
        <p style={{ margin: "10px 0 0", fontSize: 13, lineHeight: 1.5, color: "#4b463d", fontWeight: 600 }}>{body}</p>
      </div>
    </div>
  </>
);
