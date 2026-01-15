import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { COMMISSION } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

interface CommissionSettings {
  systemRate: number;
  loading: boolean;
  error: string | null;
}

interface UseCommissionSettingsReturn extends CommissionSettings {
  updateSystemRate: (rate: number) => Promise<boolean>;
  getPartnerRate: (partnerId: string, partnerOverride: number | null) => number;
  updatePartnerRate: (partnerId: string, rate: number | null) => Promise<boolean>;
  refetch: () => Promise<void>;
}

// Simple in-memory cache for system rate
let cachedSystemRate: number | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 60000; // 1 minute

export function useCommissionSettings(): UseCommissionSettingsReturn {
  const { toast } = useToast();
  const [systemRate, setSystemRate] = useState<number>(
    cachedSystemRate ?? COMMISSION.DEFAULT_RATE
  );
  const [loading, setLoading] = useState<boolean>(cachedSystemRate === null);
  const [error, setError] = useState<string | null>(null);

  const fetchSystemRate = useCallback(async () => {
    // Use cache if valid
    if (cachedSystemRate !== null && Date.now() - cacheTimestamp < CACHE_TTL) {
      setSystemRate(cachedSystemRate);
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from("system_settings")
        .select("value")
        .eq("key", COMMISSION.SETTINGS_KEY)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      const rate = data
        ? typeof data.value === "number"
          ? data.value
          : parseFloat(String(data.value))
        : COMMISSION.DEFAULT_RATE;

      cachedSystemRate = rate;
      cacheTimestamp = Date.now();
      setSystemRate(rate);
      setError(null);
    } catch (err) {
      console.error("Error fetching system commission rate:", err);
      setError("Kunde inte hämta provisionssats");
      // Keep using default or cached value
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSystemRate();
  }, [fetchSystemRate]);

  const updateSystemRate = useCallback(
    async (rate: number): Promise<boolean> => {
      if (rate < COMMISSION.MIN_RATE || rate > COMMISSION.MAX_RATE) {
        toast({
          variant: "destructive",
          title: "Ogiltigt värde",
          description: `Provisionssatsen måste vara mellan ${COMMISSION.MIN_RATE} och ${COMMISSION.MAX_RATE}.`,
        });
        return false;
      }

      try {
        const { error: upsertError } = await supabase
          .from("system_settings")
          .upsert(
            {
              key: COMMISSION.SETTINGS_KEY,
              value: rate,
              description: "Default commission rate percentage for all partners",
            },
            { onConflict: "key" }
          );

        if (upsertError) throw upsertError;

        // Update cache
        cachedSystemRate = rate;
        cacheTimestamp = Date.now();
        setSystemRate(rate);

        toast({
          title: "Sparat",
          description: `Systemprovisionssatsen har uppdaterats till ${rate}%.`,
        });

        return true;
      } catch (err) {
        console.error("Error saving system commission rate:", err);
        toast({
          variant: "destructive",
          title: "Fel",
          description: "Kunde inte spara provisionssatsen.",
        });
        return false;
      }
    },
    [toast]
  );

  const getPartnerRate = useCallback(
    (partnerId: string, partnerOverride: number | null): number => {
      return partnerOverride ?? systemRate;
    },
    [systemRate]
  );

  const updatePartnerRate = useCallback(
    async (partnerId: string, rate: number | null): Promise<boolean> => {
      if (rate !== null && (rate < COMMISSION.MIN_RATE || rate > COMMISSION.MAX_RATE)) {
        toast({
          variant: "destructive",
          title: "Ogiltigt värde",
          description: `Provisionssatsen måste vara mellan ${COMMISSION.MIN_RATE} och ${COMMISSION.MAX_RATE}.`,
        });
        return false;
      }

      try {
        const { error: updateError } = await supabase
          .from("partners")
          .update({ commission_rate_override: rate })
          .eq("id", partnerId);

        if (updateError) throw updateError;

        toast({
          title: "Sparat",
          description:
            rate !== null
              ? `Provisionssatsen har uppdaterats till ${rate}%.`
              : "Anpassad provisionssats borttagen. Systemstandarden används.",
        });

        return true;
      } catch (err) {
        console.error("Error saving partner commission rate:", err);
        toast({
          variant: "destructive",
          title: "Fel",
          description: "Kunde inte spara provisionssatsen.",
        });
        return false;
      }
    },
    [toast]
  );

  const refetch = useCallback(async () => {
    cachedSystemRate = null; // Invalidate cache
    setLoading(true);
    await fetchSystemRate();
  }, [fetchSystemRate]);

  return {
    systemRate,
    loading,
    error,
    updateSystemRate,
    getPartnerRate,
    updatePartnerRate,
    refetch,
  };
}
