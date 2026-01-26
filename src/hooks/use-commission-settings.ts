import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { COMMISSION, type CommissionType } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

interface CommissionValue {
  rate: number;
  type: CommissionType;
}

interface CommissionSettings {
  systemRate: number;
  systemType: CommissionType;
  loading: boolean;
  error: string | null;
}

interface UseCommissionSettingsReturn extends CommissionSettings {
  updateSystemSettings: (rate: number, type: CommissionType) => Promise<boolean>;
  getPartnerRate: (partnerId: string, partnerOverride: number | null, partnerTypeOverride: CommissionType | null) => CommissionValue;
  updatePartnerSettings: (partnerId: string, rate: number | null, type: CommissionType | null) => Promise<boolean>;
  refetch: () => Promise<void>;
}

// Simple in-memory cache
let cachedSettings: CommissionValue | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 60000; // 1 minute

function parseCommissionValue(value: unknown): CommissionValue {
  // Handle new JSON format: { rate: number, type: string }
  if (value && typeof value === "object" && "rate" in value) {
    const obj = value as { rate?: number; type?: string };
    return {
      rate: typeof obj.rate === "number" ? obj.rate : COMMISSION.DEFAULT_RATE,
      type: (obj.type === "percentage" || obj.type === "fixed") ? obj.type : COMMISSION.DEFAULT_TYPE,
    };
  }
  // Handle legacy numeric format
  if (typeof value === "number") {
    return { rate: value, type: "percentage" };
  }
  // Handle string number
  if (typeof value === "string" && !isNaN(parseFloat(value))) {
    return { rate: parseFloat(value), type: "percentage" };
  }
  // Default
  return { rate: COMMISSION.DEFAULT_RATE, type: COMMISSION.DEFAULT_TYPE };
}

export function useCommissionSettings(): UseCommissionSettingsReturn {
  const { toast } = useToast();
  const [systemRate, setSystemRate] = useState<number>(
    cachedSettings?.rate ?? COMMISSION.DEFAULT_RATE
  );
  const [systemType, setSystemType] = useState<CommissionType>(
    cachedSettings?.type ?? COMMISSION.DEFAULT_TYPE
  );
  const [loading, setLoading] = useState<boolean>(cachedSettings === null);
  const [error, setError] = useState<string | null>(null);

  const fetchSystemSettings = useCallback(async () => {
    // Use cache if valid
    if (cachedSettings !== null && Date.now() - cacheTimestamp < CACHE_TTL) {
      setSystemRate(cachedSettings.rate);
      setSystemType(cachedSettings.type);
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

      const parsed = data ? parseCommissionValue(data.value) : { rate: COMMISSION.DEFAULT_RATE, type: COMMISSION.DEFAULT_TYPE };

      cachedSettings = parsed;
      cacheTimestamp = Date.now();
      setSystemRate(parsed.rate);
      setSystemType(parsed.type);
      setError(null);
    } catch (err) {
      console.error("Error fetching system commission settings:", err);
      setError("Kunde inte hämta provisionsinställningar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSystemSettings();
  }, [fetchSystemSettings]);

  const updateSystemSettings = useCallback(
    async (rate: number, type: CommissionType): Promise<boolean> => {
      const maxValue = type === "fixed" ? COMMISSION.MAX_FIXED : COMMISSION.MAX_RATE;
      if (rate < COMMISSION.MIN_RATE || rate > maxValue) {
        toast({
          variant: "destructive",
          title: "Ogiltigt värde",
          description: type === "fixed"
            ? `Beloppet måste vara mellan ${COMMISSION.MIN_RATE} och ${COMMISSION.MAX_FIXED} SEK.`
            : `Provisionssatsen måste vara mellan ${COMMISSION.MIN_RATE} och ${COMMISSION.MAX_RATE}%.`,
        });
        return false;
      }

      try {
        const newValue = { rate, type };
        const { error: upsertError } = await supabase
          .from("system_settings")
          .upsert(
            {
              key: COMMISSION.SETTINGS_KEY,
              value: newValue,
              description: "Default commission rate/amount for all partners",
            },
            { onConflict: "key" }
          );

        if (upsertError) throw upsertError;

        // Update cache
        cachedSettings = newValue;
        cacheTimestamp = Date.now();
        setSystemRate(rate);
        setSystemType(type);

        toast({
          title: "Sparat",
          description: type === "fixed"
            ? `Systemprovisionen har uppdaterats till ${rate} SEK.`
            : `Systemprovisionssatsen har uppdaterats till ${rate}%.`,
        });

        return true;
      } catch (err) {
        console.error("Error saving system commission settings:", err);
        toast({
          variant: "destructive",
          title: "Fel",
          description: "Kunde inte spara provisionsinställningarna.",
        });
        return false;
      }
    },
    [toast]
  );

  const getPartnerRate = useCallback(
    (partnerId: string, partnerOverride: number | null, partnerTypeOverride: CommissionType | null): CommissionValue => {
      return {
        rate: partnerOverride ?? systemRate,
        type: partnerTypeOverride ?? systemType,
      };
    },
    [systemRate, systemType]
  );

  const updatePartnerSettings = useCallback(
    async (partnerId: string, rate: number | null, type: CommissionType | null): Promise<boolean> => {
      if (rate !== null) {
        const effectiveType = type ?? systemType;
        const maxValue = effectiveType === "fixed" ? COMMISSION.MAX_FIXED : COMMISSION.MAX_RATE;
        if (rate < COMMISSION.MIN_RATE || rate > maxValue) {
          toast({
            variant: "destructive",
            title: "Ogiltigt värde",
            description: effectiveType === "fixed"
              ? `Beloppet måste vara mellan ${COMMISSION.MIN_RATE} och ${COMMISSION.MAX_FIXED} SEK.`
              : `Provisionssatsen måste vara mellan ${COMMISSION.MIN_RATE} och ${COMMISSION.MAX_RATE}%.`,
          });
          return false;
        }
      }

      try {
        const { error: updateError } = await supabase
          .from("partners")
          .update({ 
            commission_rate_override: rate,
            commission_type_override: type,
          })
          .eq("id", partnerId);

        if (updateError) throw updateError;

        toast({
          title: "Sparat",
          description: rate !== null
            ? type === "fixed"
              ? `Provisionen har uppdaterats till ${rate} SEK.`
              : `Provisionssatsen har uppdaterats till ${rate}%.`
            : "Anpassad provision borttagen. Systemstandarden används.",
        });

        return true;
      } catch (err) {
        console.error("Error saving partner commission settings:", err);
        toast({
          variant: "destructive",
          title: "Fel",
          description: "Kunde inte spara provisionsinställningarna.",
        });
        return false;
      }
    },
    [toast, systemType]
  );

  const refetch = useCallback(async () => {
    cachedSettings = null; // Invalidate cache
    setLoading(true);
    await fetchSystemSettings();
  }, [fetchSystemSettings]);

  return {
    systemRate,
    systemType,
    loading,
    error,
    updateSystemSettings,
    getPartnerRate,
    updatePartnerSettings,
    refetch,
  };
}
