import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import ornament from "@/assets/gold-ornament.png";

export const Hero = () => (
  <section className="relative overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center opacity-25"
      style={{ backgroundImage: `url(${heroBg})` }}
      aria-hidden
    />
    <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" aria-hidden />
    <div className="absolute inset-0" style={{ background: "var(--gradient-radial-glow)" }} aria-hidden />

    <div className="container relative pt-20 pb-28 md:pt-32 md:pb-40 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs tracking-widest uppercase mb-8 animate-fade-up">
        ✦ Premium Digital Wedding Invitations ✦
      </div>

      <img
        src={ornament}
        alt=""
        width={80}
        height={80}
        className="mx-auto mb-6 opacity-90 animate-float"
      />

      <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight max-w-5xl mx-auto animate-fade-up">
        <span className="text-foreground">Wedding Invitations</span>
        <br />
        <span className="animate-shimmer-text italic">Crafted in Minutes</span>
      </h1>

      <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.15s" }}>
        Fill a simple form, get a stunning animated invitation webpage —
        share it with your guests instantly via WhatsApp, email, or any platform.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
        <Button variant="hero" size="xl" asChild>
          <Link to="/templates">Create My Invitation</Link>
        </Button>
        <Button variant="outline" size="xl" asChild>
          <Link to="/i/demo">View Live Demo</Link>
        </Button>
      </div>

      <p className="mt-8 text-xs text-muted-foreground tracking-wide animate-fade-up" style={{ animationDelay: "0.45s" }}>
        Trusted by hundreds of couples · One-time payment · No subscriptions
      </p>
    </div>
  </section>
);
