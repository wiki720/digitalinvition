import { useEffect, useState } from "react";

export const Countdown = ({ targetDate, accent }: { targetDate: string; accent: string }) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, new Date(targetDate).getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  const Item = ({ n, label }: { n: number; label: string }) => (
    <div className="text-center">
      <div
        className="font-display text-4xl md:text-5xl tabular-nums leading-none"
        style={{ color: accent }}
      >
        {String(n).padStart(2, "0")}
      </div>
      <div className="text-[10px] tracking-widest uppercase opacity-70 mt-1">{label}</div>
    </div>
  );

  return (
    <div className="flex justify-center gap-6 md:gap-10">
      <Item n={days} label="Days" />
      <Item n={hours} label="Hours" />
      <Item n={mins} label="Mins" />
      <Item n={secs} label="Secs" />
    </div>
  );
};
