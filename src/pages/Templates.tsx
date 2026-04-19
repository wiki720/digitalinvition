import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TEMPLATES } from "@/lib/templates";
import { TemplatePreview } from "@/components/TemplatePreview";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePaid } from "@/hooks/usePaid";

const badgeStyles: Record<string, string> = {
  "Limited Edition": "bg-gold/20 text-gold border-gold/40",
  "Most Liked": "bg-primary/20 text-gold border-gold/30",
  "New": "bg-background/50 text-gold-soft border-gold/30",
};

const Templates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasPaid } = usePaid();

  const select = (id: string) => {
    const next = `/create?template=${id}`;
    if (!user) {
      navigate(`/auth?next=${encodeURIComponent(next)}`);
    } else if (!hasPaid) {
      navigate(`/checkout?next=${encodeURIComponent(next)}`);
    } else {
      navigate(next);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-16 md:py-24">
        <div className="text-center mb-16">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Choose Your Design</p>
          <h1 className="font-display text-5xl md:text-6xl">Wedding Templates</h1>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            Select a template that speaks to your love story. All 8 premium designs are included with your purchase.
          </p>
          <div className="ornament-divider mt-6"><span className="text-gold">✦</span></div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {TEMPLATES.map((t) => (
            <article
              key={t.id}
              className="group relative rounded-xl border border-gold/15 bg-card/40 backdrop-blur p-4 hover:border-gold/40 hover:-translate-y-1 transition-all"
            >
              {t.badge && (
                <span className={`absolute top-2 right-2 z-10 px-2.5 py-1 text-[10px] tracking-widest uppercase rounded-full border ${badgeStyles[t.badge]}`}>
                  {t.badge}
                </span>
              )}

              <TemplatePreview template={t} />

              <div className="pt-4 px-1 pb-2">
                <h3 className="font-display text-xl">{t.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4 min-h-[2rem]">{t.tagline}</p>
                <Button variant="gold" size="sm" className="w-full" onClick={() => select(t.id)}>
                  Select Template
                </Button>
              </div>
            </article>
          ))}

          <article className="rounded-xl border border-dashed border-gold/20 bg-card/20 p-4 flex flex-col items-center justify-center text-center min-h-[420px]">
            <div className="font-script text-5xl text-gold/50 mb-3">More</div>
            <p className="text-sm text-muted-foreground">Coming Soon</p>
            <p className="text-xs text-muted-foreground/70 mt-1">New designs on the way</p>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Templates;
