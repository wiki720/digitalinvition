import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, MessageSquare, Pencil } from "lucide-react";
import { toast } from "sonner";

type Invitation = {
  id: string;
  slug: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  template_id: string;
  created_at: string;
};

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?next=/dashboard");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("invitations")
        .select("id, slug, bride_name, groom_name, wedding_date, template_id, created_at")
        .order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      else setInvitations(data || []);
      setLoading(false);
    })();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-16">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-10">
          <div>
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">Your Invitations</p>
            <h1 className="font-display text-4xl md:text-5xl">Dashboard</h1>
          </div>
          <Button variant="gold" asChild>
            <Link to="/templates"><Plus /> New Invitation</Link>
          </Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : invitations.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gold/20 rounded-xl">
            <p className="font-display text-2xl mb-3">No invitations yet</p>
            <p className="text-muted-foreground mb-6">Pick a template to create your first invitation.</p>
            <Button variant="gold" asChild>
              <Link to="/templates">Browse Templates</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {invitations.map((inv) => (
              <div key={inv.id} className="p-6 rounded-xl border border-gold/20 bg-card/40 backdrop-blur hover:border-gold/40 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-display text-2xl">{inv.bride_name} <span className="font-script text-xl text-gold">&</span> {inv.groom_name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(inv.wedding_date).toLocaleDateString(undefined, { dateStyle: "long" })}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full border border-gold/20 text-gold-soft">
                    {inv.template_id}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-4 break-all">/{inv.slug}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/i/${inv.slug}`} target="_blank"><ExternalLink /> View</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/edit/${inv.id}`}><Pencil /> Edit</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/inbox/${inv.id}`}><MessageSquare /> Inbox</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default Dashboard;
