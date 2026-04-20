import { useEffect, useRef, useState } from "react";

type Props = {
  date: string;
  accent: string;
  fg: string;
};

/**
 * Real scratch-card: user drags finger/mouse over a canvas overlay.
 * Reveal only triggers when ~60% of the surface is scratched away.
 */
export const ScratchToReveal = ({ date, accent, fg }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const isDrawing = useRef(false);

  const d = new Date(date);
  const weekday = d.toLocaleDateString(undefined, { weekday: "long" });
  const day = d.toLocaleDateString(undefined, { day: "numeric" });
  const month = d.toLocaleDateString(undefined, { month: "long" });
  const year = d.toLocaleDateString(undefined, { year: "numeric" });
  const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  // Paint the scratch overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      // Glittery gradient overlay
      const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      grad.addColorStop(0, accent);
      grad.addColorStop(0.5, "hsl(0 0% 15%)");
      grad.addColorStop(1, accent);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Sparkle dots
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 1.5 + 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Center hint text
      ctx.fillStyle = fg;
      ctx.font = "600 14px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✦  Scratch to reveal  ✦", rect.width / 2, rect.height / 2);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [accent, fg]);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const scratch = (x: number, y: number) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();
  };

  const checkReveal = () => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Sample a low-res grid for performance
    const step = 16;
    const w = canvas.width;
    const h = canvas.height;
    let cleared = 0;
    let total = 0;
    const data = ctx.getImageData(0, 0, w, h).data;
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const idx = (y * w + x) * 4 + 3;
        if (data[idx] === 0) cleared++;
        total++;
      }
    }
    if (cleared / total > 0.55) {
      setRevealed(true);
    }
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    canvasRef.current?.setPointerCapture(e.pointerId);
    const p = getPos(e);
    scratch(p.x, p.y);
  };
  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const p = getPos(e);
    scratch(p.x, p.y);
  };
  const onUp = () => {
    isDrawing.current = false;
    checkReveal();
  };

  return (
    <div
      ref={wrapRef}
      className="relative w-full max-w-md mx-auto aspect-[2/1] select-none rounded-2xl overflow-hidden shadow-2xl"
      style={{ background: `${accent}10`, border: `1px solid ${accent}66` }}
    >
      {/* Revealed content underneath */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        style={{ color: fg }}
      >
        <div className="text-[10px] tracking-[0.4em] uppercase opacity-60 mb-2">You're invited</div>
        <div className="font-script text-3xl md:text-4xl leading-none" style={{ color: accent }}>
          {weekday}
        </div>
        <div className="font-display text-2xl md:text-3xl mt-2 tracking-wide">
          {day} {month} {year}
        </div>
        <div className="mt-2 text-sm opacity-80 tracking-widest uppercase">{time}</div>
      </div>

      {/* Scratch overlay (canvas) */}
      {!revealed && (
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
        />
      )}
    </div>
  );
};
