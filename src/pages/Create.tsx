import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { usePaid } from "@/hooks/usePaid";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TEMPLATES, getTemplate, canUseTemplate } from "@/lib/templates";
import { TemplatePreview } from "@/components/TemplatePreview";
import { toast } from "sonner";
import type { Plan } from "@/lib/templates";

const EVENT_TYPES = [
  "Wedding",
  "Engagement",
  "Wedding & Reception",
  "Reception Only",
  "Birthday",
  "Opening Ceremony",
  "Anniversary",
  "Housewarming",
  "Party",
  "Baby Shower",
  "Custom",
];

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40) +
  "-" +
  Math.random().toString(36).slice(2, 7);

const Create = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const initialTemplate = params.get("template") || "emerald-noir";
  const { user, loading: authLoading } = useAuth();
  const { hasPaid, plan: userPlan, loading: paidLoading } = usePaid();
  const navigate = useNavigate();

  const [templateId, setTemplateId] = useState(initialTemplate);
  const [eventType, setEventType] = useState("Wedding");
  const [bride, setBride] = useState("");
  const [groom, setGroom] = useState("");
  const [date, setDate] = useState("");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [venueMap, setVenueMap] = useState("");
  const [dressCode, setDressCode] = useState("");
  const [message, setMessage] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    const nextPath = id ? `/edit/${id}` : `/create?template=${templateId}`;
    if (!user) {
      navigate(`/auth?next=${encodeURIComponent(nextPath)}`);
      return;
    }
    if (!paidLoading && hasPaid === false) {
      navigate(`/checkout?next=${encodeURIComponent(nextPath)}`);
    }
  }, [user, authLoading, hasPaid, paidLoading, navigate, templateId, id]);

  useEffect(() => {
    if (!id || !user) return;
    (async () => {
      const { data, error } = await supabase.from("invitations").select("*").eq("id", id).maybeSingle() as {
        data: Record<string, any> | null;
        error: any;
      };
      if (error || !data) {
        toast.error("Invitation not found");
        navigate("/dashboard");
        return;
      }
      setTemplateId(data.template_id);
      setEventType(data.event_type || "Wedding");
      setBride(data.bride_name);
      setGroom(data.groom_name);
      setDate(new Date(data.wedding_date).toISOString().slice(0, 16));
      setVenueName(data.venue_name);
      setVenueAddress(data.venue_address);
      setVenueMap(data.venue_map_url || "");
      setDressCode(data.dress_code || "");
      setMessage(data.message || "");
      setHeroImage(data.hero_image_url || "");
    })();
  }, [id, user, navigate]);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("invitation-images").upload(path, file);
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("invitation-images").getPublicUrl(path);
    setHeroImage(data.publicUrl);
    toast.success("Image uploaded");
  };

  const tpl = getTemplate(templateId);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // If selected template requires Royal and user only has Classic, upsell
    if (!canUseTemplate(templateId, userPlan)) {
      const next = id ? `/edit/${id}` : `/create?template=${templateId}`;
      navigate(`/checkout?next=${encodeURIComponent(next)}&plan=royal`);
      return;
    }

    setSubmitting(true);
    const payload = {
      user_id: user.id,
      template_id: templateId,
      event_type: eventType,
      bride_name: bride,
      groom_name: groom,
      wedding_date: new Date(date).toISOString(),
      venue_name: venueName,
      venue_address: venueAddress,
      venue_map_url: venueMap || null,
      dress_code: dressCode || null,
      message: message || null,
      hero_image_url: heroImage || null,
    };
    try {
      const table = supabase.from("invitations") as any;
      if (id) {
        const { error } = await table.update(payload).eq("id", id);
        if (error) throw error;
        toast.success("Invitation updated");
        navigate("/dashboard");
      } else {
        const slug = slugify(`${bride}-${groom}`);
        const { data, error } = await table
          .insert({ ...payload, slug })
          .select()
          .single();
        if (error) throw error;
        toast.success("Invitation created!");
        navigate(`/i/${data.slug}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  const primaryLabel = eventType === "Wedding" || eventType === "Wedding & Reception" || eventType === "Engagement"
    ? "Bride's / Partner 1 Name"
    : eventType === "Birthday" || eventType === "Baby Shower"
      ? "Honoree's Name"
      : "Host / Partner 1 Name";
  const secondaryLabel = eventType === "Wedding" || eventType === "Wedding & Reception" || eventType === "Engagement"
    ? "Groom's / Partner 2 Name"
    : "Co-host / Partner 2 Name (optional)";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-12 max-w-6xl">
        <div className="text-center mb-10">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">{id ? "Edit" : "Create"}</p>
          <h1 className="font-display text-4xl md:text-5xl">Your Invitation Details</h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <form onSubmit={submit} className="bg-card/40 backdrop-blur rounded-xl border border-gold/20 p-7 space-y-5">
            <div>
              <Label>Event Type</Label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="mt-1.5 w-full h-10 rounded-md border border-input bg-input px-3 text-sm"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Template</Label>
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="mt-1.5 w-full h-10 rounded-md border border-input bg-input px-3 text-sm"
              >
                {TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} · {t.plan === "royal" ? "Royal" : "Classic"}</option>
                ))}
              </select>
              {!canUseTemplate(templateId, userPlan) && (
                <p className="text-xs text-gold mt-2">
                  This template is part of the Royal plan. You’ll be asked to upgrade before saving.
                </p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bride">{primaryLabel}</Label>
                <Input id="bride" value={bride} onChange={(e) => setBride(e.target.value)} required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="groom">{secondaryLabel}</Label>
                <Input id="groom" value={groom} onChange={(e) => setGroom(e.target.value)} className="mt-1.5" />
              </div>
            </div>

            <div>
              <Label htmlFor="date">Event Date & Time</Label>
              <Input id="date" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1.5" />
            </div>

            <div>
              <Label htmlFor="venue">Venue Name</Label>
              <Input id="venue" value={venueName} onChange={(e) => setVenueName(e.target.value)} required className="mt-1.5" />
            </div>

            <div>
              <Label htmlFor="addr">Venue Address</Label>
              <Textarea id="addr" value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} required className="mt-1.5" rows={2} />
            </div>

            <div>
              <Label htmlFor="map">Google Maps Link (optional)</Label>
              <Input id="map" value={venueMap} onChange={(e) => setVenueMap(e.target.value)} placeholder="https://maps.google.com/..." className="mt-1.5" />
            </div>

            <div>
              <Label htmlFor="dress">Dress Code (optional)</Label>
              <Input id="dress" value={dressCode} onChange={(e) => setDressCode(e.target.value)} placeholder="Traditional / Black tie" className="mt-1.5" />
            </div>

            <div>
              <Label htmlFor="msg">Personal Message (optional)</Label>
              <Textarea id="msg" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="mt-1.5" placeholder="A word from the hosts to your guests…" />
            </div>

            <div>
              <Label htmlFor="img">Hero Image (optional)</Label>
              <Input id="img" type="file" accept="image/*" onChange={handleImage} className="mt-1.5" />
              {heroImage && <img src={heroImage} alt="" className="mt-3 rounded-md max-h-40 object-cover" />}
            </div>

            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Saving…" : id ? "Save Changes" : "Create My Invitation"}
            </Button>
          </form>

          <aside className="lg:sticky lg:top-24 h-fit">
            <p className="text-xs text-muted-foreground mb-3 tracking-widest uppercase">Live Style Preview</p>
            <TemplatePreview template={tpl} />
            <p className="text-center text-xs text-muted-foreground mt-3">{tpl.name}</p>
            <p className="text-center text-[10px] uppercase tracking-wider text-gold mt-1">{tpl.plan} plan</p>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Create;
