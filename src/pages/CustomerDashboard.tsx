import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  DashboardLayout,
  DashboardHeader,
  LoadingSpinner,
  EmptyState,
  QuoteCard,
  OfferCard,
} from "@/components/dashboard";
import {
  FileText,
  Clock,
  Plus,
  Truck,
} from "lucide-react";

interface QuoteRequest {
  id: string;
  from_address: string;
  from_postal_code: string;
  to_address: string;
  to_postal_code: string;
  move_date: string;
  dwelling_type: string;
  area_m2: number;
  status: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
}

interface Offer {
  id: string;
  total_price: number;
  price_before_rut: number;
  estimated_hours: number;
  team_size: number;
  time_window: string;
  status: string;
  created_at: string;
  partners: {
    company_name: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    average_rating: number;
    total_reviews: number;
  } | null;
}

const CustomerDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchQuotes();
    }
  }, [user]);

  const fetchQuotes = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (profile?.email) {
        const { data: quotesData, error } = await supabase
          .from('quote_requests')
          .select('*')
          .or(`customer_id.eq.${user?.id},customer_email.eq.${profile.email}`)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setQuotes(quotesData || []);

        if (quotesData && quotesData.length > 0) {
          setSelectedQuote(quotesData[0]);
          fetchOffers(quotesData[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchOffers = async (quoteId: string) => {
    const { data: offersData } = await supabase
      .from('offers')
      .select('*, partners(company_name, contact_name, contact_email, contact_phone, average_rating, total_reviews)')
      .eq('quote_request_id', quoteId)
      .in('status', ['pending', 'approved', 'rejected'])
      .order('created_at', { ascending: false });

    if (offersData) {
      setOffers(offersData);
    }
  };

  const handleSelectQuote = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    fetchOffers(quote.id);
  };

  const handleApproveOffer = async (offerId: string) => {
    try {
      const approvedOffer = offers.find(o => o.id === offerId);
      if (!approvedOffer || !approvedOffer.partners) {
        throw new Error("Kunde inte hitta offertinformation");
      }

      await supabase
        .from('offers')
        .update({ status: 'approved' })
        .eq('id', offerId);

      if (selectedQuote) {
        await supabase
          .from('offers')
          .update({ status: 'rejected' })
          .eq('quote_request_id', selectedQuote.id)
          .neq('id', offerId);

        await supabase
          .from('quote_requests')
          .update({ status: 'offer_approved' })
          .eq('id', selectedQuote.id);

        try {
          await supabase.functions.invoke('send-offer-accepted', {
            body: {
              partnerEmail: approvedOffer.partners.contact_email,
              partnerName: approvedOffer.partners.contact_name,
              companyName: approvedOffer.partners.company_name,
              customerName: selectedQuote.customer_name,
              customerEmail: selectedQuote.customer_email,
              customerPhone: selectedQuote.customer_phone || '',
              offerPrice: approvedOffer.total_price,
              moveDate: selectedQuote.move_date,
              fromAddress: selectedQuote.from_address,
              toAddress: selectedQuote.to_address,
            }
          });
        } catch (emailError) {
          console.error("Failed to send notification to partner:", emailError);
        }
      }

      toast({
        title: "Offert godkänd!",
        description: "Flyttfirman har meddelats och kommer kontakta dig.",
      });

      fetchQuotes();
    } catch (error) {
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

  return (
    <DashboardLayout title="Mina Förfrågningar">
      <DashboardHeader
        title="Mina Förfrågningar"
        subtitle="Hantera dina flyttförfrågningar och offerter"
        onSignOut={handleSignOut}
      >
        <Button asChild>
          <Link to="/#quote-wizard">
            <Plus className="h-4 w-4 mr-2" />
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
                isSelected={selectedQuote?.id === quote.id}
                onClick={() => handleSelectQuote(quote)}
              />
            ))}
          </div>

          {/* Offers Panel */}
          <div className="lg:col-span-2">
            {selectedQuote && (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Flytt {new Date(selectedQuote.move_date).toLocaleDateString('sv-SE')}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {selectedQuote.from_address || selectedQuote.from_postal_code} → {selectedQuote.to_address || selectedQuote.to_postal_code}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Offerter ({offers.length})
                  </h3>

                  {offers.length === 0 ? (
                    <div className="text-center py-8 bg-secondary/50 rounded-lg">
                      <Clock className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                      <p className="font-medium">Väntar på offerter</p>
                      <p className="text-sm text-muted-foreground">
                        Våra partners granskar din förfrågan. Du får besked via e-post.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {offers.map((offer) => (
                        <OfferCard
                          key={offer.id}
                          id={offer.id}
                          totalPrice={offer.total_price}
                          priceBeforeRut={offer.price_before_rut}
                          estimatedHours={offer.estimated_hours}
                          teamSize={offer.team_size}
                          timeWindow={offer.time_window}
                          status={offer.status}
                          partner={offer.partners}
                          showContactInfo={true}
                          onApprove={
                            offer.status === 'pending' && selectedQuote.status !== 'offer_approved'
                              ? () => handleApproveOffer(offer.id)
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CustomerDashboard;
