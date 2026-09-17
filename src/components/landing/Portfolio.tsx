const styles = [
  { name: "Royal Indian", desc: "Mughal arches, deep jewel tones, ornate gold" },
  { name: "Minimal Luxury", desc: "Quiet typography, generous space, soft foil" },
  { name: "Floral", desc: "Hand-drawn botanicals in blush and ivory" },
  { name: "Traditional", desc: "Timeless motifs with classic red and gold" },
  { name: "Contemporary", desc: "Clean grids with modern editorial styling" },
  { name: "Pastel", desc: "Powder tones with delicate line detailing" },
  { name: "South Indian", desc: "Temple borders, kanjivaram-inspired palettes" },
  { name: "Hindu Wedding", desc: "Sacred symbols with warm festive colours" },
  { name: "Muslim Wedding", desc: "Geometric latticework with crescent accents" },
];

export const Portfolio = () => (
  <section id="portfolio" className="py-24 md:py-32 bg-gradient-emerald">
    <div className="container">
      <div className="text-center mb-16">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Portfolio</p>
        <h2 className="font-display text-4xl md:text-6xl">Styles We Craft</h2>
        <div className="ornament-divider mt-6"><span className="text-gold">✦</span></div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {styles.map((s, i) => (
          <article
            key={s.name}
            className="group relative overflow-hidden rounded-xl border border-gold/15 bg-background/40 p-8 min-h-[190px] flex flex-col justify-end transition-all hover:border-gold/45 hover:-translate-y-1"
          >
            <span className="absolute top-6 right-7 font-display text-5xl text-gold/10 group-hover:text-gold/25 transition-colors">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-2xl text-foreground">{s.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);
