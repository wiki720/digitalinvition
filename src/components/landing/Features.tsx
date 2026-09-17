import { Sparkles, Clock, MessageSquareHeart, Music2, MapPin, Wand2, Image, Settings2 } from "lucide-react";

const features = [
  { icon: Wand2, title: "Bespoke Designs", desc: "Originally crafted layouts, never templated clip-art" },
  { icon: Sparkles, title: "Beautiful Animations", desc: "3D door reveals, scratch cards, curtains & sparkles" },
  { icon: MessageSquareHeart, title: "RSVP Management", desc: "Guest replies, attendance counts and a private inbox" },
  { icon: Music2, title: "Background Music", desc: "Set the mood with an elegant mute toggle" },
  { icon: MapPin, title: "Event Details & Maps", desc: "Every function with venue and Google Maps directions" },
  { icon: Clock, title: "Live Countdown", desc: "An animated countdown to your special day" },
  { icon: Image, title: "Your Photographs", desc: "Upload a gallery and hero imagery of your own" },
  { icon: Settings2, title: "Mobile-First", desc: "Flawless on every phone, ready for WhatsApp sharing" },
];

export const Features = () => (
  <section id="features" className="py-24 md:py-32 bg-gradient-emerald">
    <div className="container">
      <div className="text-center mb-16">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Why Zareqia</p>
        <h2 className="font-display text-4xl md:text-6xl">Designed Around Your Story</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Everything your celebration needs, wrapped in a design your guests will remember.
        </p>
        <div className="ornament-divider mt-6"><span className="text-gold">✦</span></div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((f) => (
          <div
            key={f.title}
            className="group p-6 rounded-lg border border-gold/15 bg-background/40 backdrop-blur-sm hover:border-gold/50 transition-all hover:-translate-y-1 hover:shadow-gold"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-gold/10 border border-gold/30 text-gold mb-4 group-hover:bg-gold group-hover:text-gold-foreground transition-all">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl mb-2 text-foreground">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
