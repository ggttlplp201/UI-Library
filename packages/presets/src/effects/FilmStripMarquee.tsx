import { useId } from "react";

/**
 * FilmStripMarquee — a rolling strip of film stills between sprocket-hole
 * perforation ribbons, Kino-Archive style: grain-friendly frames, optional
 * red caption bars, infinite scroll that pauses on hover.
 * Original component for Component Style Studio. License: MIT.
 */
export const FilmStripMarquee = ({
  images = "https://picsum.photos/id/1015/440/280?grayscale\nhttps://picsum.photos/id/1016/440/280?grayscale\nhttps://picsum.photos/id/1018/440/280?grayscale\nhttps://picsum.photos/id/1036/440/280?grayscale\nhttps://picsum.photos/id/1041/440/280?grayscale\nhttps://picsum.photos/id/1080/440/280?grayscale",
  captions = "Am — Movie\nMomo — Movie\nStella — Motion\nArte — Motion\nNoire — Retro\nKino — Archive",
  accent = "#E3241B",
  film = "#0e0b0a",
  width = 1280,
  frameWidth = 220,
  frameHeight = 140,
  duration = 26,
}: {
  /** One image URL per line */
  images?: string;
  /** One caption per line (blank line = no bar on that frame) */
  captions?: string;
  /** Perforation + caption-bar color */
  accent?: string;
  /** Strip base color */
  film?: string;
  /** Strip width in px */
  width?: number;
  /** Still width in px */
  frameWidth?: number;
  /** Still height in px */
  frameHeight?: number;
  /** Seconds per loop */
  duration?: number;
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `fsm${uid}`;
  const imgs = images.split("\n").map((s) => s.trim()).filter(Boolean);
  const caps = captions.split("\n").map((s) => s.trim());
  const perf: React.CSSProperties = {
    height: 16,
    background: `repeating-linear-gradient(90deg, ${accent} 0 18px, ${film} 18px 34px)`,
  };
  const cells = imgs.map((src, i) => (
    <div key={i} style={{ flex: "0 0 auto", width: frameWidth, margin: "12px 6px" }}>
      <img
        src={src}
        alt=""
        style={{ display: "block", width: frameWidth, height: frameHeight, objectFit: "cover", borderRadius: 4 }}
      />
      {caps[i % caps.length] ? (
        <div
          style={{
            marginTop: 4,
            background: accent,
            color: film,
            fontFamily: "'Archivo', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 13,
            padding: "5px 10px",
            borderRadius: 4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {caps[i % caps.length]}
        </div>
      ) : null}
    </div>
  ));
  return (
    <div className={cls} style={{ width, overflow: "hidden", background: film }}>
      <style>{`
        @keyframes ${cls}-roll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .${cls}-track { display: flex; width: max-content; animation: ${cls}-roll ${duration}s linear infinite; }
        .${cls}:hover .${cls}-track { animation-play-state: paused; }
      `}</style>
      <div style={perf} />
      <div className={`${cls}-track`}>
        {cells}
        {imgs.map((src, i) => (
          <div key={`b${i}`} style={{ flex: "0 0 auto", width: frameWidth, margin: "12px 6px" }} aria-hidden>
            <img
              src={src}
              alt=""
              style={{ display: "block", width: frameWidth, height: frameHeight, objectFit: "cover", borderRadius: 4 }}
            />
            {caps[i % caps.length] ? (
              <div
                style={{
                  marginTop: 4,
                  background: accent,
                  color: film,
                  fontFamily: "'Archivo', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  padding: "5px 10px",
                  borderRadius: 4,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {caps[i % caps.length]}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div style={perf} />
    </div>
  );
};
