import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { Plan } from "@/lib/templates";

export const usePaid = () => {
  const { user, loading: authLoading } = useAuth();
  const [hasPaid, setHasPaid] = useState<boolean | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);

    // Check global payments toggle first — when off, everyone has Royal access
    const { data: settings } = await supabase
      .from("app_settings")
      .select("payments_enabled")
      .limit(1)
      .maybeSingle();

    if (settings && settings.payments_enabled === false) {
      setHasPaid(true);
      setPlan("royal");
      setLoading(false);
      return;
    }

    if (!user) {
      setHasPaid(false);
      setPlan(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("has_paid, plan")
      .eq("user_id", user.id)
      .maybeSingle() as { data: { has_paid: boolean; plan: string | null } | null };
    setHasPaid(!!data?.has_paid);
    setPlan((data?.plan as Plan) || null);
    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, authLoading]);

  return { hasPaid, plan, loading: loading || authLoading, refresh };
};
