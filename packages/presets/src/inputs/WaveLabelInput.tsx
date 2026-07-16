/**
 * WaveLabelInput — underlined text field whose label letters ripple upward
 * one by one in a wave when focused or filled.
 * Ported from UIverse.io (warm-eel-62) by liyaxu123.
 * Source: https://uiverse.io/liyaxu123/warm-eel-62
 * License: MIT. Attribution: liyaxu123 via UIverse.io.
 */
export const WaveLabelInput = ({
  label = "Username",
  accent = "lightblue",
  color = "#fff",
}: {
  /** Label text (animates letter by letter) */
  label?: string;
  /** Active underline + label color */
  accent?: string;
  /** Resting text color */
  color?: string;
}) => (
  <>
    <style>{`
      .uv-wli {
        position: relative;
        margin: 20px 0 40px;
        width: 190px;
      }
      .uv-wli input {
        background-color: transparent;
        border: 0;
        border-bottom: 2px var(--uv-wli-color) solid;
        display: block;
        width: 100%;
        padding: 15px 0;
        font-size: 18px;
        color: var(--uv-wli-color);
      }
      .uv-wli input:focus,
      .uv-wli input:valid {
        outline: 0;
        border-bottom-color: var(--uv-wli-accent);
      }
      .uv-wli label {
        position: absolute;
        top: 15px;
        left: 0;
        pointer-events: none;
      }
      .uv-wli label span {
        display: inline-block;
        font-size: 18px;
        min-width: 5px;
        color: var(--uv-wli-color);
        transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
      .uv-wli input:focus + label span,
      .uv-wli input:valid + label span {
        color: var(--uv-wli-accent);
        transform: translateY(-30px);
      }
    `}</style>
    <div
      className="uv-wli"
      style={{
        ["--uv-wli-color" as string]: color,
        ["--uv-wli-accent" as string]: accent,
      }}
    >
      <input type="text" required />
      <label>
        {label.split("").map((ch, i) => (
          <span key={i} style={{ transitionDelay: `${i * 50}ms` }}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </label>
    </div>
  </>
);
