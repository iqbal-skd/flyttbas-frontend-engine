/**
 * useOfferDetails - Hook for fetching and managing single offer
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Offer, OfferStatus, JobStatus, PartnerDetails, QuoteSummary } from "../types";

interface UseOfferDetailsOptions {
  offerId: string | null;
  enabled?: boolean;
}

interface OfferDetailsData {
  offer: Offer | null;
  partner: PartnerDetails | null;
  quote: QuoteSummary | null;
}

interface UseOfferDetailsReturn extends OfferDetailsData {
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateOffer: (updates: Partial<Offer>) => Promise<boolean>;
  updateStatus: (status: OfferStatus) => Promise<boolean>;
  updateJobStatus: (jobStatus: JobStatus, notes?: string) => Promise<boolean>;
}

export function useOfferDetails({
  offerId,
  enabled = true,
}: UseOfferDetailsOptions): UseOfferDetailsReturn {
  const { toast } = useToast();
  const [data, setData] = useState<OfferDetailsData>({
    offer: null,
    partner: null,
    quote: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOffer = useCallback(async () => {
    if (!offerId || !enabled) return;

    setLoading(true);
    setError(null);

    try {
      const { data: offerData, error: fetchError } = await supabase
        .from("offers")
        .select(`
          *,
          partner:partners(
            id,
            company_name,
            contact_name,
            contact_email,
            contact_phone,
            average_rating,
            total_reviews,
            completed_jobs
          ),
          quote_request:quote_requests(
            id,
            customer_name,
            customer_email,
            customer_phone,
            from_address,
            from_postal_code,
            to_address,
            to_postal_code,
            move_date
          )
        `)
        .eq("id", offerId)
        .single();

      if (fetchError) throw fetchError;

      const typedData = offerData as unknown as {
        partner: PartnerDetails;
        quote_request: QuoteSummary;
      } & Offer;

      setData({
        offer: typedData,
        partner: typedData.partner,
        quote: typedData.quote_request,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Kunde inte hämta offert";
      setError(message);
      console.error("Error fetching offer:", err);
    } finally {
      setLoading(false);
    }
  }, [offerId, enabled]);

  useEffect(() => {
    fetchOffer();
  }, [fetchOffer]);

  const updateOffer = useCallback(
    async (updates: Partial<Offer>): Promise<boolean> => {
      if (!offerId) return false;

      try {
        const { error: updateError } = await supabase
          .from("offers")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", offerId);

        if (updateError) throw updateError;

        toast({
          title: "Sparat",
          description: "Offerten har uppdaterats",
        });

        await fetchOffer();
        return true;
      } catch (err) {
        toast({
          title: "Fel",
          description: "Kunde inte spara offert",
          variant: "destructive",
        });
        return false;
      }
    },
    [offerId, fetchOffer, toast]
  );

  const updateStatus = useCallback(
    async (status: OfferStatus): Promise<boolean> => {
      return updateOffer({ status } as Partial<Offer>);
    },
    [updateOffer]
  );

  const updateJobStatus = useCallback(
    async (jobStatus: JobStatus, notes?: string): Promise<boolean> => {
      if (!offerId) return false;

      try {
        const updates: Record<string, unknown> = {
          job_status: jobStatus,
          job_status_updated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (notes !== undefined) {
          updates.job_notes = notes;
        }

        const { error: updateError } = await supabase
          .from("offers")
          .update(updates)
          .eq("id", offerId);

        if (updateError) throw updateError;

        toast({
          title: "Uppdaterat",
          description: "Jobbstatus har ändrats",
        });

        await fetchOffer();
        return true;
      } catch (err) {
        toast({
          title: "Fel",
          description: "Kunde inte uppdatera jobbstatus",
          variant: "destructive",
        });
        return false;
      }
    },
    [offerId, fetchOffer, toast]
  );

  return {
    ...data,
    loading,
    error,
    refetch: fetchOffer,
    updateOffer,
    updateStatus,
    updateJobStatus,
  };
}
