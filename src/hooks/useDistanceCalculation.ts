import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DistanceResult {
  distance_km: number | null;
  duration_minutes: number | null;
  distance_text?: string;
  duration_text?: string;
  error?: string;
}

export const useDistanceCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<DistanceResult | null>(null);

  const calculateDistance = useCallback(async (fromAddress: string, toAddress: string) => {
    if (!fromAddress || !toAddress) {
      setResult(null);
      return null;
    }

    setIsCalculating(true);
    try {
      const { data, error } = await supabase.functions.invoke('google-maps', {
        body: {
          action: 'distance',
          origins: fromAddress,
          destinations: toAddress,
        },
      });

      if (error) throw error;

      setResult(data);
      return data;
    } catch (error) {
      console.error('Distance calculation error:', error);
      const errorResult = { distance_km: null, duration_minutes: null, error: 'Kunde inte beräkna avstånd' };
      setResult(errorResult);
      return errorResult;
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return {
    calculateDistance,
    clearResult,
    isCalculating,
    result,
  };
};
