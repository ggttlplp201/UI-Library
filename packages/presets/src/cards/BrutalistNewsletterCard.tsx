/**
 * BrutalistNewsletterCard — neo-brutalist signup card with hard black
 * borders, an offset shadow that grows on hover, and a "Sure?" button flip.
 * Ported from UIverse.io (nasty-husky-13) by 0xnihilism.
 * Source: https://uiverse.io/0xnihilism/nasty-husky-13
 * License: MIT. Attribution: 0xnihilism via UIverse.io.
 */
import type { CSSProperties } from "react";

export const BrutalistNewsletterCard = ({
  title = "Newsletter",
  description = "Get existential crisis delivered straight to your inbox every week.",
  placeholder = "Your life",
  buttonLabel = "Click me",
  confirmLabel = "Sure?",
  accent = "#5ad641",
}: {
  /** Card heading */
  title?: string;
  /** Body copy */
  description?: string;
  /** Email input placeholder */
  placeholder?: string;
  /** Submit button text */
  buttonLabel?: string;
  /** Text revealed when hovering the button */
  confirmLabel?: string;
  /** Confirm overlay color */
  accent?: string;
}) => (
  <>
    <style>{`
      .uv-bnc-card {
        width: 300px;
        padding: 20px;
        background: #fff;
        border: 6px solid #000;
        box-shadow: 12px 12px 0 #000;
        transition: transform 0.3s, box-shadow 0.3s;
      }
      .uv-bnc-card:hover {
        transform: translate(-5px, -5px);
        box-shadow: 17px 17px 0 #000;
      }
      .uv-bnc-title {
        font-size: 32px;
        font-weight: 900;
        color: #000;
        text-transform: uppercase;
        margin-bottom: 15px;
        display: block;
        position: relative;
        overflow: hidden;
      }
      .uv-bnc-title::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 90%;
        height: 3px;
        background-color: #000;
        transform: translateX(-100%);
        transition: transform 0.3s;
      }
      .uv-bnc-card:hover .uv-bnc-title::after {
        transform: translateX(0);
      }
      .uv-bnc-content {
        font-size: 16px;
        line-height: 1.4;
        color: #000;
        margin-bottom: 20px;
      }
      .uv-bnc-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      .uv-bnc-form input {
        padding: 10px;
        border: 3px solid #000;
        font-size: 16px;
        font-family: inherit;
        transition: transform 0.3s;
        width: calc(100% - 26px);
      }
      .uv-bnc-form input:focus {
        outline: none;
        transform: scale(1.05);
        background-color: #000;
        color: #ffffff;
      }
      .uv-bnc-button {
        border: 3px solid #000;
        background: #000;
        color: #fff;
        padding: 10px;
        font-size: 18px;
        left: 20%;
        font-weight: bold;
        text-transform: uppercase;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: transform 0.3s;
        width: 50%;
        height: 100%;
      }
      .uv-bnc-button::before {
        content: attr(data-confirm);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 105%;
        background-color: var(--uv-bnc-accent);
        color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateY(100%);
        transition: transform 0.3s;
      }
      .uv-bnc-button:hover::before {
        transform: translateY(0);
      }
      .uv-bnc-button:active {
        transform: scale(0.95);
      }
    `}</style>
    <div
      className="uv-bnc-card"
      style={{ "--uv-bnc-accent": accent } as CSSProperties}
    >
      <span className="uv-bnc-title">{title}</span>
      <p className="uv-bnc-content">{description}</p>
      <form className="uv-bnc-form" onSubmit={(e) => e.preventDefault()}>
        <input required type="email" placeholder={placeholder} />
        <button type="submit" className="uv-bnc-button" data-confirm={confirmLabel}>
          {buttonLabel}
        </button>
      </form>
    </div>
  </>
);
