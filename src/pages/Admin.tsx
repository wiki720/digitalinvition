import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, CheckCircle2, XCircle, ExternalLink, Gift, IndianRupee, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

type Profile = { id: string; user_id: string; display_name: string | null; has_paid: boolean; created_at: string };
type Invitation = { id: string; slug: string; bride_name: string; groom_name: string; user_id: string; template_id: string; created_at: string; is_published: boolean };
type Payment = { id: string; user_id: string; amount: number; currency: string; status: string; razorpay_order_id: string; razorpay_payment_id: string | null; created_at: string };
type Settings = { id: string; payments_enabled: boolean; price_inr: number };

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [priceInput, setPriceInput] = useState<string>("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [, setLoading] = useState(true);

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
    const [p, i, pay, s] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("invitations").select("*").order("created_at", { ascending: false }),
      supabase.from("payments").select("*").order("created_at", { ascending: false }),
      supabase.from("app_settings").select("id, payments_enabled, price_inr").limit(1).maybeSingle(),
    ]);
    if (p.error) toast.error(p.error.message); else setProfiles(p.data || []);
    if (i.error) toast.error(i.error.message); else setInvitations(i.data || []);
    if (pay.error) toast.error(pay.error.message); else setPayments(pay.data || []);
    if (s.data) {
      setSettings(s.data as Settings);
      setPriceInput(String(s.data.price_inr));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) loadAll();
  }, [isAdmin]);

  const togglePayments = async (enabled: boolean) => {
    if (!settings) return;
    setSavingSettings(true);
    const { error } = await supabase
      .from("app_settings")
      .update({ payments_enabled: enabled })
      .eq("id", settings.id);
    setSavingSettings(false);
    if (error) return toast.error(error.message);
    setSettings({ ...settings, payments_enabled: enabled });
    toast.success(enabled ? "Payments enabled — users will be charged" : "Payments OFF — all users get free access");
  };

  const savePrice = async () => {
    if (!settings) return;
    const n = parseInt(priceInput, 10);
    if (Number.isNaN(n) || n < 1 || n > 100000) {
      return toast.error("Enter a price between ₹1 and ₹100,000");
    }
    setSavingSettings(true);
    const { error } = await supabase
      .from("app_settings")
      .update({ price_inr: n })
      .eq("id", settings.id);
    setSavingSettings(false);
    if (error) return toast.error(error.message);
    setSettings({ ...settings, price_inr: n });
    toast.success(`Price updated to ₹${n.toLocaleString("en-IN")}`);
  };

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

  const paymentsOn = settings?.payments_enabled !== false;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-12">
        <div className="mb-8">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">Administrator</p>
          <h1 className="font-display text-4xl md:text-5xl">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">Manage users, invitations, payments, and pricing.</p>
        </div>

        <Tabs defaultValue="settings">
          <TabsList>
            <TabsTrigger value="settings">Payment Settings</TabsTrigger>
            <TabsTrigger value="users">Users ({profiles.length})</TabsTrigger>
            <TabsTrigger value="invitations">Invitations ({invitations.length})</TabsTrigger>
            <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Payments toggle */}
              <div className="rounded-xl border-2 border-gold/30 bg-card/40 backdrop-blur p-6 shadow-deep">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${paymentsOn ? "bg-gold/10 text-gold" : "bg-emerald-500/10 text-emerald-400"}`}>
                    {paymentsOn ? <IndianRupee className="h-6 w-6" /> : <Gift className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl">Payments</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {paymentsOn
                        ? "Users are charged the price below to unlock access."
                        : "Offer mode: ALL users get free lifetime access. No charge."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-background/40 border border-gold/10">
                  <div>
                    <Label htmlFor="payments-toggle" className="text-base font-medium">
                      {paymentsOn ? "Payments are ON" : "Payments are OFF (free for everyone)"}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Toggle off to run a free-access promotion.
                    </p>
                  </div>
                  <Switch
                    id="payments-toggle"
                    checked={paymentsOn}
                    onCheckedChange={togglePayments}
                    disabled={savingSettings || !settings}
                  />
                </div>

                {!paymentsOn && (
                  <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                    🎉 Free-access offer is live. New signups will skip checkout and get instant access.
                  </div>
                )}
              </div>

              {/* Custom price */}
              <div className="rounded-xl border-2 border-gold/30 bg-card/40 backdrop-blur p-6 shadow-deep">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                    <IndianRupee className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl">Custom Price</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Set the lifetime-access price (in INR). Applies to checkout & landing page instantly.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="price-input">Price in ₹</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        id="price-input"
                        type="number"
                        min={1}
                        max={100000}
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        className="pl-7 text-lg font-display"
                        placeholder="1499"
                      />
                    </div>
                    <Button
                      onClick={savePrice}
                      disabled={savingSettings || !settings || priceInput === String(settings?.price_inr)}
                      variant="gold"
                    >
                      {savingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-1.5" /> Save</>}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current: <span className="text-gold font-medium">₹{settings?.price_inr.toLocaleString("en-IN") ?? "—"}</span>
                    {" · "}Suggested: ₹499 / ₹999 / ₹1,499 / ₹2,499
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

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
