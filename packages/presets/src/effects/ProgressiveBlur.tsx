/**
 * Progressive blur overlay for scroll edges (top/bottom).
 * Ported from Skiper UI (skiper41), inspired by devouringdetails.com.
 * Attribution to Skiper UI is required when using the free version.
 * Author: @gurvinder-singh02 (https://gxuri.me)
 */

type ProgressiveBlurProps = {
  className?: string;
  backgroundColor?: string;
  position?: "top" | "bottom";
  height?: string;
  blurAmount?: string;
};

/** Overlay: absolutely position inside a relative scroll container. */
export const ProgressiveBlur = ({
  className = "",
  backgroundColor = "#f5f4f3",
  position = "top",
  height = "150px",
  blurAmount = "4px",
}: ProgressiveBlurProps) => {
  const isTop = position === "top";

  return (
    <div
      className={`pointer-events-none absolute left-0 w-full select-none ${className}`}
      style={{
        [isTop ? "top" : "bottom"]: 0,
        height,
        background: isTop
          ? `linear-gradient(to top, transparent, ${backgroundColor})`
          : `linear-gradient(to bottom, transparent, ${backgroundColor})`,
        maskImage: isTop
          ? `linear-gradient(to bottom, ${backgroundColor} 50%, transparent)`
          : `linear-gradient(to top, ${backgroundColor} 50%, transparent)`,
        WebkitBackdropFilter: `blur(${blurAmount})`,
        backdropFilter: `blur(${blurAmount})`,
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    />
  );
};

/** Composed demo: scroll the panel — the edges stay progressively blurred. */
export const ProgressiveBlurDemo = () => {
  return (
    <div
      className="relative flex h-[420px] w-[480px] max-w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-[#f5f4f3] text-black/40"
      data-hover-demo="scroll"
    >
      <ProgressiveBlur position="top" backgroundColor="#f5f4f3" />
      <ProgressiveBlur position="bottom" backgroundColor="#f5f4f3" />

      <div className="flex h-full w-full flex-col items-center overflow-y-auto">
        <div className="mt-16 grid content-start justify-items-center gap-6 text-center text-black">
          <span className="relative max-w-[24ch] text-xs uppercase leading-tight opacity-40">
            Scroll down to see the effect
          </span>
        </div>

        <div className="mt-12 w-full max-w-lg space-y-16 px-5 text-justify text-sm">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Obcaecati, reiciendis eum vitae nostrum, temporibus repudiandae
              voluptatibus, natus iure ipsa velit odit quibusdam illum. Quaerat
              cumque laudantium libero reprehenderit perferendis quo nulla
              voluptate? Repellat tenetur labore exercitationem dicta libero
              voluptate suscipit, iusto ea assumenda. Ipsa enim, quidem atque
              modi error eaque, debitis perferendis, hic iste libero
              dignissimos ea! Quod inventore beatae aspernatur nulla rem
              perferendis aperiam at debitis delectus odit quia animi ex
              mollitia vero molestias itaque deleniti, quos exercitationem
              consequatur assumenda dolor?
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
