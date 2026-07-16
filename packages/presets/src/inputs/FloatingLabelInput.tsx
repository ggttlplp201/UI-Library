/**
 * FloatingLabelInput — Material-style text field whose label floats up and
 * shrinks onto the border when focused or filled.
 * Ported from UIverse.io (slippery-snail-18) by alexruix.
 * Source: https://uiverse.io/alexruix/slippery-snail-18
 * License: MIT. Attribution: alexruix via UIverse.io.
 */
export const FloatingLabelInput = ({
  label = "First Name",
  accent = "#1a73e8",
  labelAccent = "#2196f3",
  labelBg = "#212121",
}: {
  /** Floating label text */
  label?: string;
  /** Focused border color */
  accent?: string;
  /** Floated label color */
  labelAccent?: string;
  /** Label patch background (match the surface behind the input) */
  labelBg?: string;
}) => (
  <>
    <style>{`
      .uv-fli-group {
        position: relative;
      }
      .uv-fli-input {
        border: solid 1.5px #9e9e9e;
        border-radius: 1rem;
        background: none;
        padding: 1rem;
        font-size: 1rem;
        color: #f5f5f5;
        transition: border 150ms cubic-bezier(0.4,0,0.2,1);
      }
      .uv-fli-label {
        position: absolute;
        left: 15px;
        color: #e8e8e8;
        pointer-events: none;
        transform: translateY(1rem);
        transition: 150ms cubic-bezier(0.4,0,0.2,1);
      }
      .uv-fli-input:focus, .uv-fli-input:valid {
        outline: none;
        border: 1.5px solid var(--uv-fli-accent);
      }
      .uv-fli-input:focus ~ label, .uv-fli-input:valid ~ label {
        transform: translateY(-50%) scale(0.8);
        background-color: var(--uv-fli-label-bg);
        padding: 0 .2em;
        color: var(--uv-fli-label-accent);
      }
    `}</style>
    <div
      className="uv-fli-group"
      style={{
        ["--uv-fli-accent" as string]: accent,
        ["--uv-fli-label-bg" as string]: labelBg,
        ["--uv-fli-label-accent" as string]: labelAccent,
      }}
    >
      <input required type="text" name="text" autoComplete="off" className="uv-fli-input" />
      <label className="uv-fli-label">{label}</label>
    </div>
  </>
);
