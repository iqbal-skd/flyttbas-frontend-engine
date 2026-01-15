/**
 * useQuoteOffers - Hook for managing offers for a quote
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { OfferWithPartner, OfferStatus } from "../types";

interface UseQuoteOffersOptions {
  quoteId: string | null;
  enabled?: boolean;
}

interface UseQuoteOffersReturn {
  offers: OfferWithPartner[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateOfferStatus: (offerId: string, status: OfferStatus) => Promise<boolean>;
  deleteOffer: (offerId: string) => Promise<boolean>;
  addPartnerToQuote: (partnerId: string, quoteData: { move_date: string }) => Promise<boolean>;
}

export function useQuoteOffers({
  quoteId,
  enabled = true,
}: UseQuoteOffersOptions): UseQuoteOffersReturn {
  const { toast } = useToast();
  const [offers, setOffers] = useState<OfferWithPartner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = useCallback(async () => {
    if (!quoteId || !enabled) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("offers")
        .select(`
          *,
          partner:partners(
            company_name,
            contact_email,
            contact_phone,
            average_rating,
            total_reviews,
            completed_jobs
          )
        `)
        .eq("quote_request_id", quoteId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setOffers((data as unknown as OfferWithPartner[]) || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Kunde inte hämta offerter";
      setError(message);
      console.error("Error fetching offers:", err);
    } finally {
      setLoading(false);
    }
  }, [quoteId, enabled]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const updateOfferStatus = useCallback(
    async (offerId: string, status: OfferStatus): Promise<boolean> => {
      try {
        const { error: updateError } = await supabase
          .from("offers")
          .update({ status, updated_at: new Date().toISOString() })
          .eq("id", offerId);

        if (updateError) throw updateError;

        toast({
          title: "Uppdaterat",
          description: `Offert ${status === "approved" ? "godkänd" : "avvisad"}`,
        });

        await fetchOffers();
        return true;
      } catch (err) {
        toast({
          title: "Fel",
          description: "Kunde inte uppdatera offert",
          variant: "destructive",
        });
        return false;
      }
    },
    [fetchOffers, toast]
  );

  const deleteOffer = useCallback(
    async (offerId: string): Promise<boolean> => {
      try {
        const { error: deleteError } = await supabase
          .from("offers")
          .delete()
          .eq("id", offerId);

        if (deleteError) throw deleteError;

        toast({
          title: "Borttaget",
          description: "Offerten har tagits bort",
        });

        await fetchOffers();
        return true;
      } catch (err) {
        toast({
          title: "Fel",
          description: "Kunde inte ta bort offert",
          variant: "destructive",
        });
        return false;
      }
    },
    [fetchOffers, toast]
  );

  const addPartnerToQuote = useCallback(
    async (partnerId: string, quoteData: { move_date: string }): Promise<boolean> => {
      if (!quoteId) return false;

      try {
        const { error: insertError } = await supabase.from("offers").insert({
          quote_request_id: quoteId,
          partner_id: partnerId,
          available_date: quoteData.move_date,
          time_window: "08:00-17:00",
          estimated_hours: 4,
          team_size: 2,
          price_before_rut: 0,
          total_price: 0,
          valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: "pending",
        });

        if (insertError) throw insertError;

        toast({
          title: "Tillagt",
          description: "Partner har lagts till på förfrågan",
        });

        await fetchOffers();
        return true;
      } catch (err) {
        toast({
          title: "Fel",
          description: "Kunde inte lägga till partner",
          variant: "destructive",
        });
        return false;
      }
    },
    [quoteId, fetchOffers, toast]
  );

  return {
    offers,
    loading,
    error,
    refetch: fetchOffers,
    updateOfferStatus,
    deleteOffer,
    addPartnerToQuote,
  };
}
