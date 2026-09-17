import { Link } from "react-router-dom";
import { TEMPLATES } from "@/lib/templates";
import { Button } from "@/components/ui/button";

const categories = [
  "Wedding", "Engagement", "Save the Date", "Reception", "Mehendi",
  "Haldi", "Birthday", "Baby Shower", "Anniversary",
];

export const Collections = () => (
  <section id="collection" className="py-24 md:py-32">
    <div className="container">
      <div className="text-center mb-12">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">The Collection</p>
        <h2 className="font-display text-4xl md:text-6xl">Invitations for Every Occasion</h2>
        <div className="ornament-divider mt-6"><span className="text-gold">✦</span></div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-14">
        {categories.map((c) => (
          <span
            key={c}
            className="px-4 py-1.5 rounded-full border border-gold/20 bg-card/40 text-xs tracking-wide text-muted-foreground"
          >
            {c}
          </span>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEMPLATES.map((t) => (
          <Link
            key={t.id}
            to="/templates"
            className="group rounded-xl overflow-hidden border border-gold/15 bg-card/40 backdrop-blur transition-all hover:-translate-y-1.5 hover:border-gold/45 hover:shadow-gold"
          >
            <div
              className="aspect-[3/4] relative flex items-center justify-center"
              style={{ background: `hsl(${t.palette.bg})` }}
            >
              <div
                className="absolute inset-4 rounded-lg border"
                style={{ borderColor: `hsl(${t.palette.accent} / 0.5)` }}
              />
              <div className="relative text-center px-6">
                <p
                  className="text-[0.6rem] tracking-[0.35em] uppercase"
                  style={{ color: `hsl(${t.palette.accent})` }}
                >
                  {t.plan}
                </p>
                <p
                  className="font-script text-3xl mt-3"
                  style={{ color: `hsl(${t.palette.accentSoft})` }}
                >
                  {t.name}
                </p>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-display text-xl text-foreground">{t.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{t.tagline}</p>
              <span className="mt-4 inline-block text-xs tracking-[0.2em] uppercase text-gold group-hover:translate-x-1 transition-transform">
                View Design →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button variant="outline" size="lg" asChild>
          <Link to="/templates">Explore All Designs</Link>
        </Button>
      </div>
    </div>
  </section>
);
