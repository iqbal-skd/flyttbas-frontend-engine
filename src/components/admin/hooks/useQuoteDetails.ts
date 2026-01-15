/**
 * useQuoteDetails - Hook for fetching and managing single quote
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { QuoteRequest, QuoteStatus } from "../types";

interface UseQuoteDetailsOptions {
  quoteId: string | null;
  enabled?: boolean;
}

interface UseQuoteDetailsReturn {
  quote: QuoteRequest | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateQuote: (updates: Partial<QuoteRequest>) => Promise<boolean>;
  updateStatus: (status: QuoteStatus) => Promise<boolean>;
}

export function useQuoteDetails({
  quoteId,
  enabled = true,
}: UseQuoteDetailsOptions): UseQuoteDetailsReturn {
  const { toast } = useToast();
  const [quote, setQuote] = useState<QuoteRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = useCallback(async () => {
    if (!quoteId || !enabled) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("quote_requests")
        .select("*")
        .eq("id", quoteId)
        .single();

      if (fetchError) throw fetchError;
      setQuote(data as QuoteRequest);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Kunde inte hämta förfrågan";
      setError(message);
      console.error("Error fetching quote:", err);
    } finally {
      setLoading(false);
    }
  }, [quoteId, enabled]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  const updateQuote = useCallback(
    async (updates: Partial<QuoteRequest>): Promise<boolean> => {
      if (!quoteId) return false;

      try {
        const { error: updateError } = await supabase
          .from("quote_requests")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", quoteId);

        if (updateError) throw updateError;

        toast({
          title: "Sparat",
          description: "Förfrågan har uppdaterats",
        });

        await fetchQuote();
        return true;
      } catch (err) {
        toast({
          title: "Fel",
          description: "Kunde inte spara förfrågan",
          variant: "destructive",
        });
        return false;
      }
    },
    [quoteId, fetchQuote, toast]
  );

  const updateStatus = useCallback(
    async (status: QuoteStatus): Promise<boolean> => {
      return updateQuote({ status } as Partial<QuoteRequest>);
    },
    [updateQuote]
  );

  return {
    quote,
    loading,
    error,
    refetch: fetchQuote,
    updateQuote,
    updateStatus,
  };
}
