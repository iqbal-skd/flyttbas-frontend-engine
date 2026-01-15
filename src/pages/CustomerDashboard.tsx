import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  DashboardLayout,
  DashboardHeader,
  LoadingSpinner,
  EmptyState,
  QuoteCard,
  OfferCard,
  JobProgressCard,
  QuoteDetailHeader,
  TrustSignalsFooter,
} from "@/components/dashboard";
import { FileText, Clock, Plus, Truck } from "lucide-react";
import { getDaysUntilMove } from "@/lib/dashboard-utils";
import type { QuoteRequest, Offer, Review } from "@/types/customer-dashboard";

const CustomerDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offerCounts, setOfferCounts] = useState<Record<string, number>>({});
  const [partnerReviews, setPartnerReviews] = useState<Record<string, Review[]>>({});
  const [loadingData, setLoadingData] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Batch fetch offer counts for all quotes - fixes N+1 query
  const fetchOfferCounts = useCallback(async (quoteIds: string[]) => {
    if (quoteIds.length === 0) return {};

    // Use a single query with grouping via RPC or multiple parallel queries
    // Since Supabase doesn't support GROUP BY easily, we'll use Promise.all
    // which is still better than sequential queries
    const countPromises = quoteIds.map(async (id) => {
      const { count } = await supabase
        .from("offers")
        .select("*", { count: "exact", head: true })
        .eq("quote_request_id", id)
        .in("status", ["pending", "approved"]);
      return { id, count: count || 0 };
    });

    const results = await Promise.all(countPromises);
    return results.reduce(
      (acc, { id, count }) => ({ ...acc, [id]: count }),
      {} as Record<string, number>
    );
  }, []);

  // Batch fetch reviews for all partners - fixes N+1 query
  const fetchPartnerReviews = useCallback(async (partnerIds: string[]) => {
    if (partnerIds.length === 0) return {};

    // Single query to get all reviews for all partners
    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("id, partner_id, rating, comment, created_at")
      .in("partner_id", partnerIds)
      .order("created_at", { ascending: false });

    if (!reviewsData) return {};

    // Group reviews by partner_id and limit to 2 per partner
    const grouped: Record<string, Review[]> = {};
    for (const review of reviewsData) {
      if (!grouped[review.partner_id]) {
        grouped[review.partner_id] = [];
      }
      if (grouped[review.partner_id].length < 2) {
        grouped[review.partner_id].push(review);
      }
    }
    return grouped;
  }, []);

  const fetchQuotes = useCallback(async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile?.email) {
        setLoadingData(false);
        return;
      }

      const { data: quotesData, error } = await supabase
        .from("quote_requests")
        .select("*")
        .or(`customer_id.eq.${user.id},customer_email.eq.${profile.email}`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const typedQuotes = (quotesData || []) as QuoteRequest[];
      setQuotes(typedQuotes);

      if (typedQuotes.length > 0) {
        // Batch fetch offer counts (parallel instead of sequential)
        const counts = await fetchOfferCounts(typedQuotes.map((q) => q.id));
        setOfferCounts(counts);

        // Select first quote and fetch its offers
        setSelectedQuote(typedQuotes[0]);
        await fetchOffers(typedQuotes[0].id);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
      toast({
        variant: "destructive",
        title: "Fel",
        description: "Kunde inte hämta förfrågningar.",
      });
    } finally {
      setLoadingData(false);
    }
  }, [user, fetchOfferCounts, toast]);

  const fetchOffers = useCallback(
    async (quoteId: string) => {
      setLoadingOffers(true);

      try {
        const { data: offersData, error } = await supabase
          .from("offers")
          .select(
            `
            *,
            partners(
              id,
              company_name,
              contact_name,
              contact_email,
              contact_phone,
              average_rating,
              total_reviews,
              completed_jobs,
              is_sponsored,
              f_tax_certificate
            )
          `
          )
          .eq("quote_request_id", quoteId)
          .in("status", ["pending", "approved", "rejected"])
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (offersData) {
          // Sort: sponsored first, then by price
          const sorted = [...offersData].sort((a, b) => {
            const aSponsored = a.partners?.is_sponsored ?? false;
            const bSponsored = b.partners?.is_sponsored ?? false;
            if (aSponsored && !bSponsored) return -1;
            if (!aSponsored && bSponsored) return 1;
            return a.total_price - b.total_price;
          });

          setOffers(sorted as Offer[]);

          // Batch fetch reviews for all partners in this quote
          const partnerIds = offersData
            .map((o) => o.partners?.id)
            .filter((id): id is string => !!id);
          const uniquePartnerIds = [...new Set(partnerIds)];
          const reviews = await fetchPartnerReviews(uniquePartnerIds);
          setPartnerReviews(reviews);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
        toast({
          variant: "destructive",
          title: "Fel",
          description: "Kunde inte hämta offerter.",
        });
      } finally {
        setLoadingOffers(false);
      }
    },
    [fetchPartnerReviews, toast]
  );

  useEffect(() => {
    if (user) {
      fetchQuotes();
    }
  }, [user, fetchQuotes]);

  const handleSelectQuote = useCallback(
    (quote: QuoteRequest) => {
      setSelectedQuote(quote);
      fetchOffers(quote.id);
    },
    [fetchOffers]
  );

  const handleApproveOffer = async (offerId: string) => {
    const approvedOffer = offers.find((o) => o.id === offerId);
    if (!approvedOffer || !approvedOffer.partners || !selectedQuote) {
      toast({
        variant: "destructive",
        title: "Fel",
        description: "Kunde inte hitta offertinformation.",
      });
      return;
    }

    try {
      // Update offer status
      await supabase.from("offers").update({ status: "approved" }).eq("id", offerId);

      // Reject other offers
      await supabase
        .from("offers")
        .update({ status: "rejected" })
        .eq("quote_request_id", selectedQuote.id)
        .neq("id", offerId);

      // Update quote status
      await supabase
        .from("quote_requests")
        .update({ status: "offer_approved" })
        .eq("id", selectedQuote.id);

      // Send notification email (non-blocking)
      supabase.functions
        .invoke("send-offer-accepted", {
          body: {
            partnerEmail: approvedOffer.partners.contact_email,
            partnerName: approvedOffer.partners.contact_name,
            companyName: approvedOffer.partners.company_name,
            customerName: selectedQuote.customer_name,
            customerEmail: selectedQuote.customer_email,
            customerPhone: selectedQuote.customer_phone || "",
            offerPrice: approvedOffer.total_price,
            moveDate: selectedQuote.move_date,
            fromAddress: selectedQuote.from_address,
            toAddress: selectedQuote.to_address,
          },
        })
        .catch((err) => console.error("Failed to send notification:", err));

      toast({
        title: "Offert godkänd!",
        description: "Flyttfirman har meddelats och kommer kontakta dig.",
      });

      // Refresh data
      fetchQuotes();
    } catch (error) {
      console.error("Error approving offer:", error);
      toast({
        variant: "destructive",
        title: "Fel",
        description: "Kunde inte godkänna offerten.",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || loadingData) {
    return (
      <DashboardLayout title="Mina Förfrågningar">
        <LoadingSpinner fullScreen={false} />
      </DashboardLayout>
    );
  }

  const approvedOffer = offers.find((o) => o.status === "approved");
  const pendingOffers = offers.filter((o) => o.status !== "rejected");

  return (
    <DashboardLayout title="Mina Förfrågningar">
      <DashboardHeader
        title="Mina Förfrågningar"
        subtitle="Hantera dina flyttförfrågningar och offerter"
        onSignOut={handleSignOut}
      >
        <Button asChild>
          <Link to="/#quote-wizard">
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Ny förfrågan
          </Link>
        </Button>
      </DashboardHeader>

      {quotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Inga förfrågningar ännu"
          description="Skapa din första flyttförfrågan och få offerter från verifierade flyttfirmor."
          action={{
            label: "Jämför offerter gratis",
            href: "/#quote-wizard",
          }}
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quote List */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Dina förfrågningar ({quotes.length})
            </h2>
            {quotes.map((quote) => (
              <QuoteCard
                key={quote.id}
                id={quote.id}
                moveDate={quote.move_date}
                status={quote.status}
                fromAddress={quote.from_address}
                fromPostalCode={quote.from_postal_code}
                toAddress={quote.to_address}
                toPostalCode={quote.to_postal_code}
                dwellingType={quote.dwelling_type}
                areaM2={quote.area_m2}
                rooms={quote.rooms}
                offerCount={offerCounts[quote.id] || 0}
                isSelected={selectedQuote?.id === quote.id}
                onClick={() => handleSelectQuote(quote)}
              />
            ))}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2 space-y-4">
            {selectedQuote && (
              <>
                {/* Quote Header */}
                <QuoteDetailHeader quote={selectedQuote} />

                {/* Job Progress (for approved offers) */}
                {approvedOffer && approvedOffer.partners && (
                  <JobProgressCard
                    jobStatus={approvedOffer.job_status}
                    jobStatusUpdatedAt={approvedOffer.job_status_updated_at}
                    jobNotes={approvedOffer.job_notes}
                    partner={approvedOffer.partners}
                    daysUntilMove={getDaysUntilMove(selectedQuote.move_date)}
                  />
                )}

                {/* Offers Section */}
                {!approvedOffer && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Truck className="h-5 w-5" aria-hidden="true" />
                        Offerter ({pendingOffers.length})
                      </h3>

                      {loadingOffers ? (
                        <div className="py-12 flex justify-center">
                          <LoadingSpinner fullScreen={false} />
                        </div>
                      ) : pendingOffers.length === 0 ? (
                        <div className="text-center py-12 bg-secondary/30 rounded-lg">
                          <Clock
                            className="h-12 w-12 mx-auto mb-4 text-muted-foreground"
                            aria-hidden="true"
                          />
                          <p className="font-semibold text-lg mb-2">
                            Väntar på offerter
                          </p>
                          <p className="text-muted-foreground max-w-md mx-auto">
                            Våra verifierade partners granskar din förfrågan. Du får
                            ett mejl så snart offerter kommer in.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {pendingOffers.map((offer) => (
                            <OfferCard
                              key={offer.id}
                              id={offer.id}
                              totalPrice={offer.total_price}
                              priceBeforeRut={offer.price_before_rut}
                              estimatedHours={offer.estimated_hours}
                              teamSize={offer.team_size}
                              timeWindow={offer.time_window}
                              status={offer.status}
                              terms={offer.terms}
                              distanceKm={offer.distance_km}
                              partner={offer.partners}
                              reviews={
                                offer.partners?.id
                                  ? partnerReviews[offer.partners.id]
                                  : undefined
                              }
                              onApprove={() => handleApproveOffer(offer.id)}
                              approveDisabled={
                                selectedQuote.status === "offer_approved"
                              }
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Trust Signals */}
                <TrustSignalsFooter />
              </>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CustomerDashboard;
