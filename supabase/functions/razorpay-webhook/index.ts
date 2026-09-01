import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const RAZORPAY_WEBHOOK_SECRET = Deno.env.get("RAZORPAY_WEBHOOK_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) return new Response("Missing signature", { status: 400 });

    const raw = await req.text();
    const expected = await hmacSha256Hex(RAZORPAY_WEBHOOK_SECRET, raw);
    if (!timingSafeEqual(expected, signature)) {
      console.warn("Webhook signature mismatch");
      return new Response("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(raw);
    console.log("Webhook event:", event.event);

    if (event.event === "payment.captured") {
      const payment = event.payload?.payment?.entity;
      if (!payment) return new Response("ok", { status: 200 });

      const orderId: string = payment.order_id;
      const paymentId: string = payment.id;
      const userIdFromNotes: string | undefined = payment.notes?.user_id;

      const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      // Look up payment row to find user_id and plan
      const { data: payRow } = await admin
        .from("payments")
        .select("user_id, plan")
        .eq("razorpay_order_id", orderId)
        .maybeSingle();

      const userId = payRow?.user_id ?? userIdFromNotes;
      if (!userId) {
        console.warn("Webhook: no user_id for order", orderId);
        return new Response("ok", { status: 200 });
      }

      const plan = payRow?.plan === "royal" ? "royal" : "classic";

      // Idempotent updates
      await admin
        .from("payments")
        .update({ razorpay_payment_id: paymentId, status: "captured" })
        .eq("razorpay_order_id", orderId);

      await admin.from("profiles").update({ has_paid: true, plan }).eq("user_id", userId);
    } else if (event.event === "payment.failed") {
      const payment = event.payload?.payment?.entity;
      if (payment?.order_id) {
        const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        await admin
          .from("payments")
          .update({ status: "failed", razorpay_payment_id: payment.id })
          .eq("razorpay_order_id", payment.order_id);
      }
    }

    return new Response("ok", { status: 200 });
  } catch (e) {
    console.error("razorpay-webhook error:", e);
    return new Response("error", { status: 500 });
  }
});
