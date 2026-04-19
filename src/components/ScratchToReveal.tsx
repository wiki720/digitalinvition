import { useState } from "react";

export const ScratchToReveal = ({
  date,
  accent,
  fg,
}: {
  date: string;
  accent: string;
  fg: string;
}) => {
  const [revealed, setRevealed] = useState(false);
  const formatted = new Date(date).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[2/1] select-none">
      <div
        className="absolute inset-0 rounded-lg flex flex-col items-center justify-center border-2"
        style={{ borderColor: accent, color: fg, background: `${accent}10` }}
      >
        <div className="text-[10px] tracking-[0.3em] uppercase opacity-60 mb-2">Save the date</div>
        <div className="font-display text-2xl md:text-3xl text-center px-4" style={{ color: accent }}>
          {formatted}
        </div>
      </div>
      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="absolute inset-0 rounded-lg flex items-center justify-center cursor-pointer transition-opacity hover:opacity-90"
          style={{
            background: `linear-gradient(135deg, ${accent}, hsl(0 0% 20%))`,
            color: fg,
          }}
        >
          <span className="font-display text-xl tracking-wider">✦ Tap to reveal ✦</span>
        </button>
      )}
    </div>
  );
};
