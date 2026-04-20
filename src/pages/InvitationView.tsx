import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getTemplate } from "@/lib/templates";
import { Countdown } from "@/components/Countdown";
import { ScratchToReveal } from "@/components/ScratchToReveal";
import { RsvpForm } from "@/components/RsvpForm";
import { ShareButtons } from "@/components/ShareButtons";
import { Volume2, VolumeX, MapPin } from "lucide-react";

type Invitation = {
  id: string;
  slug: string;
  template_id: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  venue_name: string;
  venue_address: string;
  venue_map_url: string | null;
  dress_code: string | null;
  message: string | null;
  hero_image_url: string | null;
};

const InvitationView = () => {
  const { slug } = useParams();
  const [inv, setInv] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!slug) return;
    if (slug === "demo") {
      setInv({
        id: "demo",
        slug: "demo",
        template_id: "emerald-noir",
        bride_name: "Aarav",
        groom_name: "Priya",
        wedding_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
        venue_name: "The Royal Palace Banquet",
        venue_address: "Grand Boulevard, Mumbai, India",
        venue_map_url: "https://maps.google.com",
        dress_code: "Traditional Indian",
        message: "Together with our families, we joyfully invite you to celebrate the beginning of our forever.",
        hero_image_url: null,
      });
      setLoading(false);
      return;
    }
    (async () => {
      const { data } = await supabase.from("invitations").select("*").eq("slug", slug).maybeSingle();
      setInv(data as Invitation | null);
      setLoading(false);
    })();
  }, [slug]);

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !muted;
    if (muted) audioRef.current.play().catch(() => {});
    setMuted(!muted);
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading…</div>;
  }
  if (!inv) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Invitation not found</div>;
  }

  const tpl = getTemplate(inv.template_id);
  const bg = `hsl(${tpl.palette.bg})`;
  const fg = `hsl(${tpl.palette.fg})`;
  const accent = `hsl(${tpl.palette.accent})`;
  const accentSoft = `hsl(${tpl.palette.accentSoft})`;

  // Doors closed splash screen
  if (!doorsOpen) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: bg, color: fg }}
      >
        <div className="absolute inset-0 grid grid-cols-2">
          <div className="border-r" style={{ borderColor: accent, background: `linear-gradient(135deg, ${accent}, hsl(0 0% 5%))` }} />
          <div style={{ background: `linear-gradient(225deg, ${accent}, hsl(0 0% 5%))` }} />
        </div>
        <div className="relative text-center z-10 p-8">
          <div className="text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: accentSoft }}>The Wedding of</div>
          <div className="font-script text-5xl md:text-7xl mb-2" style={{ color: fg }}>{inv.bride_name}</div>
          <div className="font-display italic text-xl my-2 opacity-80">&</div>
          <div className="font-script text-5xl md:text-7xl mb-8" style={{ color: fg }}>{inv.groom_name}</div>
          <button
            onClick={() => setDoorsOpen(true)}
            className="px-8 py-4 rounded-md border-2 font-semibold tracking-wider uppercase text-xs transition-all hover:scale-105"
            style={{ borderColor: fg, color: fg }}
          >
            ✦ Open Invitation ✦
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ background: bg, color: fg }}>
      {/* Background music (silent placeholder — user can replace via storage in v2) */}
      <audio ref={audioRef} loop muted src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3" />
      <button
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full border flex items-center justify-center backdrop-blur"
        style={{ borderColor: accent, color: accent, background: `${bg}cc` }}
        aria-label="Toggle music"
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>

      {/* Hero with door reveal animation */}
      <section className="relative min-h-screen flex items-center justify-center p-8 overflow-hidden">
        {inv.hero_image_url && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${inv.hero_image_url})` }}
          />
        )}
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 50%, ${accent}20, transparent 70%)` }} />

        <div className="relative text-center max-w-2xl animate-fade-up">
          <div className="text-xs tracking-[0.4em] uppercase mb-6 opacity-70" style={{ color: accentSoft }}>
            Together with our families
          </div>
          <div className="font-script text-6xl md:text-8xl leading-none animate-fade-up" style={{ color: accent }}>
            {inv.bride_name}
          </div>
          <div className="font-display italic text-2xl my-4 opacity-80">and</div>
          <div className="font-script text-6xl md:text-8xl leading-none animate-fade-up" style={{ color: accent }}>
            {inv.groom_name}
          </div>
          <div className="ornament-divider mt-8"><span style={{ color: accent }}>✦</span></div>
          <p className="mt-6 text-lg italic font-display opacity-90 max-w-lg mx-auto">
            {inv.message || "joyfully invite you to celebrate our wedding."}
          </p>
        </div>
      </section>

      {/* Save the Date — Scratch */}
      <section className="py-20 px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: accentSoft }}>A Special Date Awaits</div>
          <h2 className="font-display text-3xl md:text-4xl mb-8">Reveal the Date</h2>
          <ScratchToReveal date={inv.wedding_date} accent={accent} fg={fg} />
        </div>
      </section>

      {/* Countdown */}
      <section className="py-20 px-8" style={{ background: `${accent}08` }}>
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: accentSoft }}>Counting Down</div>
          <h2 className="font-display text-3xl md:text-4xl mb-10">Until We Say "I Do"</h2>
          <Countdown targetDate={inv.wedding_date} accent={accent} />
        </div>
      </section>

      {/* Venue */}
      <section className="py-20 px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: accentSoft }}>The Celebration</div>
          <h2 className="font-display text-3xl md:text-4xl mb-3">{inv.venue_name}</h2>
          <p className="opacity-80 mb-2">{inv.venue_address}</p>
          {inv.dress_code && (
            <p className="text-sm opacity-70 mt-3">
              <span className="uppercase tracking-widest text-xs" style={{ color: accentSoft }}>Dress Code · </span>
              {inv.dress_code}
            </p>
          )}
          {inv.venue_map_url && (
            <a
              href={inv.venue_map_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-md border text-sm transition-all hover:scale-105"
              style={{ borderColor: accent, color: accent }}
            >
              <MapPin className="h-4 w-4" /> Open in Maps
            </a>
          )}
        </div>
      </section>

      {/* RSVP */}
      {inv.id !== "demo" && (
        <section className="py-20 px-8" style={{ background: `${accent}08` }}>
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: accentSoft }}>RSVP</div>
              <h2 className="font-display text-3xl md:text-4xl">Send Your Wishes</h2>
            </div>
            <RsvpForm invitationId={inv.id} accent={accent} fg={fg} />
          </div>
        </section>
      )}

      {/* Share */}
      {inv.id !== "demo" && (
        <section className="py-16 px-8">
          <div className="max-w-xl mx-auto">
            <ShareButtons
              url={typeof window !== "undefined" ? window.location.href : ""}
              title={`${inv.bride_name} & ${inv.groom_name} — Wedding Invitation`}
              accent={accent}
              fg={fg}
            />
          </div>
        </section>
      )}

      <footer className="py-10 text-center text-xs opacity-60">
        Made with ✦ on Digital Invition
      </footer>
    </div>
  );
};

export default InvitationView;
