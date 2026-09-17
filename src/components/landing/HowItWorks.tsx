const steps = [
  { n: "01", title: "Choose Your Design", desc: "Browse our premium, uniquely crafted collection" },
  { n: "02", title: "Share Your Details", desc: "Names, dates, venue, events and photos" },
  { n: "03", title: "We Personalise It", desc: "Your invitation, styled around your story" },
  { n: "04", title: "Share Your Invitation", desc: "One link — WhatsApp, email, anywhere" },
];

export const HowItWorks = () => (
  <section id="how" className="py-24 md:py-32">
    <div className="container">
      <div className="text-center mb-16">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Simple Process</p>
        <h2 className="font-display text-4xl md:text-6xl">How It Works</h2>
        <div className="ornament-divider mt-6"><span className="text-gold">✦</span></div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className="group relative p-8 rounded-lg border border-gold/15 bg-card/40 backdrop-blur hover:border-gold/40 hover:bg-card/60 transition-all hover:-translate-y-1"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="font-display text-6xl text-gradient-gold mb-4 leading-none">{s.n}</div>
            <h3 className="font-display text-2xl text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
