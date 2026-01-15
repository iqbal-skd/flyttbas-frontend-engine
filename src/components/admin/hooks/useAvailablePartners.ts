/**
 * useAvailablePartners - Hook for fetching available partners
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { PartnerSummary } from "../types";

interface UseAvailablePartnersOptions {
  enabled?: boolean;
  excludePartnerIds?: string[];
}

interface UseAvailablePartnersReturn {
  partners: PartnerSummary[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAvailablePartners({
  enabled = true,
  excludePartnerIds = [],
}: UseAvailablePartnersOptions = {}): UseAvailablePartnersReturn {
  const [partners, setPartners] = useState<PartnerSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPartners = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("partners")
        .select("id, company_name, status")
        .eq("status", "active")
        .order("company_name");

      if (excludePartnerIds.length > 0) {
        query = query.not("id", "in", `(${excludePartnerIds.join(",")})`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setPartners((data as PartnerSummary[]) || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Kunde inte hämta partners";
      setError(message);
      console.error("Error fetching partners:", err);
    } finally {
      setLoading(false);
    }
  }, [enabled, excludePartnerIds.join(",")]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  return {
    partners,
    loading,
    error,
    refetch: fetchPartners,
  };
}
