import { Check, X } from "lucide-react";

const rows = [
  { f: "Cost", paper: "₹5,000–₹50,000+", digital: "₹1,499 one-time" },
  { f: "Delivery Time", paper: "2–4 weeks", digital: "Instant" },
  { f: "Interactive Features", paper: false, digital: true },
  { f: "Messaging & Inbox", paper: false, digital: true },
  { f: "Editable After Sending", paper: false, digital: true },
  { f: "Background Music", paper: false, digital: true },
  { f: "Google Maps Integration", paper: false, digital: true },
  { f: "Eco-Friendly", paper: false, digital: true },
  { f: "Shareable via Link", paper: false, digital: true },
];

const Cell = ({ v }: { v: string | boolean }) => {
  if (typeof v === "string") return <span className="text-sm">{v}</span>;
  return v ? <Check className="h-5 w-5 text-gold" /> : <X className="h-5 w-5 text-muted-foreground/50" />;
};

export const Comparison = () => (
  <section className="py-24 md:py-32">
    <div className="container max-w-4xl">
      <div className="text-center mb-12">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Why Go Digital?</p>
        <h2 className="font-display text-4xl md:text-5xl">Paper vs Digital Invitations</h2>
        <div className="ornament-divider mt-6"><span className="text-gold">✦</span></div>
      </div>

      <div className="rounded-lg border border-gold/20 overflow-hidden bg-card/40 backdrop-blur shadow-deep">
        <div className="grid grid-cols-3 px-6 py-4 border-b border-gold/15 bg-gold/5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Feature</div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground text-center">Paper</div>
          <div className="text-xs uppercase tracking-widest text-gold text-center font-semibold">Digital</div>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.f}
            className={`grid grid-cols-3 px-6 py-4 items-center ${i % 2 === 0 ? "bg-background/20" : ""}`}
          >
            <div className="font-display text-base">{r.f}</div>
            <div className="flex justify-center text-muted-foreground"><Cell v={r.paper} /></div>
            <div className="flex justify-center"><Cell v={r.digital} /></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
