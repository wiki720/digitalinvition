import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

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

export const Pricing = () => (
  <section id="pricing" className="py-24 md:py-32">
    <div className="container max-w-3xl">
      <div className="text-center mb-12">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Simple Pricing</p>
        <h2 className="font-display text-4xl md:text-5xl">One Price, Everything Included</h2>
        <div className="ornament-divider mt-6"><span className="text-gold">✦</span></div>
      </div>

      <div className="relative rounded-2xl border-2 border-gold/40 bg-card/60 backdrop-blur p-10 md:p-14 shadow-deep animate-glow">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-gold text-gold-foreground text-xs font-semibold tracking-wider uppercase">
          Premium Plan
        </div>

        <div className="text-center mb-8">
          <div className="font-display text-7xl md:text-8xl text-gradient-gold leading-none">₹1,499</div>
          <p className="text-sm text-muted-foreground mt-3 tracking-wide">One-time payment · Lifetime access</p>
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
          <Link to="/checkout">Get Lifetime Access · ₹1,499</Link>
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-4">
          Secured by Razorpay · UPI, cards, netbanking, wallets
        </p>
      </div>
    </div>
  </section>
);
