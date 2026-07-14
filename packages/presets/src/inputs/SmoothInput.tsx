"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import React, {
  type ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "../lib/utils";

/**
 * Text input with a smooth spring-animated caret.
 * Ported from Skiper UI (skiper106); the dialkit debug controls are replaced
 * by plain props so the preset is self-contained.
 * Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 (https://gxuri.me)
 */

const inputWrapperClassName = cn(
  "bg-muted2 has-[:focus-visible]:outline-muted3 relative w-full max-w-[420px] rounded-2xl p-4",
  "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
);

const inputClassName =
  "w-full bg-transparent outline-none placeholder:text-foreground/40";

type InputFieldProps = ComponentPropsWithoutRef<"input"> & {
  wrapperClassName?: string;
};

type SmoothInputType = "text" | "password";

type SmoothInputProps = Omit<InputFieldProps, "type"> & {
  type?: SmoothInputType;
  /** Empty-state text (redeclared locally so the Studio surfaces it) */
  placeholder?: string;
  /** Font size of the typed text, in px */
  fontSize?: number;
  /** Caret spring stiffness (original demo's spring control) */
  springStiffness?: number;
  /** Caret spring damping */
  springDamping?: number;
  /** Caret spring mass */
  springMass?: number;
};

/** Plain input styled to match SmoothInput. */
export const Input = ({
  className,
  wrapperClassName,
  ...props
}: InputFieldProps) => {
  return (
    <div className={cn(inputWrapperClassName, wrapperClassName)}>
      <input className={cn(inputClassName, className)} {...props} />
    </div>
  );
};

const PASSWORD_CHAR = navigator.userAgent.match(/firefox|fxios/i)
  ? "●"
  : "•";

export const SmoothInput = ({
  className,
  wrapperClassName,
  value,
  defaultValue,
  onChange,
  onBlur,
  type = "text",
  placeholder = "smooth input",
  fontSize = 24,
  springStiffness = 500,
  springDamping = 30,
  springMass = 0.5,
  style,
  ...props
}: SmoothInputProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const caretX = useMotionValue(0);
  const caretOpacity = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const isControlled = value !== undefined;

  const springCaretX = useSpring(
    caretX,
    prefersReducedMotion
      ? { stiffness: 10000, damping: 100, mass: 0.1 }
      : { stiffness: springStiffness, damping: springDamping, mass: springMass },
  );

  const inputValue = isControlled ? String(value) : internalValue;

  const syncMeasureSpan = () => {
    const input = inputRef.current;
    const measureSpan = measureRef.current;
    if (!input || !measureSpan) return;

    const styles = window.getComputedStyle(input);
    const isPassword = input.type === "password";

    let measuredFontSize = styles.fontSize;
    if (
      PASSWORD_CHAR === "•" &&
      isPassword &&
      !navigator.userAgent.match(/chrome|chromium|crios/i)
    ) {
      measuredFontSize = `${parseFloat(measuredFontSize) + 6.25}px`;
    }

    measureSpan.style.font = `${styles.fontStyle} ${styles.fontWeight} ${measuredFontSize} ${styles.fontFamily}`;
    measureSpan.style.letterSpacing = styles.letterSpacing;
    measureSpan.style.fontFeatureSettings = styles.fontFeatureSettings;
    measureSpan.style.fontVariationSettings = styles.fontVariationSettings;
  };

  const measurePrefixWidth = (text: string) => {
    const input = inputRef.current;
    const measureSpan = measureRef.current;
    if (!input || !measureSpan) return null;

    syncMeasureSpan();
    measureSpan.textContent = text;

    const paddingLeft =
      parseFloat(window.getComputedStyle(input).paddingLeft) || 0;

    return text.length > 0
      ? measureSpan.offsetWidth + paddingLeft
      : paddingLeft - 1;
  };

  const scrollCaretIntoView = (
    target: HTMLInputElement,
    absoluteWidth: number,
  ) => {
    const styles = window.getComputedStyle(target);
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;
    const maxScroll = Math.max(0, target.scrollWidth - target.clientWidth);
    const visibleRight = target.scrollLeft + target.clientWidth - paddingRight;
    const visibleLeft = target.scrollLeft + paddingLeft;

    if (absoluteWidth > visibleRight) {
      target.scrollLeft = Math.min(
        maxScroll,
        absoluteWidth - target.clientWidth + paddingRight,
      );
      return;
    }

    if (absoluteWidth < visibleLeft) {
      target.scrollLeft = Math.max(0, absoluteWidth - paddingLeft);
    }
  };

  const getCaretIndex = (target: HTMLInputElement) => {
    const selectionStart = target.selectionStart ?? 0;
    const selectionEnd = target.selectionEnd ?? 0;

    if (selectionStart === selectionEnd) {
      return selectionStart;
    }

    return target.selectionDirection === "backward"
      ? selectionStart
      : selectionEnd;
  };

  const updateCaretFromInput = (target: HTMLInputElement) => {
    const selectionStart = target.selectionStart ?? 0;
    const selectionEnd = target.selectionEnd ?? 0;
    const hasSelection = selectionStart !== selectionEnd;
    const caretIndex = getCaretIndex(target);
    const isPassword = target.type === "password";
    const textBeforeCaret = isPassword
      ? PASSWORD_CHAR.repeat(caretIndex)
      : target.value.slice(0, caretIndex);

    const absoluteWidth = measurePrefixWidth(textBeforeCaret);
    if (absoluteWidth === null) return;

    scrollCaretIntoView(target, absoluteWidth);

    const styles = window.getComputedStyle(target);
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;
    const caretPosition = absoluteWidth - target.scrollLeft;
    const minX = paddingLeft - 1;
    const maxX = target.clientWidth - paddingRight;
    const isCaretVisible = caretPosition >= minX && caretPosition <= maxX + 1;

    caretX.set(Math.min(caretPosition, maxX));

    if (!isCaretVisible || hasSelection) {
      caretOpacity.set(0);
      return;
    }

    caretOpacity.set(1);
  };

  const updateCaretRef = useRef(updateCaretFromInput);
  updateCaretRef.current = updateCaretFromInput;
  const caretOpacityRef = useRef(caretOpacity);
  caretOpacityRef.current = caretOpacity;

  useEffect(() => {
    const input = inputRef.current;
    if (input && document.activeElement === input) {
      updateCaretRef.current(input);
    }
  }, [inputValue, type, fontSize]);

  useEffect(() => {
    const input = inputRef.current;
    const container = containerRef.current;
    if (!input || !container) return;

    const updateCaretIfFocused = () => {
      if (document.activeElement === input) {
        updateCaretRef.current(input);
      }
    };

    const handleSelectionChange = () => {
      if (document.activeElement !== input) return;

      requestAnimationFrame(() => {
        if (document.activeElement === input) {
          updateCaretRef.current(input);
        }
      });
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    document.fonts.addEventListener("loadingdone", updateCaretIfFocused);
    void document.fonts.ready.then(updateCaretIfFocused);
    input.addEventListener("scroll", updateCaretIfFocused);

    const resizeObserver = new ResizeObserver(updateCaretIfFocused);
    resizeObserver.observe(container);

    updateCaretIfFocused();

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.fonts.removeEventListener("loadingdone", updateCaretIfFocused);
      input.removeEventListener("scroll", updateCaretIfFocused);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={cn(inputWrapperClassName, wrapperClassName)}
      data-hover-demo="type"
    >
      <div
        ref={containerRef}
        className="relative grid grid-cols-1 p-0"
        style={{ caretColor: "transparent", fontSize }}
      >
        <input
          {...props}
          ref={inputRef}
          type={type}
          placeholder={placeholder}
          className={cn(
            inputClassName,
            "col-start-1 col-end-2 row-start-1 row-end-2 text-inherit",
            className,
          )}
          style={style}
          value={inputValue}
          onChange={(e) => {
            if (!isControlled) setInternalValue(e.target.value);
            onChange?.(e);
            requestAnimationFrame(() => {
              updateCaretRef.current(e.target);
            });
          }}
          onBlur={(e) => {
            caretOpacityRef.current.set(0);
            onBlur?.(e);
          }}
        />
        <span
          ref={measureRef}
          aria-hidden
          className="pointer-events-none invisible absolute top-0 left-0 whitespace-pre"
        />
        <motion.div
          className="bg-primary pointer-events-none col-start-1 col-end-2 row-start-1 row-end-2 h-[0.9em] w-0.5 self-center"
          style={{ x: springCaretX, opacity: caretOpacity }}
        />
      </div>
    </div>
  );
};
