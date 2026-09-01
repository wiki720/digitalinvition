import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID")!;
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user from JWT
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Read requested plan (classic / royal)
    let plan: "classic" | "royal" = "classic";
    try {
      const body = await req.clone().json();
      if (body?.plan === "royal" || body?.plan === "classic") plan = body.plan;
    } catch {
      const url = new URL(req.url);
      const qp = url.searchParams.get("plan");
      if (qp === "royal" || qp === "classic") plan = qp;
    }

    // Read live app settings (prices + payments toggle)
    const { data: settings } = await admin
      .from("app_settings")
      .select("payments_enabled, classic_price_inr, royal_price_inr")
      .limit(1)
      .maybeSingle();

    // If admin disabled payments → grant full Royal access for free
    if (settings && settings.payments_enabled === false) {
      await admin.from("profiles").update({ has_paid: true, plan: "royal" }).eq("user_id", user.id);
      return new Response(
        JSON.stringify({ free_access: true, plan: "royal" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const priceInr = plan === "royal"
      ? (settings?.royal_price_inr ?? 1499)
      : (settings?.classic_price_inr ?? 1199);
    const amountPaise = priceInr * 100;

    // Create Razorpay order
    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    const receipt = `dinv_${user.id.slice(0, 8)}_${Date.now().toString(36)}`;
    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt,
        notes: { user_id: user.id, plan: `all_access_${priceInr}` },
      }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      console.error("Razorpay order error:", orderData);
      return new Response(JSON.stringify({ error: "Failed to create order", details: orderData }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: insertErr } = await admin.from("payments").insert({
      user_id: user.id,
      razorpay_order_id: orderData.id,
      amount: amountPaise,
      currency: "INR",
      status: "created",
      plan,
      notes: { user_id: user.id, plan },
    });
    if (insertErr) console.error("Insert payment error:", insertErr);

    return new Response(
      JSON.stringify({
        order_id: orderData.id,
        amount: amountPaise,
        currency: "INR",
        key_id: RAZORPAY_KEY_ID,
        plan,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("create-razorpay-order error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
