import { Sparkles, Clock, MessageSquareHeart, Music2, MapPin, Wand2, Image, Settings2 } from "lucide-react";

const features = [
  { icon: Sparkles, title: "Scratch to Reveal Date", desc: "Interactive scratch card reveals the wedding date with a delightful surprise" },
  { icon: Clock, title: "Live Countdown", desc: "Animated countdown timer to your special day" },
  { icon: MessageSquareHeart, title: "Guest Messaging & Inbox", desc: "Receive messages, attendance confirmations & guest counts" },
  { icon: Music2, title: "Background Music", desc: "Romantic instrumentals with elegant mute toggle" },
  { icon: MapPin, title: "Venue with Maps", desc: "Embedded Google Maps for seamless directions" },
  { icon: Wand2, title: "Premium Animations", desc: "3D door reveals, curtains, sparkles & more" },
  { icon: Image, title: "Custom Image Upload", desc: "Upload slideshow photos & hero background images" },
  { icon: Settings2, title: "Full Customization", desc: "Toggle sections, dress codes, events & more" },
];

export const Features = () => (
  <section id="features" className="py-24 md:py-32 bg-gradient-emerald">
    <div className="container">
      <div className="text-center mb-16">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Everything You Need</p>
        <h2 className="font-display text-4xl md:text-6xl">Premium Features</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Every invitation comes packed with interactive features that make your wedding announcement unforgettable.
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
