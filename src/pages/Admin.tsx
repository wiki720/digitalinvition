import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";

type Profile = { id: string; user_id: string; display_name: string | null; has_paid: boolean; created_at: string };
type Invitation = { id: string; slug: string; bride_name: string; groom_name: string; user_id: string; template_id: string; created_at: string; is_published: boolean };
type Payment = { id: string; user_id: string; amount: number; currency: string; status: string; razorpay_order_id: string; razorpay_payment_id: string | null; created_at: string };

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?next=/admin");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (adminLoading || authLoading) return;
    if (!user) return;
    if (!isAdmin) {
      toast.error("Admin access required");
      navigate("/dashboard");
    }
  }, [isAdmin, adminLoading, authLoading, user, navigate]);

  const loadAll = async () => {
    setLoading(true);
    const [p, i, pay] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("invitations").select("*").order("created_at", { ascending: false }),
      supabase.from("payments").select("*").order("created_at", { ascending: false }),
    ]);
    if (p.error) toast.error(p.error.message); else setProfiles(p.data || []);
    if (i.error) toast.error(i.error.message); else setInvitations(i.data || []);
    if (pay.error) toast.error(pay.error.message); else setPayments(pay.data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) loadAll();
  }, [isAdmin]);

  const togglePaid = async (p: Profile) => {
    const { error } = await supabase.from("profiles").update({ has_paid: !p.has_paid }).eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success(`Marked ${p.has_paid ? "unpaid" : "paid"}`);
    loadAll();
  };

  const deleteInvitation = async (id: string) => {
    if (!confirm("Delete this invitation? This cannot be undone.")) return;
    const { error } = await supabase.from("invitations").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    loadAll();
  };

  const refundPayment = async (id: string) => {
    if (!confirm("Mark this payment as refunded? (Razorpay refund must be processed manually in dashboard)")) return;
    const { error } = await supabase.from("payments").update({ status: "refunded" }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Marked refunded");
    loadAll();
  };

  if (authLoading || adminLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container py-16"><p className="text-muted-foreground">Checking access…</p></main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-12">
        <div className="mb-8">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">Administrator</p>
          <h1 className="font-display text-4xl md:text-5xl">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">Manage users, invitations, and payments.</p>
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users ({profiles.length})</TabsTrigger>
            <TabsTrigger value="invitations">Invitations ({invitations.length})</TabsTrigger>
            <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <div className="rounded-xl border border-gold/20 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-card/40 text-left">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">User ID</th>
                    <th className="p-3">Paid</th>
                    <th className="p-3">Joined</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p) => (
                    <tr key={p.id} className="border-t border-gold/10">
                      <td className="p-3">{p.display_name || "—"}</td>
                      <td className="p-3 text-xs text-muted-foreground font-mono">{p.user_id.slice(0, 8)}…</td>
                      <td className="p-3">
                        {p.has_paid
                          ? <span className="inline-flex items-center gap-1 text-emerald-400"><CheckCircle2 className="h-4 w-4" /> Paid</span>
                          : <span className="inline-flex items-center gap-1 text-muted-foreground"><XCircle className="h-4 w-4" /> No</span>}
                      </td>
                      <td className="p-3 text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="p-3 text-right">
                        <Button size="sm" variant="outline" onClick={() => togglePaid(p)}>
                          {p.has_paid ? "Mark unpaid" : "Mark paid"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="invitations" className="mt-6">
            <div className="rounded-xl border border-gold/20 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-card/40 text-left">
                  <tr>
                    <th className="p-3">Couple</th>
                    <th className="p-3">Slug</th>
                    <th className="p-3">Template</th>
                    <th className="p-3">Created</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((inv) => (
                    <tr key={inv.id} className="border-t border-gold/10">
                      <td className="p-3">{inv.bride_name} & {inv.groom_name}</td>
                      <td className="p-3 text-xs font-mono text-muted-foreground">/{inv.slug}</td>
                      <td className="p-3 text-xs">{inv.template_id}</td>
                      <td className="p-3 text-muted-foreground">{new Date(inv.created_at).toLocaleDateString()}</td>
                      <td className="p-3 text-right space-x-2">
                        <Button size="sm" variant="ghost" asChild>
                          <a href={`/i/${inv.slug}`} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /></a>
                        </Button>
                        <Button size="sm" variant="ghost" asChild>
                          <a href={`/edit/${inv.id}`}>Edit</a>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteInvitation(inv.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <div className="rounded-xl border border-gold/20 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-card/40 text-left">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((pay) => (
                    <tr key={pay.id} className="border-t border-gold/10">
                      <td className="p-3 text-xs font-mono">{pay.razorpay_order_id}</td>
                      <td className="p-3">₹{(pay.amount / 100).toFixed(2)}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full border ${
                          pay.status === "captured" ? "border-emerald-500/40 text-emerald-400" :
                          pay.status === "refunded" ? "border-orange-500/40 text-orange-400" :
                          pay.status === "failed" ? "border-destructive/40 text-destructive" :
                          "border-gold/20 text-muted-foreground"
                        }`}>{pay.status}</span>
                      </td>
                      <td className="p-3 text-muted-foreground">{new Date(pay.created_at).toLocaleDateString()}</td>
                      <td className="p-3 text-right">
                        {pay.status === "captured" && (
                          <Button size="sm" variant="outline" onClick={() => refundPayment(pay.id)}>Mark refunded</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {payments.length === 0 && <p className="p-6 text-center text-muted-foreground">No payments yet.</p>}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Admin;
