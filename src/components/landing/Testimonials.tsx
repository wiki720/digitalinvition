const reviews = [
  { q: "Such a beautiful and well-designed wedding webpage! Everything was easy to find and perfectly organized.", a: "Tasneem Barde" },
  { q: "The service you offer is just phenomenal. I've never seen a card this elegant and beautiful. Thank you for everything.", a: "Mohit Srivastava" },
  { q: "The scratch card feature was a hit among our friends. Beautiful experience.", a: "Ananya & Vikram" },
  { q: "Professional, elegant, and so much better than paper cards. Highly recommend!", a: "Emma & James" },
  { q: "We received so many compliments on our invitation. The music was a lovely touch.", a: "Meera & Rohit" },
];

export const Testimonials = () => (
  <section className="py-24 md:py-32 bg-gradient-emerald">
    <div className="container">
      <div className="text-center mb-16">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Loved by Couples</p>
        <h2 className="font-display text-4xl md:text-5xl">What Our Couples Say</h2>
        <div className="ornament-divider mt-6"><span className="text-gold">✦</span></div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.map((r) => (
          <figure
            key={r.a}
            className="p-7 rounded-lg border border-gold/15 bg-background/30 backdrop-blur hover:border-gold/40 transition-all"
          >
            <div className="text-gold text-2xl mb-3 font-display leading-none">"</div>
            <blockquote className="text-foreground/90 italic font-display text-lg leading-relaxed">
              {r.q}
            </blockquote>
            <figcaption className="mt-5 text-gold text-sm tracking-wide">— {r.a}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);
