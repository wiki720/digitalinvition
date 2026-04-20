import { useState } from "react";

type Props = {
  brideName: string;
  groomName: string;
  bg: string;
  fg: string;
  accent: string;
  accentSoft: string;
  onOpen: () => void;
};

/** Ornamental wall pattern for the closed doors (SVG, scales with door). */
const WallPattern = ({ color }: { color: string }) => (
  <svg
    className="absolute inset-0 h-full w-full opacity-30 pointer-events-none"
    viewBox="0 0 200 600"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden
  >
    <defs>
      <pattern id="damask" x="0" y="0" width="60" height="80" patternUnits="userSpaceOnUse">
        <path
          d="M30 8 Q44 20 30 36 Q16 20 30 8 Z M30 44 Q44 56 30 72 Q16 56 30 44 Z"
          fill="none"
          stroke={color}
          strokeWidth="0.7"
        />
        <circle cx="30" cy="22" r="1.2" fill={color} />
        <circle cx="30" cy="58" r="1.2" fill={color} />
      </pattern>
    </defs>
    <rect width="200" height="600" fill="url(#damask)" />
    {/* arch top */}
    <path d="M10 80 Q100 -10 190 80 L190 20 L10 20 Z" fill={color} opacity="0.15" />
    {/* central medallion */}
    <g transform="translate(100 300)">
      <circle r="40" fill="none" stroke={color} strokeWidth="1.2" />
      <circle r="28" fill="none" stroke={color} strokeWidth="0.8" />
      <path
        d="M0 -32 Q12 -12 32 0 Q12 12 0 32 Q-12 12 -32 0 Q-12 -12 0 -32 Z"
        fill="none"
        stroke={color}
        strokeWidth="0.8"
      />
      <circle r="4" fill={color} />
    </g>
    {/* door knob area */}
  </svg>
);

export const DoorReveal = ({ brideName, groomName, bg, fg, accent, accentSoft, onOpen }: Props) => {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    setOpening(true);
    setTimeout(onOpen, 1400); // allow door animation to play
  };

  return (
    <div
      className="fixed inset-0 z-[60] overflow-hidden"
      style={{ background: bg, color: fg }}
    >
      {/* Wall behind doors (visible once doors swing open) */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: `radial-gradient(circle at 50% 40%, ${accent}30, ${bg} 70%)` }}
      >
        <div className="text-center px-8 animate-fade-in">
          <div className="text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: accentSoft }}>
            Welcome
          </div>
          <div className="font-script text-4xl md:text-6xl" style={{ color: accent }}>
            {brideName} & {groomName}
          </div>
        </div>
      </div>

      {/* LEFT DOOR */}
      <div
        className="absolute top-0 left-0 h-full w-1/2 origin-left transition-transform duration-[1400ms] ease-[cubic-bezier(0.7,0,0.3,1)] shadow-2xl"
        style={{
          transform: opening ? "perspective(1400px) rotateY(-105deg)" : "perspective(1400px) rotateY(0deg)",
          background: `linear-gradient(110deg, hsl(0 0% 6%) 0%, ${accent} 60%, hsl(0 0% 8%) 100%)`,
          borderRight: `2px solid ${accent}`,
        }}
      >
        <WallPattern color={fg} />
        {/* Door frame */}
        <div
          className="absolute inset-3 rounded-tl-[120px] border"
          style={{ borderColor: `${fg}55` }}
        />
        {/* Knob */}
        <div
          className="absolute top-1/2 right-3 h-3 w-3 rounded-full -translate-y-1/2"
          style={{ background: fg, boxShadow: `0 0 12px ${fg}` }}
        />
        {/* Couple initial */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-script text-7xl md:text-9xl opacity-90"
          style={{ color: fg }}
        >
          {brideName?.[0] ?? "B"}
        </div>
      </div>

      {/* RIGHT DOOR */}
      <div
        className="absolute top-0 right-0 h-full w-1/2 origin-right transition-transform duration-[1400ms] ease-[cubic-bezier(0.7,0,0.3,1)] shadow-2xl"
        style={{
          transform: opening ? "perspective(1400px) rotateY(105deg)" : "perspective(1400px) rotateY(0deg)",
          background: `linear-gradient(250deg, hsl(0 0% 6%) 0%, ${accent} 60%, hsl(0 0% 8%) 100%)`,
          borderLeft: `2px solid ${accent}`,
        }}
      >
        <WallPattern color={fg} />
        <div
          className="absolute inset-3 rounded-tr-[120px] border"
          style={{ borderColor: `${fg}55` }}
        />
        <div
          className="absolute top-1/2 left-3 h-3 w-3 rounded-full -translate-y-1/2"
          style={{ background: fg, boxShadow: `0 0 12px ${fg}` }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-script text-7xl md:text-9xl opacity-90"
          style={{ color: fg }}
        >
          {groomName?.[0] ?? "G"}
        </div>
      </div>

      {/* Center seam — names + open button (sits in front of doors) */}
      {!opening && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          <div
            className="rounded-full px-6 py-2 mb-5 border backdrop-blur-sm pointer-events-auto"
            style={{ borderColor: accentSoft, color: accentSoft, background: `${bg}80` }}
          >
            <span className="text-[10px] tracking-[0.4em] uppercase">The Wedding of</span>
          </div>
          <div className="font-script text-5xl md:text-7xl drop-shadow-lg" style={{ color: fg }}>
            {brideName}
          </div>
          <div className="font-display italic text-xl my-2 opacity-90">&</div>
          <div className="font-script text-5xl md:text-7xl mb-8 drop-shadow-lg" style={{ color: fg }}>
            {groomName}
          </div>
          <button
            onClick={handleOpen}
            className="pointer-events-auto px-8 py-4 rounded-md border-2 font-semibold tracking-wider uppercase text-xs transition-all hover:scale-105 backdrop-blur"
            style={{ borderColor: fg, color: fg, background: `${accent}40` }}
          >
            ✦ Open the Doors ✦
          </button>
        </div>
      )}
    </div>
  );
};
