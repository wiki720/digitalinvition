import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const usePaid = () => {
  const { user, loading: authLoading } = useAuth();
  const [hasPaid, setHasPaid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);

    // Check global payments toggle first — when off, everyone has access
    const { data: settings } = await supabase
      .from("app_settings")
      .select("payments_enabled")
      .limit(1)
      .maybeSingle();

    if (settings && settings.payments_enabled === false) {
      setHasPaid(true);
      setLoading(false);
      return;
    }

    if (!user) {
      setHasPaid(false);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("has_paid")
      .eq("user_id", user.id)
      .maybeSingle();
    setHasPaid(!!data?.has_paid);
    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, authLoading]);

  return { hasPaid, loading: loading || authLoading, refresh };
};
