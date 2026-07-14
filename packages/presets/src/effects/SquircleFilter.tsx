"use client";

/**
 * Squircle via SVG goo filter — pure CSS filter, no re-renders.
 * Ported from Skiper UI (skiper63) — Author: @gurvinder-singh02 (https://gxuri.me).
 * Attribution to Skiper UI is required when using the free version.
 *
 * To use in an app: render `SquiCircleFilterStatic` once in your layout, then
 * add `style={{ filter: "url(#SkiperSquiCircleFilterLayout)" }}` to any element.
 */

/** Mount once; defines the #SkiperSquiCircleFilterLayout SVG filter. */
export const SquiCircleFilterStatic = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 left-0"
      version="1.1"
    >
      <defs>
        <filter id="SkiperSquiCircleFilterLayout">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -7"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
};

/**
 * Demo shape with the squircle filter applied. Keeps the original demo's
 * full control set (filter toggle / size / blur / matrix / alpha) as props.
 */
export const SquircleShape = ({
  width = 300,
  height = 200,
  /** Blur radius driving how round the corners melt */
  blurValue = 10,
  /** Alpha multiplier row of the color matrix */
  colorMatrixValue = 20,
  /** Alpha offset of the color matrix (more negative = crisper edge) */
  alphaValue = -7,
  /** Apply the squircle filter (off shows the plain rounded rect) */
  filterOn = true,
}: {
  width?: number;
  height?: number;
  blurValue?: number;
  colorMatrixValue?: number;
  alphaValue?: number;
  filterOn?: boolean;
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 left-0"
        version="1.1"
      >
        <defs>
          <filter id="SquiCircleFilter">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={blurValue}
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${colorMatrixValue} ${alphaValue}`}
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div
        className="bg-foreground rounded-2xl"
        style={{
          height: `${height}px`,
          width: `${width}px`,
          filter: filterOn ? "url(#SquiCircleFilter)" : "none",
        }}
      ></div>
    </div>
  );
};
