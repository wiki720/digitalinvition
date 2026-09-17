import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const items = [
  "Couple or host names",
  "Event date & live countdown",
  "Venue with Google Maps",
  "Multiple events & schedule",
  "Photo gallery & slideshow",
  "Background music",
  "RSVP & guest messages",
  "Custom colours & wording",
];

export const Personalization = () => (
  <section className="py-24 md:py-32">
    <div className="container grid lg:grid-cols-2 gap-14 items-center">
      <div>
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Personalisation</p>
        <h2 className="font-display text-4xl md:text-6xl leading-tight">
          Made For You,<br />
          <em className="text-gradient-gold not-italic">Not For Everyone.</em>
        </h2>
        <p className="mt-5 text-muted-foreground max-w-md">
          Every Zareqia invitation is shaped around your story — your names, your
          rituals, your colours. Nothing generic, nothing borrowed.
        </p>
        <div className="mt-9">
          <Button variant="hero" size="xl" asChild>
            <Link to="/templates">Create My Invitation</Link>
          </Button>
        </div>
      </div>

      <ul className="grid sm:grid-cols-2 gap-3">
        {items.map((i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-lg border border-gold/15 bg-card/40 p-4 text-sm"
          >
            <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <span className="text-foreground/90">{i}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
