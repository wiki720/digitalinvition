import { WeddingTemplate } from "@/lib/templates";

/** Stylized inline SVG/CSS preview that adapts to each template's palette. */
export const TemplatePreview = ({ template }: { template: WeddingTemplate }) => {
  const { palette } = template;
  const bg = `hsl(${palette.bg})`;
  const fg = `hsl(${palette.fg})`;
  const accent = `hsl(${palette.accent})`;
  const accentSoft = `hsl(${palette.accentSoft})`;

  return (
    <div
      className="aspect-[3/4] w-full rounded-md overflow-hidden relative flex flex-col items-center justify-center text-center p-6"
      style={{ background: bg, color: fg }}
    >
      {/* Ornamental corners */}
      <Corner pos="tl" color={accent} pattern={template.pattern} />
      <Corner pos="tr" color={accent} pattern={template.pattern} />
      <Corner pos="bl" color={accent} pattern={template.pattern} />
      <Corner pos="br" color={accent} pattern={template.pattern} />

      <div className="text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: accentSoft }}>
        We're getting married
      </div>

      <div className="font-script text-3xl md:text-4xl leading-none" style={{ color: accent }}>
        Aarav
      </div>
      <div className="font-display italic text-sm my-2 opacity-70">&</div>
      <div className="font-script text-3xl md:text-4xl leading-none" style={{ color: accent }}>
        Priya
      </div>

      <div className="mt-5 h-px w-16" style={{ background: accent, opacity: 0.6 }} />

      <div className="mt-4 text-[10px] tracking-widest uppercase opacity-80">
        12 · 12 · 2026
      </div>
    </div>
  );
};

const Corner = ({ pos, color, pattern }: { pos: "tl" | "tr" | "bl" | "br"; color: string; pattern: string }) => {
  const positions: Record<string, string> = {
    tl: "top-2 left-2",
    tr: "top-2 right-2 rotate-90",
    bl: "bottom-2 left-2 -rotate-90",
    br: "bottom-2 right-2 rotate-180",
  };
  return (
    <svg
      className={`absolute h-10 w-10 ${positions[pos]}`}
      viewBox="0 0 40 40"
      fill="none"
      stroke={color}
      strokeWidth="0.8"
      aria-hidden
    >
      {pattern === "celestial" ? (
        <>
          <circle cx="6" cy="6" r="2" fill={color} />
          <path d="M2 12 L12 12 L12 2" />
          <circle cx="18" cy="4" r="0.8" fill={color} />
          <circle cx="4" cy="18" r="0.8" fill={color} />
        </>
      ) : pattern === "minimal" ? (
        <path d="M2 14 L2 2 L14 2" />
      ) : (
        <>
          <path d="M2 16 Q2 2 16 2" />
          <path d="M2 10 Q2 6 6 6" />
          <circle cx="6" cy="6" r="1.5" fill={color} />
          <path d="M10 2 Q14 2 14 6 Q14 10 10 10" />
          <path d="M2 14 Q6 14 6 10" />
        </>
      )}
    </svg>
  );
};
