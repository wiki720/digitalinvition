import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { usePaid } from "@/hooks/usePaid";
import { useAppSettings } from "@/hooks/useAppSettings";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Check, Loader2, ShieldCheck, Gift } from "lucide-react";
import { toast } from "sonner";

const features = [
  "8 premium animated templates",
  "3D door & curtain reveal animations",
  "Up to 2 invitation links (5 edits each)",
  "Guest messaging & inbox",
  "Background music with 3 tracks",
  "Custom image uploads",
  "Google Maps integration",
  "Multi-language translation",
  "Analytics & page view tracking",
  "Lifetime access",
];

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

const Checkout = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/templates";
  const { user, loading: authLoading } = useAuth();
  const { hasPaid, loading: paidLoading, refresh } = usePaid();
  const { settings, loading: settingsLoading } = useAppSettings();
  const [processing, setProcessing] = useState(false);

  const paymentsEnabled = settings?.payments_enabled !== false;
  const price = settings?.price_inr ?? 1499;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/auth?next=/checkout${next ? `?next=${encodeURIComponent(next)}` : ""}`);
    }
  }, [user, authLoading, navigate, next]);

  useEffect(() => {
    if (!paidLoading && hasPaid) {
      toast.success("You already have lifetime access");
      navigate(next);
    }
  }, [hasPaid, paidLoading, navigate, next]);

  const startPayment = async () => {
    if (!user) return;
    setProcessing(true);
    try {
      // Free-mode shortcut: admin disabled payments
      if (!paymentsEnabled) {
        const { data, error } = await supabase.functions.invoke("create-razorpay-order");
        if (error) throw error;
        if (data?.free_access) {
          toast.success("Free access unlocked — enjoy!");
          await refresh();
          navigate(next);
          return;
        }
      }

      const ok = await loadRazorpay();
      if (!ok) throw new Error("Could not load Razorpay. Check your connection.");

      const { data, error } = await supabase.functions.invoke("create-razorpay-order");
      if (error || (!data?.order_id && !data?.free_access)) {
        throw new Error(error?.message || "Failed to create order");
      }

      if (data.free_access) {
        toast.success("Free access unlocked — enjoy!");
        await refresh();
        navigate(next);
        return;
      }

      const rzp = new window.Razorpay({
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        order_id: data.order_id,
        name: "Zareqia",
        description: "Lifetime All-Access · 8 premium templates",
        prefill: { email: user.email ?? "" },
        theme: { color: "#0F3D2E" },
        handler: async (resp: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const { error: vErr } = await supabase.functions.invoke(
              "verify-razorpay-payment",
              { body: resp },
            );
            if (vErr) throw vErr;
            toast.success("Payment successful — welcome to Zareqia!");
            await refresh();
            navigate(next);
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Verification failed");
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      });
      rzp.open();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Payment failed to start");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-16 max-w-2xl">
        <div className="text-center mb-10">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Checkout</p>
          <h1 className="font-display text-4xl md:text-5xl">Unlock Lifetime Access</h1>
          <div className="ornament-divider mt-6"><span className="text-gold">✦</span></div>
        </div>

        <div className="relative rounded-2xl border-2 border-gold/40 bg-card/60 backdrop-blur p-8 md:p-12 shadow-deep animate-glow">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-gold text-gold-foreground text-xs font-semibold tracking-wider uppercase">
            {paymentsEnabled ? "Premium Plan" : "🎉 Free Access · Limited Offer"}
          </div>

          <div className="text-center mb-8">
            {paymentsEnabled ? (
              <>
                <div className="font-display text-7xl md:text-8xl text-gradient-gold leading-none">
                  ₹{price.toLocaleString("en-IN")}
                </div>
                <p className="text-sm text-muted-foreground mt-3 tracking-wide">
                  One-time payment · Lifetime access
                </p>
              </>
            ) : (
              <>
                <div className="font-display text-6xl md:text-7xl text-gradient-gold leading-none">
                  FREE
                </div>
                <p className="text-sm text-muted-foreground mt-3 tracking-wide line-through">
                  ₹{price.toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-gold mt-1 tracking-wide">
                  Limited-time offer · Full lifetime access at no cost
                </p>
              </>
            )}
          </div>

          <ul className="grid sm:grid-cols-2 gap-3 mb-10">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <Check className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <span className="text-foreground/90">{f}</span>
              </li>
            ))}
          </ul>

          <Button
            variant="gold"
            size="xl"
            className="w-full"
            onClick={startPayment}
            disabled={processing || paidLoading || settingsLoading}
          >
            {processing ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {paymentsEnabled ? "Opening secure checkout…" : "Unlocking access…"}</>
            ) : paymentsEnabled ? (
              `Pay ₹${price.toLocaleString("en-IN")} securely`
            ) : (
              <><Gift className="mr-2 h-5 w-5" /> Claim free lifetime access</>
            )}
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground mt-4">
            <ShieldCheck className="h-3.5 w-3.5 text-gold" />
            {paymentsEnabled
              ? "Secured by Razorpay · UPI, cards, netbanking, wallets"
              : "No payment required during this offer period"}
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Checkout;
