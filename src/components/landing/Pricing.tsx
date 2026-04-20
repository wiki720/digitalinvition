import { Button } from "@/components/ui/button";
import { Check, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSettings } from "@/hooks/useAppSettings";

const features = [
  "8 premium animated templates",
  "3D door & curtain reveal animations",
  "Up to 2 invitation links (5 edits each)",
  "Guest messaging & inbox",
  "Background music with 3 tracks",
  "Custom image uploads",
  "Google Maps integration",
  "Multi-language translation",
  "Analytics & page view tracking",
  "Lifetime access",
];

export const Pricing = () => {
  const { settings } = useAppSettings();
  const paymentsEnabled = settings?.payments_enabled !== false;
  const price = settings?.price_inr ?? 1499;

  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Simple Pricing</p>
          <h2 className="font-display text-4xl md:text-5xl">One Price, Everything Included</h2>
          <div className="ornament-divider mt-6"><span className="text-gold">✦</span></div>
        </div>

        <div className="relative rounded-2xl border-2 border-gold/40 bg-card/60 backdrop-blur p-10 md:p-14 shadow-deep animate-glow">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-gold text-gold-foreground text-xs font-semibold tracking-wider uppercase">
            {paymentsEnabled ? "Premium Plan" : "🎉 Free Access · Limited Offer"}
          </div>

          <div className="text-center mb-8">
            {paymentsEnabled ? (
              <>
                <div className="font-display text-7xl md:text-8xl text-gradient-gold leading-none">
                  ₹{price.toLocaleString("en-IN")}
                </div>
                <p className="text-sm text-muted-foreground mt-3 tracking-wide">
                  One-time payment · Lifetime access
                </p>
              </>
            ) : (
              <>
                <div className="font-display text-7xl md:text-8xl text-gradient-gold leading-none">
                  FREE
                </div>
                <p className="text-sm text-muted-foreground mt-3 tracking-wide line-through">
                  ₹{price.toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-gold mt-1 tracking-wide">
                  Limited-time launch offer
                </p>
              </>
            )}
          </div>

          <ul className="grid sm:grid-cols-2 gap-3 mb-10">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <Check className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <span className="text-foreground/90">{f}</span>
              </li>
            ))}
          </ul>

          <Button variant="gold" size="xl" className="w-full" asChild>
            <Link to="/checkout">
              {paymentsEnabled ? (
                `Get Lifetime Access · ₹${price.toLocaleString("en-IN")}`
              ) : (
                <><Gift className="mr-2 h-5 w-5" /> Claim Free Access</>
              )}
            </Link>
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-4">
            {paymentsEnabled
              ? "Secured by Razorpay · UPI, cards, netbanking, wallets"
              : "No payment required during this offer period"}
          </p>
        </div>
      </div>
    </section>
  );
};
