import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ornament from "@/assets/gold-ornament.png";

export const CTA = () => (
  <section className="py-24 md:py-32 relative overflow-hidden">
    <div className="absolute inset-0" style={{ background: "var(--gradient-radial-glow)" }} aria-hidden />
    <div className="container text-center relative">
      <img src={ornament} alt="" width={70} height={70} className="mx-auto mb-6 opacity-90" loading="lazy" />
      <h2 className="font-display text-4xl md:text-6xl max-w-3xl mx-auto leading-tight">
        Ready to Create Your <em className="text-gradient-gold not-italic">Perfect</em> Invitation?
      </h2>
      <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
        Join hundreds of couples who chose elegance for their special day.
      </p>
      <div className="mt-10">
        <Button variant="hero" size="xl" asChild>
          <Link to="/templates">Start Creating Your Invitation</Link>
        </Button>
      </div>
    </div>
  </section>
);
