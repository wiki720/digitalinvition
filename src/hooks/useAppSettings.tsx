import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppSettings = {
  id: string;
  payments_enabled: boolean;
  price_inr: number;
  classic_price_inr: number;
  royal_price_inr: number;
};

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("app_settings")
      .select("id, payments_enabled, price_inr, classic_price_inr, royal_price_inr")
      .limit(1)
      .maybeSingle() as { data: AppSettings | null };
    setSettings(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return { settings, loading, refresh };
};
