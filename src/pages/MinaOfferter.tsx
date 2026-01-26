import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  CheckCircle,
  Clock,
  Star,
  MapPin,
  Calendar,
  Users,
  Truck,
  Shield,
  Phone,
  Mail,
} from "lucide-react";

interface Offer {
  id: string;
  total_price: number;
  price_before_rut: number;
  rut_deduction: number;
  estimated_hours: number;
  team_size: number;
  time_window: string;
  terms: string | null;
  status: string;
  distance_km: number | null;
  ranking_score: number | null;
  partners: {
    id: string;
    company_name: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    average_rating: number;
    total_reviews: number;
    completed_jobs: number;
    is_sponsored: boolean;
  } | null;
}

interface QuoteRequest {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  from_address: string;
  to_address: string;
  move_date: string;
  status: string;
}

const MinaOfferter = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  
  const quoteId = searchParams.get("quote");
  
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<QuoteRequest | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [approving, setApproving] = useState<string | null>(null);

  // If no quote ID and user is authenticated, redirect to dashboard
  useEffect(() => {
    if (!authLoading && !quoteId) {
      if (user) {
        navigate("/dashboard", { replace: true });
      } else {
        setLoading(false);
      }
    }
  }, [quoteId, user, authLoading, navigate]);

  useEffect(() => {
    if (quoteId) {
      fetchOffers();
    }
  }, [quoteId]);

  const fetchOffers = async () => {
    try {
      // Fetch quote
      const { data: quoteData, error: quoteError } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('id', quoteId)
        .maybeSingle();

      if (quoteError || !quoteData) {
        toast({
          variant: "destructive",
          title: "Fel",
          description: "Kunde inte hitta din förfrågan.",
        });
        setLoading(false);
        return;
      }

      setQuote(quoteData);

      // Fetch offers (include all statuses to show approved offers)
      const { data: offersData } = await supabase
        .from('offers')
        .select('*, partners(id, company_name, contact_name, contact_email, contact_phone, average_rating, total_reviews, completed_jobs, is_sponsored)')
        .eq('quote_request_id', quoteId)
        .in('status', ['pending', 'approved'])
        .order('ranking_score', { ascending: false });

      if (offersData) {
        // Sort: sponsored first, then by ranking score
        const sorted = offersData.sort((a, b) => {
          if (a.partners?.is_sponsored && !b.partners?.is_sponsored) return -1;
          if (!a.partners?.is_sponsored && b.partners?.is_sponsored) return 1;
          return (b.ranking_score || 0) - (a.ranking_score || 0);
        });
        setOffers(sorted);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOffer = async (offerId: string) => {
    setApproving(offerId);

    try {
      // Find the offer being approved
      const approvedOffer = offers.find(o => o.id === offerId);
      if (!approvedOffer || !approvedOffer.partners) {
        throw new Error("Kunde inte hitta offertinformation");
      }

      // Update offer status
      const { error: offerError } = await supabase
        .from('offers')
        .update({ status: 'approved' })
        .eq('id', offerId);

      if (offerError) throw offerError;

      // Reject other offers
      await supabase
        .from('offers')
        .update({ status: 'rejected' })
        .eq('quote_request_id', quoteId)
        .neq('id', offerId);

      // Update quote status
      await supabase
        .from('quote_requests')
        .update({ status: 'offer_approved' })
        .eq('id', quoteId);

      // Send email notification to partner
      try {
        const { error: fnError } = await supabase.functions.invoke('send-offer-accepted', {
          body: {
            partnerEmail: approvedOffer.partners.contact_email,
            partnerName: approvedOffer.partners.contact_name,
            companyName: approvedOffer.partners.company_name,
            customerName: quote?.customer_name,
            customerEmail: quote?.customer_email,
            customerPhone: quote?.customer_phone || '',
            offerPrice: approvedOffer.total_price,
            moveDate: quote?.move_date,
            fromAddress: quote?.from_address,
            toAddress: quote?.to_address,
          }
        });
        
        if (fnError) {
          console.error("Failed to send notification to partner:", fnError);
        }
      } catch (emailError) {
        console.error("Failed to send notification to partner:", emailError);
      }

      toast({
        title: "Offert godkänd!",
        description: "Flyttfirman har meddelats och kommer kontakta dig.",
      });

      // Refresh
      fetchOffers();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Fel",
        description: error.message || "Kunde inte godkänna offerten.",
      });
    } finally {
      setApproving(null);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </>
    );
  }

  if (!quoteId || !quote) {
    return (
      <>
        <Helmet>
          <title>Mina Offerter | Flyttbas</title>
        </Helmet>
        <Header />
        <main className="min-h-screen bg-background py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Ingen förfrågan hittades</h1>
            <p className="text-muted-foreground mb-8">
              Kolla din e-post för länken till dina offerter.
            </p>
            <Button onClick={() => navigate("/")}>
              Tillbaka till startsidan
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const approvedOffer = offers.find(o => o.status === 'approved');

  return (
    <>
      <Helmet>
        <title>Dina Offerter | Flyttbas</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Header />
      
      <main className="min-h-screen bg-secondary/30 py-8 sm:py-16">
        <div className="container mx-auto px-4">
          {/* Quote Summary */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold mb-2">Din flyttförfrågan</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{quote.from_address} → {quote.to_address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(quote.move_date).toLocaleDateString('sv-SE')}</span>
                  </div>
                </div>
                <Badge className={
                  quote.status === 'offer_approved' ? 'bg-green-100 text-green-800' :
                  quote.status === 'offers_received' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }>
                  {quote.status === 'pending' ? 'Väntar på offerter' :
                   quote.status === 'offers_received' ? 'Offerter mottagna' :
                   quote.status === 'offer_approved' ? 'Offert godkänd' :
                   quote.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Offers */}
          <h2 className="text-lg font-semibold mb-4">
            {offers.length > 0 ? `${offers.length} offerter` : 'Inga offerter ännu'}
          </h2>

          {offers.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">Väntar på offerter</h3>
                <p className="text-muted-foreground">
                  Våra partners granskar din förfrågan. Du får ett mejl när offerter kommer in.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {offers.map((offer, index) => (
                <Card key={offer.id} className={offer.partners?.is_sponsored ? 'ring-2 ring-primary' : ''}>
                  {offer.partners?.is_sponsored && (
                    <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 text-center">
                      ⭐ Sponsrad partner
                    </div>
                  )}
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      {/* Partner Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Truck className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{offer.partners?.company_name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                {offer.partners?.average_rating.toFixed(1)} ({offer.partners?.total_reviews} omdömen)
                              </span>
                              <span>{offer.partners?.completed_jobs} genomförda jobb</span>
                            </div>
                          </div>
                        </div>

                        {/* Offer Details */}
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Tidsfönster</p>
                            <p className="font-medium">{offer.time_window}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Uppskattad tid</p>
                            <p className="font-medium">{offer.estimated_hours} timmar</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Team</p>
                            <p className="font-medium flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {offer.team_size} personer
                            </p>
                          </div>
                          {offer.distance_km && (
                            <div>
                              <p className="text-xs text-muted-foreground">Avstånd</p>
                              <p className="font-medium">{offer.distance_km} km</p>
                            </div>
                          )}
                        </div>

                        {offer.terms && (
                          <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                            <p className="text-sm">{offer.terms}</p>
                          </div>
                        )}

                        {/* Show partner contact info when offer is approved */}
                        {offer.status === 'approved' && offer.partners && (
                          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              Kontaktuppgifter till {offer.partners.company_name}
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p className="flex items-center gap-2">
                                <span className="text-muted-foreground">Kontaktperson:</span>
                                <span className="font-medium">{offer.partners.contact_name}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <a href={`mailto:${offer.partners.contact_email}`} className="text-primary hover:underline">
                                  {offer.partners.contact_email}
                                </a>
                              </p>
                              {offer.partners.contact_phone && (
                                <p className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <a href={`tel:${offer.partners.contact_phone}`} className="text-primary hover:underline">
                                    {offer.partners.contact_phone}
                                  </a>
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Price & Action */}
                      <div className="lg:text-right lg:min-w-[200px]">
                        <div className="mb-4">
                          <p className="text-3xl font-bold text-primary">
                            {offer.total_price.toLocaleString('sv-SE')} kr
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Efter RUT: ca {Math.ceil(offer.total_price * 0.5).toLocaleString('sv-SE')} kr
                          </p>
                        </div>

                        {quote.status !== 'offer_approved' && offer.status === 'pending' && (
                          <Button
                            className="w-full lg:w-auto"
                            onClick={() => handleApproveOffer(offer.id)}
                            disabled={approving === offer.id}
                          >
                            {approving === offer.id ? 'Godkänner...' : 'Godkänn offert'}
                          </Button>
                        )}

                        {offer.status === 'approved' && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Godkänd
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Trust Signals */}
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Verifierade partners</p>
                <p className="text-sm text-muted-foreground">Alla har licens & försäkring</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Riktiga omdömen</p>
                <p className="text-sm text-muted-foreground">Från verifierade kunder</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Ingen förpliktelse</p>
                <p className="text-sm text-muted-foreground">Gratis att jämföra offerter</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default MinaOfferter;
