import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X, Users } from "lucide-react";

type Msg = {
  id: string;
  guest_name: string;
  message: string;
  attending: boolean | null;
  guest_count: number | null;
  created_at: string;
};

const Inbox = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [coupleNames, setCoupleNames] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user || !id) return;
    (async () => {
      const [{ data: invData }, { data: msgData, error }] = await Promise.all([
        supabase.from("invitations").select("bride_name, groom_name").eq("id", id).maybeSingle(),
        supabase.from("guest_messages").select("*").eq("invitation_id", id).order("created_at", { ascending: false }),
      ]);
      if (invData) setCoupleNames(`${invData.bride_name} & ${invData.groom_name}`);
      if (!error && msgData) setMsgs(msgData);
      setLoading(false);
    })();
  }, [user, id]);

  const attending = msgs.filter((m) => m.attending === true);
  const notAttending = msgs.filter((m) => m.attending === false);
  const totalGuests = attending.reduce((sum, m) => sum + (m.guest_count || 1), 0);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-12 max-w-4xl">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to="/dashboard"><ArrowLeft /> Back to Dashboard</Link>
        </Button>

        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">Guest Messages</p>
        <h1 className="font-display text-4xl mb-2">{coupleNames || "Inbox"}</h1>

        <div className="grid grid-cols-3 gap-3 my-8">
          <Stat icon={<Check />} label="Attending" value={attending.length} />
          <Stat icon={<X />} label="Declined" value={notAttending.length} />
          <Stat icon={<Users />} label="Total Guests" value={totalGuests} />
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : msgs.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gold/20 rounded-xl">
            <p className="text-muted-foreground">No messages yet. Share your invitation link to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {msgs.map((m) => (
              <div key={m.id} className="p-5 rounded-lg border border-gold/15 bg-card/40 backdrop-blur">
                <div className="flex justify-between items-start mb-2 gap-3">
                  <div>
                    <div className="font-display text-xl">{m.guest_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(m.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {m.attending ? (
                      <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full border border-gold/40 text-gold">
                        Attending · {m.guest_count}
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full border border-muted-foreground/30 text-muted-foreground">
                        Declined
                      </span>
                    )}
                  </div>
                </div>
                <p className="italic text-foreground/90 mt-2">"{m.message}"</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

const Stat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <div className="p-4 rounded-lg border border-gold/15 bg-card/40 text-center">
    <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gold/10 text-gold mb-2">
      {icon}
    </div>
    <div className="font-display text-3xl text-gradient-gold leading-none">{value}</div>
    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
  </div>
);

export default Inbox;
