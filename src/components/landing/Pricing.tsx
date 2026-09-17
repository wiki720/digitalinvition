import { Button } from "@/components/ui/button";
import { Check, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSettings } from "@/hooks/useAppSettings";

const classicFeatures = [
  "Access to all Classic designs",
  "Event details & schedule",
  "Live countdown",
  "Google Maps directions",
  "WhatsApp & social sharing",
  "Up to 2 invitation links",
  "Lifetime access",
];

const royalFeatures = [
  "Everything in Classic",
  "All Royal signature designs",
  "3D door & curtain reveals",
  "Photo gallery & background music",
  "RSVP inbox & guest messaging",
  "Multi-language translation",
  "Analytics & view tracking",
  "Priority support",
];

export const Pricing = () => {
  const { settings } = useAppSettings();
  const paymentsEnabled = settings?.payments_enabled !== false;
  const classic = settings?.classic_price_inr ?? 1199;
  const royal = settings?.royal_price_inr ?? 1499;

  const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="container max-w-5xl">
        <div className="text-center mb-14">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Simple Pricing</p>
          <h2 className="font-display text-4xl md:text-5xl">One-Time Payment, Lifetime Access</h2>
          <div className="ornament-divider mt-6"><span className="text-gold">✦</span></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Classic */}
          <div className="rounded-2xl border border-gold/20 bg-card/50 backdrop-blur p-8 md:p-10">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Classic</p>
            <div className="mt-4 font-display text-6xl text-foreground leading-none">
              {paymentsEnabled ? money(classic) : "FREE"}
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              {paymentsEnabled ? "One-time · Lifetime access" : `Usually ${money(classic)} · limited offer`}
            </p>
            <ul className="mt-8 space-y-3 mb-9">
              {classicFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <span className="text-foreground/90">{f}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link to="/checkout">Get Classic</Link>
            </Button>
          </div>

          {/* Royal */}
          <div className="relative rounded-2xl border-2 border-gold/45 bg-card/70 backdrop-blur p-8 md:p-10 shadow-deep animate-glow">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-gold text-gold-foreground text-xs font-semibold tracking-wider uppercase whitespace-nowrap">
              {paymentsEnabled ? "Most Loved" : "🎉 Free Access · Limited Offer"}
            </div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold">Royal</p>
            <div className="mt-4 font-display text-6xl text-gradient-gold leading-none">
              {paymentsEnabled ? money(royal) : "FREE"}
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              {paymentsEnabled ? "One-time · Lifetime access" : `Usually ${money(royal)} · limited offer`}
            </p>
            <ul className="mt-8 space-y-3 mb-9">
              {royalFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <span className="text-foreground/90">{f}</span>
                </li>
              ))}
            </ul>
            <Button variant="gold" size="lg" className="w-full" asChild>
              <Link to="/checkout">
                {paymentsEnabled ? `Get Royal · ${money(royal)}` : <><Gift className="mr-2 h-5 w-5" /> Claim Free Access</>}
              </Link>
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {paymentsEnabled
            ? "Secured by Razorpay · UPI, cards, netbanking, wallets"
            : "No payment required during this offer period"}
        </p>
      </div>
    </section>
  );
};
