import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Heart } from "lucide-react";

export const SiteFooter = () => (
  <footer className="border-t border-gold/10 bg-background/50 mt-20">
    <div className="container py-12">
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            Zareqia crafts premium digital invitations for weddings and every
            celebration around them. One-time payment, lifetime access.
          </p>
        </div>
        <div>
          <h4 className="text-gold text-sm font-semibold mb-3 tracking-wider uppercase">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/templates" className="hover:text-gold">Designs</Link></li>
            <li><a href="/#pricing" className="hover:text-gold">Pricing</a></li>
            <li><a href="/#portfolio" className="hover:text-gold">Portfolio</a></li>
            <li><a href="/#faq" className="hover:text-gold">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gold text-sm font-semibold mb-3 tracking-wider uppercase">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-gold">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-gold">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-gold">Refund Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="ornament-divider my-8"><span className="text-gold/60 text-xs">✦</span></div>
      <p className="text-center text-xs text-muted-foreground">
        © 2026 Zareqia. Crafted with <Heart className="inline h-3 w-3 text-gold" /> for couples worldwide.
      </p>
    </div>
  </footer>
);
